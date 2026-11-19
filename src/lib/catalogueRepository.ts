import type { Tour } from "@/data/tours"
import type { Vehicle } from "@/data/carRental"
import { supabase } from "./supabase"

type TourRow = Omit<Tour, "id" | "regionSlug" | "priceVnd" | "departureMonths" | "groupMax" | "tourGroup" | "durationDays" | "durationLabel" | "image"> & {
  id: string
  duration_days: number
  duration_label: string
  price_vnd: string | number
  group_max: number
  departure_months: number[]
  image_url: string | null
  tour_group: Tour["tourGroup"]
  regions: { slug: Tour["regionSlug"] } | null
}

type VehicleRow = Omit<Vehicle, "id" | "pricePerDayVnd" | "luggageCapacity" | "driverOption" | "regionSlugs" | "b2bCapable" | "image"> & {
  id: string
  price_per_day_vnd: string | number
  luggage_capacity: number
  driver_option: Vehicle["driverOption"]
  region_slugs: Vehicle["regionSlugs"]
  image_url: string | null
  b2b_capable: boolean
}

function stableId(value: string): number {
  let hash = 0
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) | 0
  return Math.abs(hash)
}

export async function getPublishedTours(): Promise<Tour[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from("tours")
    .select("*, regions!inner(slug)")
    .eq("status", "published")
    .order("slug")
  if (error) throw error
  if (!data?.length) return null
  return (data as TourRow[]).map((row) => ({
    id: stableId(row.id), slug: row.slug, title: row.title, regionSlug: row.regions!.slug,
    theme: row.theme as Tour["theme"], durationDays: row.duration_days, durationLabel: row.duration_label,
    priceVnd: Number(row.price_vnd), difficulty: row.difficulty, groupMax: row.group_max,
    departureMonths: row.departure_months, image: row.image_url ?? "", blurb: row.blurb,
    highlights: row.highlights, impact: row.impact, tourGroup: row.tour_group, category: row.category,
  }))
}

export async function getPublishedVehicles(): Promise<Vehicle[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from("vehicles").select("*").eq("status", "published").order("slug")
  if (error) throw error
  if (!data?.length) return null
  return (data as VehicleRow[]).map((row) => ({
    id: stableId(row.id), slug: row.slug, name: row.name, brand: row.brand, category: row.category,
    seats: row.seats, luggageCapacity: row.luggage_capacity, transmission: row.transmission,
    fuel: row.fuel, pricePerDayVnd: Number(row.price_per_day_vnd), driverOption: row.driver_option,
    regionSlugs: row.region_slugs, image: row.image_url ?? "", blurb: row.blurb,
    features: row.features, b2bCapable: row.b2b_capable,
  }))
}
