import { createHash } from "node:crypto"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"
import { createClient } from "@supabase/supabase-js"

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND_DIR = path.resolve(SCRIPT_DIR, "..")
const PROJECT_ROOT = path.resolve(FRONTEND_DIR, "..")
const MAP_PATH = path.join(SCRIPT_DIR, "image-map.json")
const ENV_PATH = path.join(FRONTEND_DIR, ".env.local")
const BUCKET = "site-media"
const MAX_EDGE = 1600

function parseArgs(args) {
  const options = { dryRun: false, includeClient: false, only: null }
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index]
    if (value === "--dry-run") options.dryRun = true
    else if (value === "--client") options.includeClient = true
    else if (value === "--only") {
      options.only = args[index + 1]
      if (!options.only || options.only.startsWith("--")) {
        throw new Error("--only requires a tour, region, or home slug")
      }
      index += 1
    } else {
      throw new Error(`Unknown option: ${value}`)
    }
  }
  return options
}

function parseEnvFile(contents) {
  const values = {}
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match) continue
    let value = match[2].trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    } else {
      value = value.replace(/\s+#.*$/, "")
    }
    values[match[1]] = value
  }
  return values
}

function resolveSource(source) {
  return /^https?:\/\//i.test(source)
    ? source
    : path.resolve(PROJECT_ROOT, source)
}

async function findImageFiles(directory) {
  let entries
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch (error) {
    if (error.code === "ENOENT") return []
    throw error
  }
  const files = []
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await findImageFiles(entryPath)))
    else if (/\.(avif|gif|jpe?g|png|tiff?|webp)$/i.test(entry.name)) files.push(entryPath)
  }
  return files
}

async function warnUnmappedSources(jobs, includeClient) {
  const roots = [
    path.join(FRONTEND_DIR, "src", "imports", "tours"),
    path.join(FRONTEND_DIR, "src", "imports", "homepage"),
    path.join(FRONTEND_DIR, "src", "imports", "photos"),
  ]
  if (includeClient) roots.push(path.join(PROJECT_ROOT, "image_client"))
  const mapped = new Set(
    jobs
      .filter((job) => !/^https?:\/\//i.test(job.source))
      .map((job) => resolveSource(job.source).toLowerCase()),
  )
  for (const root of roots) {
    for (const file of await findImageFiles(root)) {
      if (!mapped.has(file.toLowerCase())) {
        console.warn(`Unmapped image skipped: ${path.relative(PROJECT_ROOT, file)}`)
      }
    }
  }
}

function buildJobs(imageMap, includeClient) {
  const jobs = []

  for (const tour of imageMap.tours) {
    const images = [...tour.images].sort(
      (left, right) => Number(Boolean(right.cover)) - Number(Boolean(left.cover)),
    )
    images.forEach((image, index) => {
      const isCover = index === 0
      const filename = isCover ? "cover.webp" : `${String(index).padStart(2, "0")}.webp`
      jobs.push({
        kind: "tour",
        slug: tour.slug,
        group: `tour:${tour.slug}`,
        source: image.source,
        alt: image.alt,
        target: `tours/${tour.slug}/${filename}`,
        sort: index,
        isCover,
      })
    })
  }

  for (const region of imageMap.regions) {
    jobs.push({
      kind: "region",
      slug: region.slug,
      group: `region:${region.slug}`,
      source: region.source,
      alt: region.alt,
      target: `regions/${region.slug}.webp`,
    })
  }

  for (const home of imageMap.home) {
    jobs.push({
      kind: "home",
      slug: home.name,
      group: `home:${home.name}`,
      source: home.source,
      alt: home.alt,
      target: `home/${home.name}.webp`,
    })
  }

  if (includeClient) {
    const clientPath = path.resolve(PROJECT_ROOT, imageMap.clientToursFile)
    return readFile(clientPath, "utf8").then((contents) => {
      const clientTours = JSON.parse(contents).tours ?? []
      for (const tour of clientTours) {
        const orderedSources = [tour.image, ...(tour.gallery ?? [])].filter(Boolean)
        const uniqueSources = [...new Set(orderedSources)]
        uniqueSources.forEach((source, index) => {
          const isCover = index === 0
          const filename = isCover ? "cover.webp" : `${String(index).padStart(2, "0")}.webp`
          jobs.push({
            kind: "tour",
            slug: tour.slug,
            group: `tour:${tour.slug}`,
            source,
            alt: `${tour.title} (${index + 1})`,
            target: `tours/${tour.slug}/${filename}`,
            sort: index,
            isCover,
            client: true,
          })
        })
      }
      return jobs
    })
  }

  return Promise.resolve(jobs)
}

async function bytesFor(job) {
  if (/^https?:\/\//i.test(job.source)) {
    const response = await fetch(job.source)
    if (!response.ok) {
      throw new Error(`Could not download ${job.source}: HTTP ${response.status}`)
    }
    return Buffer.from(await response.arrayBuffer())
  }
  return readFile(resolveSource(job.source))
}

async function dedupeJobs(jobs) {
  const hashesByGroup = new Map()
  const deduped = []
  for (const job of jobs) {
    if (/^https?:\/\//i.test(job.source)) {
      deduped.push(job)
      continue
    }
    const bytes = await bytesFor(job)
    const hash = createHash("sha256").update(bytes).digest("hex")
    const hashes = hashesByGroup.get(job.group) ?? new Set()
    if (hashes.has(hash)) {
      console.warn(`Duplicate image skipped for ${job.slug}: ${job.source}`)
      continue
    }
    hashes.add(hash)
    hashesByGroup.set(job.group, hashes)
    deduped.push(job)
  }
  return deduped
}

function dimensionsAfterResize(width, height) {
  if (!width || !height) return "dimensions unavailable"
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height))
  return `${Math.round(width * scale)}x${Math.round(height * scale)}`
}

async function printDryRun(jobs) {
  console.log(`Dry run: ${jobs.length} image(s), bucket ${BUCKET}`)
  for (const job of jobs) {
    let sourceLabel = "remote source; dimensions not checked (no network in dry-run)"
    if (!/^https?:\/\//i.test(job.source)) {
      const metadata = await sharp(await bytesFor(job)).rotate().metadata()
      let { width, height } = metadata
      if ([5, 6, 7, 8].includes(metadata.orientation ?? 0)) {
        const rotatedWidth = height
        height = width
        width = rotatedWidth
      }
      sourceLabel = dimensionsAfterResize(width, height)
    }
    console.log(`${sourceLabel.padEnd(44)} ${job.source} -> ${job.target}`)
  }
}

async function convert(job) {
  const input = await bytesFor(job)
  const output = await sharp(input)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()
  return { buffer: output, bytes: output.length }
}

function renumberTourJobs(jobs) {
  const groups = new Map()
  for (const job of jobs) {
    if (job.kind !== "tour") continue
    const group = groups.get(job.group) ?? []
    group.push(job)
    groups.set(job.group, group)
  }
  for (const images of groups.values()) {
    images.sort((left, right) => left.sort - right.sort)
    images.forEach((image, index) => {
      image.sort = index
      image.isCover = index === 0
      image.target = `tours/${image.slug}/${index === 0 ? "cover" : String(index).padStart(2, "0")}.webp`
    })
  }
  return jobs
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const imageMap = JSON.parse(await readFile(MAP_PATH, "utf8"))
  let jobs = await buildJobs(imageMap, options.includeClient)
  await warnUnmappedSources(jobs, options.includeClient)
  if (options.only) jobs = jobs.filter((job) => job.slug === options.only)
  if (jobs.length === 0) throw new Error("No images matched the requested mapping/options")
  jobs = await dedupeJobs(jobs)
  jobs = renumberTourJobs(jobs)

  if (options.dryRun) {
    await printDryRun(jobs)
    return
  }

  const localEnv = parseEnvFile(await readFile(ENV_PATH, "utf8"))
  const supabaseUrl = localEnv.SUPABASE_URL
  const serviceRoleKey = localEnv.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(`Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in ${ENV_PATH}`)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const uploadedTours = new Map()

  for (const job of jobs) {
    const { buffer, bytes } = await convert(job)
    const { error } = await supabase.storage.from(BUCKET).upload(job.target, buffer, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: true,
    })
    if (error) throw new Error(`Upload failed for ${job.target}: ${error.message}`)
    console.log(`Uploaded ${job.target} (${bytes} bytes)`)
    if (job.kind === "tour") {
      const images = uploadedTours.get(job.slug) ?? []
      images.push(job)
      uploadedTours.set(job.slug, images)
    }
  }

  for (const [slug, images] of uploadedTours) {
    const { data: tour, error: lookupError } = await supabase
      .from("tours")
      .select("id")
      .eq("slug", slug)
      .maybeSingle()
    if (lookupError) throw new Error(`Could not find tour ${slug}: ${lookupError.message}`)
    if (!tour) {
      console.warn(`Images uploaded for ${slug}; no matching tour row, so DB links were skipped.`)
      continue
    }

    const orderedImages = images.sort((left, right) => left.sort - right.sort)
    const cover = orderedImages.find((image) => image.isCover)
    const rows = orderedImages.map((image) => ({
      tour_id: tour.id,
      path: image.target,
      sort: image.sort,
      alt: image.alt,
      is_cover: image.isCover,
    }))
    const { error: clearCoverError } = await supabase
      .from("tour_images")
      .update({ is_cover: false })
      .eq("tour_id", tour.id)
      .eq("is_cover", true)
    if (clearCoverError) {
      throw new Error(`Could not clear the previous cover for ${slug}: ${clearCoverError.message}`)
    }
    const { error: imageError } = await supabase
      .from("tour_images")
      .upsert(rows, { onConflict: "tour_id,path" })
    if (imageError) throw new Error(`Could not save images for ${slug}: ${imageError.message}`)

    if (cover) {
      const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(cover.target).data.publicUrl
      const { error: coverError } = await supabase
        .from("tours")
        .update({ image_url: publicUrl })
        .eq("id", tour.id)
      if (coverError && /image_url/.test(coverError.message)) continue
      if (coverError) throw new Error(`Could not update cover for ${slug}: ${coverError.message}`)
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
