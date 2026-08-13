import img0 from "@/imports/image.png"
import img1 from "@/imports/image-1.png"
import img2 from "@/imports/image-2.png"
import type { RegionSlug } from "./regions"

/**
 * ============================================================================
 * REPRESENTATIVE SAMPLE DATA — NOT VERIFIED INVENTORY (FR-015)
 * ============================================================================
 *
 * Every record below is illustrative. Titles reference real Vietnamese places,
 * but itineraries, prices, group ceilings, and departure windows are drafted
 * for layout and filtering purposes only. Nothing here has been confirmed by
 * the agency.
 *
 * Before this catalogue is presented as bookable inventory:
 *   1. Replace every record with agency-supplied, verified content.
 *   2. Replace the placeholder photography with licensed images of the actual
 *      destinations. The pool below intentionally repeats a small set of
 *      images rather than guessing at stock URLs that may not resolve.
 *   3. Delete this banner.
 *
 * Deliberately absent, per Constitution principle II: review scores, star
 * ratings, seat counters, countdowns, and "only N left" style scarcity claims.
 * Prices are starting prices per traveller (FR-014), never booking totals.
 */

/** Trip themes. Keys are stable and appear in the URL. */
export type Theme = "trekking" | "van-hoa" | "thien-nhien" | "phieu-luu" | "am-thuc" | "bien-dao"

/** Physical demand. Keys are stable and appear in the URL. */
export type Difficulty = "de" | "vua" | "kho"



export type TourGroup = "domestic" | "international" | "special"

export const tourGroups: Record<TourGroup, { label: string; values: string[] }> = {
  domestic: {
    label: "Tour trong nước",
    values: ["Tây Nguyên", "Miền Bắc", "Miền Nam", "Miền Trung"],
  },
  international: {
    label: "Tour nước ngoài",
    values: [
      "Thái Lan",
      "Campuchia",
      "Singapore",
      "Hàn Quốc",
      "Nhật Bản",
      "Trung Quốc",
      "Mỹ",
      "Khác",
    ],
  },
  special: {
    label: "Tour đặc biệt",
    values: [
      "Tour du thuyền",
      "Tour trải nghiệm học sinh-sinh viên",
      "Tour Cựu Chiến Binh",
    ],
  },
}

export type Tour = {
  /** Stable numeric identifier. */
  id: number
  /** URL-safe identifier, reserved for future detail routes. */
  slug: string
  title: string
  regionSlug: RegionSlug
  theme: Theme
  /** Whole days, used for duration banding and sorting. */
  durationDays: number
  /** Display form, e.g. `3 ngày · 2 đêm`. */
  durationLabel: string
  /** Starting price per traveller in đồng, as a sortable number. */
  priceVnd: number
  difficulty: Difficulty
  /** Maximum travellers per departure. */
  groupMax: number
  /** Months (1-12) the journey runs in. */
  departureMonths: number[]
  image: string
  /** Two-line description shown on the card. */
  blurb: string
  /** Short phrases, also searched by the keyword filter. */
  highlights: string[]
  /** How the journey returns value to the host community. */
  impact: string
  tourGroup: TourGroup
  category: string
}

const IMG_LAKE = img0
const IMG_TRAIL = img1
const IMG_PEOPLE = img2
const IMG_VILLAGE =
  "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=80"
const IMG_RIVER =
  "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=900&q=80"
const IMG_FOREST =
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80"
const IMG_FALLS =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80"
const IMG_TABLE =
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80"

export const tours: Tour[] = [
  // ---------------------------------------------------------------- Tây Bắc
  {
    id: 1,
    slug: "mu-cang-chai-mua-lua-chin",
    title: "Mù Cang Chải mùa lúa chín",
    regionSlug: "mien-bac",
    tourGroup: "domestic",
    category: "Miền Bắc",
    theme: "trekking",
    durationDays: 3,
    durationLabel: "3 ngày · 2 đêm",
    priceVnd: 3_180_000,
    difficulty: "kho",
    groupMax: 10,
    departureMonths: [9, 10],
    image: IMG_TRAIL,
    blurb:
      "Đi bộ giữa ruộng bậc thang La Pán Tẩn khi lúa vào độ chín, ngủ tại nhà người H'Mông và dậy sớm đón sương trên đèo Khau Phạ.",
    highlights: [
      "Ruộng bậc thang La Pán Tẩn",
      "Đèo Khau Phạ",
      "Homestay người H'Mông",
    ],
    impact:
      "Lưu trú và bữa ăn do các hộ gia đình trong bản trực tiếp cung cấp.",
  },
  {
    id: 2,
    slug: "cho-phien-bac-ha-va-ban-ta-van",
    title: "Chợ phiên Bắc Hà và bản Tả Van",
    regionSlug: "mien-bac",
    tourGroup: "international",
    category: "Campuchia",
    theme: "van-hoa",
    durationDays: 2,
    durationLabel: "2 ngày · 1 đêm",
    priceVnd: 1_930_000,
    difficulty: "vua",
    groupMax: 12,
    departureMonths: [1, 2, 3, 4, 9, 10, 11, 12],
    image: IMG_VILLAGE,
    blurb:
      "Sáng chủ nhật ở chợ phiên Bắc Hà, chiều xuống thung lũng Mường Hoa và dừng lại trong một nếp nhà gỗ ở Tả Van.",
    highlights: [
      "Chợ phiên Bắc Hà",
      "Thung lũng Mường Hoa",
      "Dệt thổ cẩm người Dao đỏ",
    ],
    impact:
      "Mua vải và nông sản trực tiếp từ người bán tại chợ, không qua trung gian.",
  },
  {
    id: 3,
    slug: "fansipan-duong-tram-ton",
    title: "Fansipan theo đường Trạm Tôn",
    regionSlug: "mien-bac",
    tourGroup: "domestic",
    category: "Miền Bắc",
    theme: "phieu-luu",
    durationDays: 4,
    durationLabel: "4 ngày · 3 đêm",
    priceVnd: 4_750_000,
    difficulty: "kho",
    groupMax: 8,
    departureMonths: [3, 4, 5, 9, 10, 11],
    image: IMG_FOREST,
    blurb:
      "Bốn ngày leo đỉnh cao nhất Đông Dương từ cửa rừng Trạm Tôn, qua rừng đỗ quyên và hai đêm dựng lều giữa độ cao 2.800 mét.",
    highlights: [
      "Đỉnh Fansipan 3.143m",
      "Rừng đỗ quyên cổ",
      "Cắm trại độ cao 2.800m",
    ],
    impact:
      "Toàn bộ porter là người Giáy và người Dao sống quanh vườn quốc gia Hoàng Liên.",
  },

  // --------------------------------------------------------------- Đông Bắc
  {
    id: 4,
    slug: "cao-nguyen-da-dong-van",
    title: "Cao nguyên đá Đồng Văn và Mã Pí Lèng",
    regionSlug: "mien-bac",
    tourGroup: "domestic",
    category: "Miền Bắc",
    theme: "phieu-luu",
    durationDays: 4,
    durationLabel: "4 ngày · 3 đêm",
    priceVnd: 4_280_000,
    difficulty: "vua",
    groupMax: 10,
    departureMonths: [3, 4, 9, 10, 11, 12],
    image: IMG_FOREST,
    blurb:
      "Vòng cung cao nguyên đá qua Yên Minh, Lũng Cú và đèo Mã Pí Lèng, dừng lại đủ lâu ở mỗi bản để không chỉ đi lướt qua.",
    highlights: [
      "Đèo Mã Pí Lèng",
      "Cột cờ Lũng Cú",
      "Dinh thự họ Vương",
      "Sông Nho Quế",
    ],
    impact:
      "Ngủ tại homestay người Mông ở Lũng Cẩm thay vì khách sạn trung tâm thị trấn.",
  },
  {
    id: 5,
    slug: "ho-ba-be-thuyen-doc-moc",
    title: "Hồ Ba Bể trên thuyền độc mộc",
    regionSlug: "mien-bac",
    tourGroup: "domestic",
    category: "Miền Bắc",
    theme: "thien-nhien",
    durationDays: 2,
    durationLabel: "2 ngày · 1 đêm",
    priceVnd: 1_680_000,
    difficulty: "de",
    groupMax: 12,
    departureMonths: [2, 3, 4, 5, 6, 9, 10, 11],
    image: IMG_LAKE,
    blurb:
      "Chèo thuyền độc mộc qua hồ nước ngọt tự nhiên lớn nhất Việt Nam, ghé ao Tiên và ngủ trong nhà sàn người Tày ở Pác Ngòi.",
    highlights: ["Hồ Ba Bể", "Động Puông", "Nhà sàn người Tày Pác Ngòi"],
    impact:
      "Thuyền và người lái đều thuộc hợp tác xã du lịch của thôn Pác Ngòi.",
  },
  {
    id: 6,
    slug: "thac-ban-gioc-va-nguom-ngao",
    title: "Thác Bản Giốc và động Ngườm Ngao",
    regionSlug: "mien-bac",
    tourGroup: "domestic",
    category: "Miền Bắc",
    theme: "thien-nhien",
    durationDays: 3,
    durationLabel: "3 ngày · 2 đêm",
    priceVnd: 2_740_000,
    difficulty: "vua",
    groupMax: 14,
    departureMonths: [6, 7, 8, 9, 10],
    image: IMG_FALLS,
    blurb:
      "Mùa nước đổ ở thác biên giới lớn nhất Đông Nam Á, kết hợp hang Ngườm Ngao và làng làm hương Phia Thắp.",
    highlights: [
      "Thác Bản Giốc mùa nước đổ",
      "Động Ngườm Ngao",
      "Làng hương Phia Thắp",
    ],
    impact:
      "Ghé xưởng hương và xưởng giấy bản Quốc Dân, mua trực tiếp tại nơi sản xuất.",
  },

  // ----------------------------------------------------------------- Bắc Bộ
  {
    id: 7,
    slug: "vinh-lan-ha-va-lang-chai-viet-hai",
    title: "Vịnh Lan Hạ và làng chài Việt Hải",
    regionSlug: "mien-bac",
    tourGroup: "special",
    category: "Tour du thuyền",
    theme: "bien-dao",
    durationDays: 2,
    durationLabel: "2 ngày · 1 đêm",
    priceVnd: 2_260_000,
    difficulty: "de",
    groupMax: 16,
    departureMonths: [3, 4, 5, 6, 7, 8, 9, 10],
    image: IMG_LAKE,
    blurb:
      "Chèo kayak giữa những khối đá vôi của Lan Hạ, rồi đạp xe vào Việt Hải, ngôi làng nằm lọt giữa vườn quốc gia Cát Bà.",
    highlights: ["Kayak vịnh Lan Hạ", "Làng Việt Hải", "Vườn quốc gia Cát Bà"],
    impact:
      "Bữa trưa nấu tại nhà dân Việt Hải bằng rau và cá đánh bắt trong ngày.",
  },
  {
    id: 8,
    slug: "trang-an-tam-coc-cuc-phuong",
    title: "Tràng An, Tam Cốc và rừng Cúc Phương",
    regionSlug: "mien-bac",
    tourGroup: "domestic",
    category: "Miền Bắc",
    theme: "thien-nhien",
    durationDays: 3,
    durationLabel: "3 ngày · 2 đêm",
    priceVnd: 2_580_000,
    difficulty: "vua",
    groupMax: 14,
    departureMonths: [1, 2, 3, 4, 5, 10, 11, 12],
    image: IMG_RIVER,
    blurb:
      "Thuyền nan xuyên hang nước ở Tràng An, đạp xe qua đồng lúa Tam Cốc và một đêm trong rừng nguyên sinh Cúc Phương.",
    highlights: [
      "Quần thể Tràng An",
      "Hang Múa",
      "Trung tâm cứu hộ linh trưởng Cúc Phương",
    ],
    impact:
      "Vé tham quan Cúc Phương đóng góp trực tiếp cho chương trình cứu hộ linh trưởng.",
  },
  {
    id: 9,
    slug: "bat-trang-va-van-phuc",
    title: "Gốm Bát Tràng và lụa Vạn Phúc",
    regionSlug: "mien-bac",
    tourGroup: "domestic",
    category: "Miền Bắc",
    theme: "van-hoa",
    durationDays: 1,
    durationLabel: "1 ngày",
    priceVnd: 690_000,
    difficulty: "de",
    groupMax: 16,
    departureMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    image: IMG_PEOPLE,
    blurb:
      "Một ngày ở hai làng nghề ven Hà Nội: tự tay chuốt một chiếc bát ở Bát Tràng, chiều xem khung cửi dệt lụa Vạn Phúc.",
    highlights: ["Lò gốm Bát Tràng", "Xưởng dệt lụa Vạn Phúc", "Chợ gốm cổ"],
    impact:
      "Học nghề trực tiếp với thợ trong xưởng gia đình, không qua trung tâm biểu diễn.",
  },

  // ----------------------------------------------------------- Bắc Trung Bộ
  {
    id: 10,
    slug: "hang-en-phong-nha",
    title: "Hang Én giữa Phong Nha Kẻ Bàng",
    regionSlug: "mien-trung",
    tourGroup: "domestic",
    category: "Miền Trung",
    theme: "phieu-luu",
    durationDays: 3,
    durationLabel: "3 ngày · 2 đêm",
    priceVnd: 6_150_000,
    difficulty: "kho",
    groupMax: 8,
    departureMonths: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12],
    image: IMG_FOREST,
    blurb:
      "Mười bảy cây số đường rừng và mười lần lội suối để đến hang lớn thứ ba thế giới, ngủ một đêm trên bãi cát trong lòng hang.",
    highlights: [
      "Hang Én",
      "Bản Đoòng người Bru Vân Kiều",
      "Cắm trại trong hang",
    ],
    impact:
      "Đội porter và đầu bếp là người Bru Vân Kiều ở bản Đoòng và xã Tân Trạch.",
  },
  {
    id: 11,
    slug: "hue-lang-tam-va-song-huong",
    title: "Huế: lăng tẩm và một buổi chiều sông Hương",
    regionSlug: "mien-trung",
    tourGroup: "international",
    category: "Thái Lan",
    theme: "van-hoa",
    durationDays: 2,
    durationLabel: "2 ngày · 1 đêm",
    priceVnd: 1_760_000,
    difficulty: "de",
    groupMax: 14,
    departureMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
    image: IMG_PEOPLE,
    blurb:
      "Đại Nội lúc sáng sớm, lăng Minh Mạng và lăng Khải Định giữa trưa, rồi thuyền rồng trên sông Hương khi trời tắt nắng.",
    highlights: [
      "Đại Nội Huế",
      "Lăng Minh Mạng",
      "Ca Huế trên sông Hương",
      "Chùa Thiên Mụ",
    ],
    impact:
      "Nghệ nhân ca Huế được trả công theo buổi diễn, không phụ thuộc tiền thưởng của khách.",
  },
  {
    id: 12,
    slug: "pu-luong-guong-nuoc",
    title: "Pù Luông và những guồng nước",
    regionSlug: "mien-trung",
    tourGroup: "international",
    category: "Singapore",
    theme: "trekking",
    durationDays: 3,
    durationLabel: "3 ngày · 2 đêm",
    priceVnd: 2_470_000,
    difficulty: "vua",
    groupMax: 12,
    departureMonths: [4, 5, 6, 9, 10, 11],
    image: IMG_TRAIL,
    blurb:
      "Đi bộ nối bản Đôn, bản Hiêu và bản Kho Mường qua rừng nhiệt đới, ngủ nhà sàn người Thái và tắm suối dưới guồng nước tre.",
    highlights: [
      "Bản Đôn",
      "Thác bản Hiêu",
      "Hang Kho Mường",
      "Guồng nước tre",
    ],
    impact:
      "Mỗi bản trên tuyến đón tối đa một nhóm mỗi đêm để giữ nhịp sinh hoạt của thôn.",
  },

  // ------------------------------------------------------------ Nam Trung Bộ
  {
    id: 13,
    slug: "hoi-an-va-lang-rau-tra-que",
    title: "Hội An và bếp làng rau Trà Quế",
    regionSlug: "mien-trung",
    tourGroup: "international",
    category: "Hàn Quốc",
    theme: "am-thuc",
    durationDays: 2,
    durationLabel: "2 ngày · 1 đêm",
    priceVnd: 1_540_000,
    difficulty: "de",
    groupMax: 12,
    departureMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
    image: IMG_TABLE,
    blurb:
      "Sáng ra vườn Trà Quế cuốc đất và hái rau, trưa học nấu ba món Quảng, tối đi bộ phố cổ khi đèn lồng vừa lên.",
    highlights: [
      "Làng rau Trà Quế",
      "Lớp nấu ăn tại nhà dân",
      "Phố cổ Hội An",
      "Chợ Hội An buổi sớm",
    ],
    impact:
      "Lớp nấu ăn diễn ra tại bếp của hộ trồng rau, tiền học trả thẳng cho gia đình.",
  },
  {
    id: 14,
    slug: "cu-lao-cham-san-ho",
    title: "Cù Lao Chàm và rạn san hô",
    regionSlug: "mien-trung",
    tourGroup: "special",
    category: "Tour du thuyền",
    theme: "bien-dao",
    durationDays: 1,
    durationLabel: "1 ngày",
    priceVnd: 940_000,
    difficulty: "de",
    groupMax: 16,
    departureMonths: [3, 4, 5, 6, 7, 8],
    image: IMG_LAKE,
    blurb:
      "Ca nô ra khu dự trữ sinh quyển Cù Lao Chàm, lặn ống thở xem rạn san hô và ăn trưa ở bãi Hương cùng nhà dân.",
    highlights: [
      "Lặn ống thở bãi Bắc",
      "Bãi Hương",
      "Khu dự trữ sinh quyển thế giới",
    ],
    impact:
      "Đảo cấm túi ni lông; nhóm mang theo bình nước dùng lại cho cả chuyến.",
  },
  {
    id: 15,
    slug: "bau-trang-va-doi-cat-mui-ne",
    title: "Bàu Trắng và đồi cát Mũi Né",
    regionSlug: "mien-trung",
    tourGroup: "international",
    category: "Nhật Bản",
    theme: "phieu-luu",
    durationDays: 2,
    durationLabel: "2 ngày · 1 đêm",
    priceVnd: 1_620_000,
    difficulty: "vua",
    groupMax: 12,
    departureMonths: [1, 2, 3, 4, 11, 12],
    image: IMG_FALLS,
    blurb:
      "Bình minh trên đồi cát bay, trưa nghỉ bên hồ sen Bàu Trắng, chiều lội suối Tiên và ăn tối ở làng chài Mũi Né.",
    highlights: [
      "Đồi cát bay Mũi Né",
      "Hồ Bàu Trắng",
      "Suối Tiên",
      "Làng chài Mũi Né",
    ],
    impact:
      "Hải sản mua tại bến cá buổi sáng, nấu ở quán do gia đình ngư dân điều hành.",
  },

  // ------------------------------------------------------------- Tây Nguyên
  {
    id: 16,
    slug: "qua-tang-rung-kon-ka-kinh",
    title: "Qua tầng rừng Kon Ka Kinh",
    regionSlug: "tay-nguyen",
    tourGroup: "domestic",
    category: "Tây Nguyên",
    theme: "trekking",
    durationDays: 3,
    durationLabel: "3 ngày · 2 đêm",
    priceVnd: 2_400_000,
    difficulty: "vua",
    groupMax: 12,
    departureMonths: [1, 2, 3, 11, 12],
    image: IMG_TRAIL,
    blurb:
      "Băng qua rừng nguyên sinh, nghe tiếng suối và ngủ giữa một trong những hệ sinh thái giàu nhất Tây Nguyên.",
    highlights: [
      "Vườn quốc gia Kon Ka Kinh",
      "Rừng hỗn giao lá rộng lá kim",
      "Voọc chà vá chân xám",
    ],
    impact:
      "Đi cùng kiểm lâm viên và người dẫn đường Bahnar sống ven vườn quốc gia.",
  },
  {
    id: 17,
    slug: "mot-dem-o-lang-bahnar",
    title: "Một đêm ở làng Bahnar",
    regionSlug: "tay-nguyen",
    tourGroup: "domestic",
    category: "Tây Nguyên",
    theme: "van-hoa",
    durationDays: 2,
    durationLabel: "2 ngày · 1 đêm",
    priceVnd: 1_850_000,
    difficulty: "de",
    groupMax: 12,
    departureMonths: [1, 2, 3, 4, 10, 11, 12],
    image: IMG_PEOPLE,
    blurb:
      "Bữa cơm bên bếp lửa, tiếng cồng chiêng và một nhịp sống không cần vội vàng.",
    highlights: [
      "Nhà rông làng Kon K'Tu",
      "Cồng chiêng Tây Nguyên",
      "Biển Hồ Pleiku",
      "Đồi chè Bàu Cạn",
    ],
    impact:
      "Đội cồng chiêng và nhà lưu trú do chính làng Kon K'Tu tổ chức và giữ nguồn thu.",
  },
  {
    id: 18,
    slug: "thac-k50-kon-chu-rang",
    title: "Thác K50 giữa Kon Chư Răng",
    regionSlug: "tay-nguyen",
    tourGroup: "domestic",
    category: "Tây Nguyên",
    theme: "phieu-luu",
    durationDays: 4,
    durationLabel: "4 ngày · 3 đêm",
    priceVnd: 3_600_000,
    difficulty: "kho",
    groupMax: 8,
    departureMonths: [11, 12, 1, 2, 3],
    image: IMG_RIVER,
    blurb:
      "Cung đường dành cho người thích thử thách: vượt suối, đi sâu vào rừng và chạm đến chân thác K50 cao hơn 50 mét.",
    highlights: [
      "Thác K50 Hang Én",
      "Khu bảo tồn Kon Chư Răng",
      "Cắm trại bên suối",
    ],
    impact:
      "Số nhóm mỗi tháng bị giới hạn theo thỏa thuận với ban quản lý khu bảo tồn.",
  },

  // ------------------------------------------------------------ Đông Nam Bộ
  {
    id: 19,
    slug: "rung-ngap-man-can-gio",
    title: "Rừng ngập mặn Cần Giờ",
    regionSlug: "mien-nam",
    tourGroup: "international",
    category: "Trung Quốc",
    theme: "thien-nhien",
    durationDays: 1,
    durationLabel: "1 ngày",
    priceVnd: 780_000,
    difficulty: "de",
    groupMax: 16,
    departureMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    image: IMG_RIVER,
    blurb:
      "Ca nô luồn kênh rạch trong khu dự trữ sinh quyển sát Sài Gòn, ghé đầm dơi và ăn trưa ở Thạnh An trước khi quay về.",
    highlights: ["Khu dự trữ sinh quyển Cần Giờ", "Đầm dơi", "Xã đảo Thạnh An"],
    impact:
      "Ghe và tài công thuê từ hộ dân Thạnh An, không qua công ty vận chuyển.",
  },
  {
    id: 20,
    slug: "con-dao-rua-va-di-tich",
    title: "Côn Đảo: mùa rùa lên bãi",
    regionSlug: "mien-nam",
    tourGroup: "international",
    category: "Mỹ",
    theme: "bien-dao",
    durationDays: 3,
    durationLabel: "3 ngày · 2 đêm",
    priceVnd: 5_420_000,
    difficulty: "vua",
    groupMax: 10,
    departureMonths: [6, 7, 8, 9],
    image: IMG_LAKE,
    blurb:
      "Một đêm thức cùng kiểm lâm ở hòn Bảy Cạnh xem rùa xanh lên đẻ trứng, ngày còn lại dành cho nhà tù Côn Đảo và nghĩa trang Hàng Dương.",
    highlights: [
      "Hòn Bảy Cạnh",
      "Thả rùa con về biển",
      "Nhà tù Côn Đảo",
      "Nghĩa trang Hàng Dương",
    ],
    impact:
      "Phí tham gia đóng trực tiếp cho chương trình bảo tồn rùa biển của vườn quốc gia.",
  },
  {
    id: 21,
    slug: "nui-ba-den-va-ho-dau-tieng",
    title: "Núi Bà Đen và hồ Dầu Tiếng",
    regionSlug: "mien-nam",
    tourGroup: "special",
    category: "Tour trải nghiệm học sinh-sinh viên",
    theme: "trekking",
    durationDays: 2,
    durationLabel: "2 ngày · 1 đêm",
    priceVnd: 1_390_000,
    difficulty: "vua",
    groupMax: 14,
    departureMonths: [10, 11, 12, 1, 2, 3, 4],
    image: IMG_TRAIL,
    blurb:
      "Leo đường cột điện lên nóc nhà Nam Bộ trước khi trời sáng, chiều hôm sau cắm trại bên hồ Dầu Tiếng đón hoàng hôn.",
    highlights: [
      "Đỉnh núi Bà Đen 986m",
      "Đường cột điện",
      "Cắm trại hồ Dầu Tiếng",
    ],
    impact:
      "Nhóm mang toàn bộ rác xuống núi và thu gom thêm rác dọc tuyến leo.",
  },

  // ------------------------------------------- Đồng bằng sông Cửu Long
  {
    id: 22,
    slug: "cho-noi-cai-rang-va-cu-lao-tan-loc",
    title: "Chợ nổi Cái Răng và cù lao Tân Lộc",
    regionSlug: "mien-nam",
    tourGroup: "special",
    category: "Tour Cựu Chiến Binh",
    theme: "am-thuc",
    durationDays: 2,
    durationLabel: "2 ngày · 1 đêm",
    priceVnd: 1_470_000,
    difficulty: "de",
    groupMax: 14,
    departureMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    image: IMG_TABLE,
    blurb:
      "Năm giờ sáng ăn hủ tiếu trên ghe giữa chợ nổi, sau đó về cù lao Tân Lộc hái trái cây và học làm bánh xèo miền Tây.",
    highlights: [
      "Chợ nổi Cái Răng",
      "Hủ tiếu trên ghe",
      "Cù lao Tân Lộc",
      "Lò hủ tiếu Sáu Hoài",
    ],
    impact: "Ngủ tại nhà vườn Tân Lộc; tiền phòng và bữa ăn thuộc về chủ vườn.",
  },
  {
    id: 23,
    slug: "rung-tram-tra-su-mua-nuoc-noi",
    title: "Rừng tràm Trà Sư mùa nước nổi",
    regionSlug: "mien-nam",
    tourGroup: "domestic",
    category: "Miền Nam",
    theme: "thien-nhien",
    durationDays: 1,
    durationLabel: "1 ngày",
    priceVnd: 850_000,
    difficulty: "de",
    groupMax: 16,
    departureMonths: [9, 10, 11],
    image: IMG_FOREST,
    blurb:
      "Xuồng ba lá rẽ qua thảm bèo xanh kín mặt nước, ngắm sân chim từ tháp quan sát rồi ăn trưa với món mùa nước nổi.",
    highlights: [
      "Rừng tràm Trà Sư",
      "Sân chim mùa nước nổi",
      "Cầu tre dài trong rừng tràm",
    ],
    impact:
      "Người chèo xuồng là phụ nữ trong ấp, được trả theo chuyến chứ không theo tiền khách thưởng.",
  },
  {
    id: 24,
    slug: "dat-mui-ca-mau-va-u-minh-ha",
    title: "Đất Mũi Cà Mau và rừng U Minh Hạ",
    regionSlug: "mien-nam",
    tourGroup: "international",
    category: "Khác",
    theme: "phieu-luu",
    durationDays: 3,
    durationLabel: "3 ngày · 2 đêm",
    priceVnd: 2_980_000,
    difficulty: "vua",
    groupMax: 12,
    departureMonths: [12, 1, 2, 3, 4, 5],
    image: IMG_VILLAGE,
    blurb:
      "Vỏ lãi chạy suốt buổi sáng ra mốc tọa độ quốc gia ở Đất Mũi, hôm sau vào U Minh Hạ ăn ong và giăng lưới bắt cá đồng.",
    highlights: [
      "Mốc tọa độ quốc gia GPS 0001",
      "Rừng đước Đất Mũi",
      "Vườn quốc gia U Minh Hạ",
      "Nghề gác kèo ong",
    ],
    impact:
      "Trải nghiệm gác kèo ong do thợ ăn ong trong ấp hướng dẫn và giữ toàn bộ mật thu được.",
  },
]

/** Total number of packages in the catalogue. */
export const tourCount = tours.length
