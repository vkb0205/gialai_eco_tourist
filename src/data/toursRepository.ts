import fallbackForest from "@/imports/image-1.png"
import fallbackLake from "@/imports/image.png"
import fallbackPeople from "@/imports/image-2.png"
import { regionName } from "@/data/regions"
import type { RegionSlug } from "@/data/regions"
import type { Difficulty, Theme, Tour } from "@/data/tours"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"

type SupabaseTourRow = {
  id: string
  slug: string
  title: string
  summary: string
  category: "domestic" | "international"
  region_slug: string
  theme: string | null
  duration_days: number
  duration_nights: number
  starting_price_vnd: number | null
  departure_months: number[] | null
  difficulty: string | null
  group_max: number | null
  highlights: string[] | null
  impact: string | null
  sort_order: number
}

const regionSlugMap: Record<string, RegionSlug> = {
  "tay-nguyen": "tay-nguyen",
  "tay-bac": "mien-bac",
  "dong-bac": "mien-bac",
  "bac-bo": "mien-bac",
  "bac-trung-bo": "mien-trung",
  "nam-trung-bo": "mien-trung",
  "dong-nam-bo": "mien-nam",
  "dong-bang-song-cuu-long": "mien-nam",
}

const fallbackImages: Record<RegionSlug, string> = {
  "tay-nguyen": fallbackForest,
  "mien-bac": fallbackLake,
  "mien-trung": fallbackPeople,
  "mien-nam": fallbackLake,
}

function toRegionSlug(value: string): RegionSlug {
  return regionSlugMap[value] ?? "tay-nguyen"
}

function toTheme(value: string | null): Theme | null {
  const themes: Theme[] = [
    "trekking",
    "van-hoa",
    "thien-nhien",
    "phieu-luu",
    "am-thuc",
    "bien-dao",
  ]
  return value && themes.includes(value as Theme) ? (value as Theme) : null
}

function toDifficulty(value: string | null): Difficulty | null {
  return value === "de" || value === "vua" || value === "kho"
    ? value
    : null
}

function durationLabel(days: number, nights: number): string {
  return nights === 0 ? `${days} ngày` : `${days} ngày · ${nights} đêm`
}

function mapTour(row: SupabaseTourRow): Tour {
  const regionSlug = toRegionSlug(row.region_slug)
  const category =
    row.category === "international" ? "Khác" : regionName(regionSlug)

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    regionSlug,
    tourGroup: row.category === "international" ? "international" : "domestic",
    category,
    theme: toTheme(row.theme),
    durationDays: row.duration_days,
    durationLabel: durationLabel(row.duration_days, row.duration_nights),
    priceVnd: row.starting_price_vnd,
    difficulty: toDifficulty(row.difficulty),
    groupMax: row.group_max,
    departureMonths: row.departure_months ?? [],
    image: fallbackImages[regionSlug],
    blurb: row.summary,
    highlights: row.highlights ?? [],
    impact: row.impact,
    sortOrder: row.sort_order,
  }
}

/** Load only records allowed by the public RLS policy. */
export async function loadPublishedTours(): Promise<Tour[]> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
    )
  }

  const { data, error } = await supabase
    .from("tours")
    .select(
      "id, slug, title, summary, category, region_slug, theme, duration_days, duration_nights, starting_price_vnd, departure_months, difficulty, group_max, highlights, impact, sort_order",
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true })

  if (error) throw error
  return ((data ?? []) as SupabaseTourRow[]).map(mapTour)
}
