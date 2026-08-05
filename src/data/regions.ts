/**
 * The 8 Vietnamese travel regions the agency operates in.
 *
 * Order is fixed north to south and is the order the region strip renders in.
 * Do not sort this array at the call site: geography is the ordering, not
 * alphabet or package count.
 */

export type RegionSlug = "tay-bac" | "dong-bac" | "bac-bo" | "bac-trung-bo" | "nam-trung-bo" | "tay-nguyen" | "dong-nam-bo" | "dong-bang-song-cuu-long"

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
    slug: "tay-bac",
    name: "Tây Bắc",
    characterisation: "Ruộng bậc thang, đèo cao và những phiên chợ vùng cao.",
    image:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "dong-bac",
    name: "Đông Bắc",
    characterisation: "Núi đá vôi, hồ nước ngọt và biên giới phía bắc.",
    image:
      "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "bac-bo",
    name: "Bắc Bộ",
    characterisation: "Đồng bằng sông Hồng, làng nghề và vịnh đảo đá.",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "bac-trung-bo",
    name: "Bắc Trung Bộ",
    characterisation: "Hang động Phong Nha, cố đô Huế và dải cát trắng.",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "nam-trung-bo",
    name: "Nam Trung Bộ",
    characterisation: "Biển xanh, phố cổ Hội An và những cồn cát đỏ.",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "tay-nguyen",
    name: "Tây Nguyên",
    characterisation: "Rừng già, thác nước và nhịp cồng chiêng bản địa.",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "dong-nam-bo",
    name: "Đông Nam Bộ",
    characterisation: "Rừng ngập mặn, đảo Côn Đảo và di tích chiến tranh.",
    image:
      "https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "dong-bang-song-cuu-long",
    name: "Đồng bằng sông Cửu Long",
    characterisation: "Chợ nổi, vườn trái cây và mạng lưới kênh rạch.",
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
