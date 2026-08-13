/**
 * The four Vietnamese travel regions the agency operates in.
 *
 * Order is fixed north to south and is the order the region strip renders in.
 * Do not sort this array at the call site: geography is the ordering, not
 * alphabet or package count.
 */

export type RegionSlug = "tay-nguyen" | "mien-bac" | "mien-trung" | "mien-nam"

export type Region = {
  slug: RegionSlug
  /** Vietnamese display name, used in pills, chips, and cards. */
  name: string
  /** One line characterising the region, shown as supporting text. */
  characterisation: string
  /** Representative image for the region. */
  image: string
}

export const regions: Region[] = [
  {
    slug: "tay-nguyen",
    name: "Tây Nguyên",
    characterisation: "Rừng già, thác nước và nhịp cồng chiêng bản địa.",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "mien-bac",
    name: "Miền Bắc",
    characterisation: "Núi cao, làng nghề, vịnh đảo và những phiên chợ vùng cao.",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "mien-trung",
    name: "Miền Trung",
    characterisation: "Di sản, hang động, phố cổ và dải biển nhiều nắng.",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "mien-nam",
    name: "Miền Nam",
    characterisation: "Rừng ngập mặn, đảo xa và miền sông nước trù phú.",
    image:
      "https://images.unsplash.com/photo-1509923936917-1e2b6b3e6a8a?auto=format&fit=crop&w=900&q=80",
  },
]

const regionBySlug = new Map<string, Region>(
  regions.map((region) => [region.slug, region]),
)

/** Look up a region by slug. Returns undefined for unknown slugs from the URL. */
export function findRegion(slug: string): Region | undefined {
  return regionBySlug.get(slug)
}

/** Display name for a slug, falling back to the slug itself when unknown. */
export function regionName(slug: string): string {
  return regionBySlug.get(slug)?.name ?? slug
}
