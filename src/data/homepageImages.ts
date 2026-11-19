import bienHoFallback from "@/imports/homepage/bien-ho.jpeg"
import k50WaterfallFallback from "@/imports/homepage/k50-waterfall.png"
import konPringVillageFallback from "@/imports/homepage/kon-pring-village.jpg"
import { supabase } from "@/lib/supabase"

export type HomepageImageCredit = {
  label: string
  href: string
}

function publicHomepageImage(fileName: string, localFallback: string): string {
  if (!supabase) return localFallback

  return supabase.storage
    .from("public-media")
    .getPublicUrl(`homepage/${fileName}`).data.publicUrl
}

export const homepageImageByKey = {
  bienHo: publicHomepageImage("bien-ho.jpeg", bienHoFallback),
  k50Waterfall: publicHomepageImage("k50-waterfall.png", k50WaterfallFallback),
  konPringVillage: publicHomepageImage(
    "kon-pring-village.jpg",
    konPringVillageFallback,
  ),
}

export const homepageImageCreditByKey = {
  k50Waterfall: {
    label: "VinhNguyen.1257 · Wikimedia Commons · CC0 1.0",
    href: "https://commons.wikimedia.org/wiki/File:K50_Waterfall_Kon_Chu_Rang_Nature_Reserve_Gia_Lai_Vietnam.png",
  },
  konPringVillage: {
    label: "Đào Phúc Quang Vũ · Wikimedia Commons · CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Cuoc-song-nguoi-dong-bao-tai-lang-kon-pring-thi-tran-mang-den-kon-tum-28.jpg",
  },
} satisfies Record<string, HomepageImageCredit>
