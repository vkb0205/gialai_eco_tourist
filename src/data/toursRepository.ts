import fallbackForest from "@/imports/image-1.png"
import fallbackLake from "@/imports/image.png"
import fallbackPeople from "@/imports/image-2.png"
import { regionName } from "@/data/regions"
import type { RegionSlug } from "@/data/regions"
import type { Difficulty, Theme, Tour } from "@/data/tours"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"

type JsonObject = Record<string, unknown>

type PublicTourCardRow = {
  id: string
  slug: string
  title: string
  summary: string
  category_code: "domestic" | "international"
  region_slug: string
  theme: string | null
  duration_days: number
  duration_nights: number
  departure_text: string | null
  difficulty: string | null
  group_max: number | null
  group_label: string | null
  impact: string | null
  featured: boolean
  sort_order: number
  route: unknown
  departure_months: unknown
  highlights: unknown
  price_mode: "amount" | "contact"
  card_price_vnd: number | null
}

type PublicTourDetailRow = PublicTourCardRow & {
  accommodation_notes: string | null
  transport_notes: string | null
  surcharge_policy: string | null
  cancellation_policy: string | null
  itinerary: unknown
  included_services: unknown
  excluded_services: unknown
  child_price_rules: unknown
  child_pricing_note: string | null
  prices: unknown
}

export type TourItineraryDay = {
  dayNumber: number
  title: string
  body: string
  meals: string[]
  overnightLocation: string | null
  accommodationNotes: string | null
  items: TourItineraryItem[]
}

export type TourItineraryItem = {
  order: number
  startTime: string | null
  endTime: string | null
  timeLabel: string | null
  title: string
  description: string
  destination: string | null
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

function asObject(value: unknown): JsonObject | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as JsonObject)
    : null
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : []
}

function numberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
    : []
}

function routeNames(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => asObject(item)?.name)
    .filter((item): item is string => typeof item === "string")
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
  return value === "de" || value === "vua" || value === "kho" ? value : null
}

function durationLabel(days: number, nights: number): string {
  return nights === 0 ? `${days} ngày` : `${days} ngày · ${nights} đêm`
}

function mapTour(row: PublicTourCardRow): Tour {
  const regionSlug = toRegionSlug(row.region_slug)
  const category =
    row.category_code === "international" ? "Khác" : regionName(regionSlug)

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    regionSlug,
    tourGroup: row.category_code === "international" ? "international" : "domestic",
    category,
    theme: toTheme(row.theme),
    durationDays: row.duration_days,
    durationLabel: durationLabel(row.duration_days, row.duration_nights),
    priceVnd: row.price_mode === "amount" ? row.card_price_vnd : null,
    difficulty: toDifficulty(row.difficulty),
    groupMax: row.group_max,
    departureMonths: numberArray(row.departure_months),
    image: fallbackImages[regionSlug],
    blurb: row.summary,
    highlights: stringArray(row.highlights),
    impact: row.impact,
    sortOrder: row.sort_order,
  }
}

function timeLabel(item: JsonObject): string | null {
  const label = typeof item.time_label === "string" ? item.time_label.trim() : ""
  if (label) return label

  const start = typeof item.start_time === "string" ? item.start_time.slice(0, 5) : ""
  const end = typeof item.end_time === "string" ? item.end_time.slice(0, 5) : ""
  if (start && end) return `${start}–${end}`
  if (start) return start
  if (end) return end
  return null
}

function itineraryBody(dayTitle: string, value: unknown): string {
  if (!Array.isArray(value)) return ""

  return value
    .map((rawItem) => {
      const item = asObject(rawItem)
      if (!item) return ""

      const time = timeLabel(item)
      const title = typeof item.title === "string" ? item.title.trim() : ""
      const description =
        typeof item.description === "string" ? item.description.trim() : ""
      const heading =
        !time && title === dayTitle
          ? ""
          : [time, title].filter(Boolean).join(" · ")
      return [heading, description].filter(Boolean).join("\n")
    })
    .filter(Boolean)
    .join("\n\n")
}

function mapItinerary(value: unknown): TourItineraryDay[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((rawDay) => {
    const day = asObject(rawDay)
    if (!day || typeof day.day_number !== "number") return []

    const title = typeof day.title === "string" ? day.title : ""
    const items = Array.isArray(day.items)
      ? day.items.flatMap((rawItem) => {
          const item = asObject(rawItem)
          if (!item) return []

          return [
            {
              order: typeof item.order === "number" ? item.order : 0,
              startTime:
                typeof item.start_time === "string"
                  ? item.start_time.slice(0, 5)
                  : null,
              endTime:
                typeof item.end_time === "string"
                  ? item.end_time.slice(0, 5)
                  : null,
              timeLabel: timeLabel(item),
              title: typeof item.title === "string" ? item.title : "",
              description:
                typeof item.description === "string" ? item.description : "",
              destination:
                typeof item.destination === "string" ? item.destination : null,
            },
          ]
        })
      : []

    return [
      {
        dayNumber: day.day_number,
        title,
        body: itineraryBody(title, day.items),
        items,
        meals: stringArray(day.meals),
        overnightLocation:
          typeof day.overnight_destination === "string"
            ? day.overnight_destination
            : null,
        accommodationNotes:
          typeof day.accommodation_notes === "string"
            ? day.accommodation_notes
            : null,
      },
    ]
  })
}

function childPolicyText(row: PublicTourDetailRow): string | null {
  if (row.child_pricing_note) return row.child_pricing_note

  if (!Array.isArray(row.child_price_rules) || row.child_price_rules.length === 0) {
    return null
  }

  return (
    row.child_price_rules
      .map((rawRule) => {
        const rule = asObject(rawRule)
        if (!rule) return ""
        return typeof rule.description === "string" ? rule.description : ""
      })
      .filter(Boolean)
      .join("\n") || null
  )
}

function mapPriceOptions(value: unknown): TourPriceOption[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((rawPrice) => {
    const price = asObject(rawPrice)
    if (!price) return []

    return [
      {
        amountVnd: typeof price.amount_vnd === "number" ? price.amount_vnd : null,
        priceBasis:
          price.price_basis === "per_group" ? "per_group" : "per_person",
        minGuests: typeof price.min_guests === "number" ? price.min_guests : null,
        maxGuests: typeof price.max_guests === "number" ? price.max_guests : null,
        validFrom:
          typeof price.valid_from === "string" ? price.valid_from : null,
        validUntil:
          typeof price.valid_until === "string" ? price.valid_until : null,
        conditionText:
          typeof price.condition_text === "string" ? price.condition_text : "",
        isCardPrice: price.is_card_price === true,
      },
    ]
  })
}

function mapTourDetails(row: PublicTourDetailRow): TourDetails {
  return {
    ...mapTour(row),
    destinations: routeNames(row.route),
    departureText: row.departure_text,
    groupLabel: row.group_label,
    inclusions: stringArray(row.included_services),
    exclusions: stringArray(row.excluded_services),
    accommodationNotes: row.accommodation_notes,
    transportNotes: row.transport_notes,
    childPolicy: childPolicyText(row),
    surchargePolicy: row.surcharge_policy,
    cancellationPolicy: row.cancellation_policy,
    itinerary: mapItinerary(row.itinerary),
    priceOptions: mapPriceOptions(row.prices),
  }
}

/** Load only records allowed by the normalized public card view. */
export async function loadPublishedTours(): Promise<Tour[]> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
    )
  }

  const { data, error } = await supabase
    .from("tour_public_cards")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) throw error
  return ((data ?? []) as unknown as PublicTourCardRow[]).map(mapTour)
}

/** Load one public tour from the normalized detail projection. */
export async function loadPublishedTourDetails(
  slug: string,
): Promise<TourDetails | null> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
    )
  }

  const { data, error } = await supabase
    .from("tour_public_details")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return mapTourDetails(data as unknown as PublicTourDetailRow)
}
