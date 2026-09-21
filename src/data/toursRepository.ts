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
  destinations: string[]
  departure_text: string | null
  group_label: string | null
  inclusions: string[]
  exclusions: string[]
  accommodation_notes: string | null
  transport_notes: string | null
  child_policy: string | null
  surcharge_policy: string | null
  cancellation_policy: string | null
  featured: boolean
  sort_order: number
}

export type TourItineraryDay = {
  dayNumber: number
  title: string
  body: string
  meals: string[]
  overnightLocation: string | null
  accommodationNotes: string | null
}

export type TourPriceOption = {
  amountVnd: number | null
  priceBasis: "per_person" | "per_group"
  minGuests: number | null
  maxGuests: number | null
  validFrom: string | null
  validUntil: string | null
  conditionText: string
  isCardPrice: boolean
}

export type TourDetails = Tour & {
  destinations: string[]
  departureText: string | null
  groupLabel: string | null
  inclusions: string[]
  exclusions: string[]
  accommodationNotes: string | null
  transportNotes: string | null
  childPolicy: string | null
  surchargePolicy: string | null
  cancellationPolicy: string | null
  itinerary: TourItineraryDay[]
  priceOptions: TourPriceOption[]
}

const TOUR_SELECT =
  "id, slug, title, summary, category, region_slug, destinations, theme, duration_days, duration_nights, starting_price_vnd, departure_text, departure_months, difficulty, group_max, group_label, highlights, impact, inclusions, exclusions, accommodation_notes, transport_notes, child_policy, surcharge_policy, cancellation_policy, featured, sort_order"

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
  return value && themes.includes(value as Theme) ? value as Theme : null
}

function toDifficulty(value: string | null): Difficulty | null {
  return value === "de" || value === "vua" || value === "kho" ? value : null
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

function mapTourDetails(
  row: SupabaseTourRow,
  itineraryRows: Array<{
    day_number: number
    title: string
    body_md: string
    meals: string[] | null
    overnight_location: string | null
    accommodation_notes: string | null
  }>,
  priceRows: Array<{
    amount_vnd: number | null
    price_basis: "per_person" | "per_group"
    min_guests: number | null
    max_guests: number | null
    valid_from: string | null
    valid_until: string | null
    condition_text: string
    is_card_price: boolean
  }>,
): TourDetails {
  return {
    ...mapTour(row),
    destinations: row.destinations ?? [],
    departureText: row.departure_text,
    groupLabel: row.group_label,
    inclusions: row.inclusions ?? [],
    exclusions: row.exclusions ?? [],
    accommodationNotes: row.accommodation_notes,
    transportNotes: row.transport_notes,
    childPolicy: row.child_policy,
    surchargePolicy: row.surcharge_policy,
    cancellationPolicy: row.cancellation_policy,
    itinerary: itineraryRows.map((item) => ({
      dayNumber: item.day_number,
      title: item.title,
      body: item.body_md,
      meals: item.meals ?? [],
      overnightLocation: item.overnight_location,
      accommodationNotes: item.accommodation_notes,
    })),
    priceOptions: priceRows.map((item) => ({
      amountVnd: item.amount_vnd,
      priceBasis: item.price_basis,
      minGuests: item.min_guests,
      maxGuests: item.max_guests,
      validFrom: item.valid_from,
      validUntil: item.valid_until,
      conditionText: item.condition_text,
      isCardPrice: item.is_card_price,
    })),
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
    .select(TOUR_SELECT)
    .eq("status", "published")
    .order("sort_order", { ascending: true })

  if (error) throw error
  return ((data ?? []) as SupabaseTourRow[]).map(mapTour)
}

/** Load one public tour with its ordered itinerary and published price options. */
export async function loadPublishedTourDetails(
  slug: string,
): Promise<TourDetails | null> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
    )
  }

  const { data: row, error: tourError } = await supabase
    .from("tours")
    .select(TOUR_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (tourError) throw tourError
  if (!row) return null

  const [itineraryResult, priceResult] = await Promise.all([
    supabase
      .from("tour_itinerary_days")
      .select(
        "day_number, title, body_md, meals, overnight_location, accommodation_notes",
      )
      .eq("tour_id", row.id)
      .order("day_number", { ascending: true }),
    supabase
      .from("tour_price_options")
      .select(
        "amount_vnd, price_basis, min_guests, max_guests, valid_from, valid_until, condition_text, is_card_price",
      )
      .eq("tour_id", row.id)
      .eq("status", "published")
      .order("sort_order", { ascending: true }),
  ])

  if (itineraryResult.error) throw itineraryResult.error
  if (priceResult.error) throw priceResult.error

  return mapTourDetails(
    row as SupabaseTourRow,
    (itineraryResult.data ?? []) as Array<{
      day_number: number
      title: string
      body_md: string
      meals: string[] | null
      overnight_location: string | null
      accommodation_notes: string | null
    }>,
    (priceResult.data ?? []) as Array<{
      amount_vnd: number | null
      price_basis: "per_person" | "per_group"
      min_guests: number | null
      max_guests: number | null
      valid_from: string | null
      valid_until: string | null
      condition_text: string
      is_card_price: boolean
    }>,
  )
}
