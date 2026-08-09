import type { RegionSlug } from "./regions"

/**
 * ============================================================================
 * REPRESENTATIVE SAMPLE DATA — NOT VERIFIED INVENTORY
 * ============================================================================
 *
 * Vehicle records below are illustrative. Models, capacities, and prices are
 * drafted for layout and filtering purposes only.
 *
 * Before this catalogue is presented as bookable inventory:
 *   1. Replace every record with agency-supplied, verified content.
 *   2. Replace the placeholder photography with licensed images.
 *   3. Delete this banner.
 *
 * Prices are starting prices per day in đồng, never booking totals.
 */

/** Vehicle category. Keys are stable and appear in the URL. */
export type VehicleCategory = "sedan" | "suv" | "van" | "minibus" | "bus" | "pickup"

/** Transmission type. */
export type Transmission = "auto" | "manual"

/** Fuel type. */
export type FuelType = "xang" | "dau" | "dien" | "hybrid"

/** Driver option. */
export type DriverOption = "co-tai-xe" | "tu-lai"

export type Vehicle = {
  /** Stable numeric identifier. */
  id: number
  /** URL-safe identifier. */
  slug: string
  /** Display name, e.g. "Toyota Vios". */
  name: string
  /** Manufacturer brand. */
  brand: string
  category: VehicleCategory
  /** Seats including driver. */
  seats: number
  /** Luggage capacity in large bags. */
  luggageCapacity: number
  transmission: Transmission
  fuel: FuelType
  /** Starting price per day in đồng. */
  pricePerDayVnd: number
  /** Whether a driver is included or available. */
  driverOption: DriverOption
  /** Regions this vehicle is available in. */
  regionSlugs: RegionSlug[]
  /** Representative image URL. */
  image: string
  /** Short description. */
  blurb: string
  /** Key features shown as tags. */
  features: string[]
  /** Whether this vehicle is suited for B2B / large-group transit. */
  b2bCapable: boolean
}

const IMG_SEDAN =
  "https://images.unsplash.com/photo-1549317661-bd32c8d0db23?auto=format&fit=crop&w=900&q=80"
const IMG_SUV =
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80"
const IMG_VAN =
  "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80"
const IMG_MINIBUS =
  "https://images.unsplash.com/photo-1570125909232-21826df12fdd?auto=format&fit=crop&w=900&q=80"
const IMG_BUS =
  "https://images.unsplash.com/photo-1570125909517-53a21f8eae2e?auto=format&fit=crop&w=900&q=80"
const IMG_PICKUP =
  "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=900&q=80"

export const vehicles: Vehicle[] = [
  // ── Sedans ──
  {
    id: 1,
    slug: "toyota-vios",
    name: "Toyota Vios",
    brand: "Toyota",
    category: "sedan",
    seats: 4,
    luggageCapacity: 3,
    transmission: "auto",
    fuel: "xang",
    pricePerDayVnd: 800_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-nguyen", "nam-trung-bo", "dong-nam-bo"],
    image: IMG_SEDAN,
    blurb:
      "Sedan nhỏ gọn, tiết kiệm nhiên liệu — lý cho di chuyển 2–4 khách trong thành phố và cung đường ngắn.",
    features: ["Điều hòa", "Bluetooth", "Cản lăn"],
    b2bCapable: false,
  },
  {
    id: 2,
    slug: "hyundai-accent",
    name: "Hyundai Accent",
    brand: "Hyundai",
    category: "sedan",
    seats: 4,
    luggageCapacity: 3,
    transmission: "auto",
    fuel: "xang",
    pricePerDayVnd: 750_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-nguyen", "bac-trung-bo"],
    image: IMG_SEDAN,
    blurb:
      "Sedan hạng A giá mềm, rộng ghế sau — phù hợp đưa đón sân bay Pleiku và chuyến ngắn.",
    features: ["Điều hòa", "Camera lùi", "Bluetooth"],
    b2bCapable: false,
  },
  {
    id: 3,
    slug: "mazda-3",
    name: "Mazda 3",
    brand: "Mazda",
    category: "sedan",
    seats: 4,
    luggageCapacity: 3,
    transmission: "auto",
    fuel: "hybrid",
    pricePerDayVnd: 1_100_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-nguyen", "dong-nam-bo"],
    image: IMG_SEDAN,
    blurb:
      "Sedan hạng C cao cấp, chạy êm và tiết kiệm — cho khách cần sự thoải mái trên đường dài.",
    features: ["Điều hòa tự động", "Camera 360", "Cruise control"],
    b2bCapable: false,
  },

  // ── SUVs ──
  {
    id: 4,
    slug: "toyota-fortuner",
    name: "Toyota Fortuner",
    brand: "Toyota",
    category: "suv",
    seats: 7,
    luggageCapacity: 5,
    transmission: "auto",
    fuel: "dau",
    pricePerDayVnd: 1_800_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-bac", "dong-bac", "tay-nguyen"],
    image: IMG_SUV,
    blurb:
      "SUV 7 chỗ gầm cao, vượt đèo dốc Tây Bắc an toàn — tài xế địa phương am hiểu cung đường núi.",
    features: ["7 chỗ", "Gầm cao", "4WD", "Điều hòa 2 vùng"],
    b2bCapable: true,
  },
  {
    id: 5,
    slug: "hyundai-custin",
    name: "Hyundai Custin",
    brand: "Hyundai",
    category: "suv",
    seats: 7,
    luggageCapacity: 4,
    transmission: "auto",
    fuel: "xang",
    pricePerDayVnd: 1_600_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-nguyen", "nam-trung-bo", "bac-trung-bo"],
    image: IMG_SUV,
    blurb:
      "MPV 7 chỗ rộng rãi, ghế xếp gọn — linh hoạt cho gia đình hoặc nhóm nhỏ 5–7 người.",
    features: ["7 chỗ", "Ghế da", "Cửa lùa"],
    b2bCapable: true,
  },
  {
    id: 6,
    slug: "ford-everest",
    name: "Ford Everest",
    brand: "Ford",
    category: "suv",
    seats: 7,
    luggageCapacity: 5,
    transmission: "auto",
    fuel: "dau",
    pricePerDayVnd: 2_200_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-bac", "dong-bac", "tay-nguyen", "dong-nam-bo"],
    image: IMG_SUV,
    blurb:
      "SUV cao cấp 4WD, sức kéo mạnh và khung gầm vững — cho những chuyến phiêu lưu đường xa.",
    features: ["7 chỗ", "4WD", "Lane assist", "Điều hòa 3 vùng"],
    b2bCapable: true,
  },

  // ── Vans ──
  {
    id: 7,
    slug: "toyota-innova",
    name: "Toyota Innova Cross",
    brand: "Toyota",
    category: "van",
    seats: 8,
    luggageCapacity: 5,
    transmission: "auto",
    fuel: "hybrid",
    pricePerDayVnd: 1_500_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-nguyen", "nam-trung-bo", "dong-nam-bo", "bac-trung-bo"],
    image: IMG_VAN,
    blurb:
      "MPV 8 chỗ hybrid, rộng và tiết kiệm — xe phổ dụng nhất cho nhóm 6–8 khách thuê kèm tài xế.",
    features: ["8 chỗ", "Hybrid", "Điều hòa sau"],
    b2bCapable: true,
  },
  {
    id: 8,
    slug: "hyundai-solati",
    name: "Hyundai Solati",
    brand: "Hyundai",
    category: "van",
    seats: 12,
    luggageCapacity: 8,
    transmission: "manual",
    fuel: "dau",
    pricePerDayVnd: 2_000_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-nguyen", "dong-bac", "tay-bac", "nam-trung-bo", "dong-nam-bo"],
    image: IMG_VAN,
    blurb:
      "Van 12 chỗ chở — phổ biến cho đoàn 10–12 khách, có tài xế am hiểu tuyến đường.",
    features: ["12 chỗ", "Khoang hành lý riêng", "Điều hòa cả xe"],
    b2bCapable: true,
  },
  {
    id: 9,
    slug: "ford-transit",
    name: "Ford Transit",
    brand: "Ford",
    category: "van",
    seats: 16,
    luggageCapacity: 10,
    transmission: "manual",
    fuel: "dau",
    pricePerDayVnd: 2_400_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-nguyen", "dong-bac", "nam-trung-bo", "dong-nam-bo", "bac-bo"],
    image: IMG_VAN,
    blurb:
      "Van 16 chỗ cao cấp, ghế ngả và đọc đèn — cho đoàn công tác hoặc nhóm 14–16 người.",
    features: ["16 chỗ", "Ghế ngả", "Đọc đèn", "USB sạc"],
    b2bCapable: true,
  },

  // ── Minibuses ──
  {
    id: 10,
    slug: "mercedes-sprinter",
    name: "Mercedes-Benz Sprinter",
    brand: "Mercedes-Benz",
    category: "minibus",
    seats: 19,
    luggageCapacity: 12,
    transmission: "auto",
    fuel: "dau",
    pricePerDayVnd: 3_500_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-nguyen", "nam-trung-bo", "dong-nam-bo", "bac-bo"],
    image: IMG_MINIBUS,
    blurb:
      "Minibus 19 chỗ cao cấp — thường dùng cho đoàn công tác, team building, sự kiện B2B.",
    features: ["19 chỗ", "Ghế da ngả", "Màn hình DVD", "Tủ lạnh nhỏ"],
    b2bCapable: true,
  },
  {
    id: 11,
    slug: "samco-county",
    name: "Samco County",
    brand: "Samco",
    category: "minibus",
    seats: 24,
    luggageCapacity: 15,
    transmission: "manual",
    fuel: "dau",
    pricePerDayVnd: 3_000_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-nguyen", "dong-bac", "nam-trung-bo", "dong-nam-bo"],
    image: IMG_MINIBUS,
    blurb:
      "Minibus 24 chỗ — giải pháp trung chuyển cho đoàn 20–24 khách giữa các điểm tham quan.",
    features: ["24 chỗ", "Khoang hành lý lớn", "Điều hòa mạnh"],
    b2bCapable: true,
  },

  // ── Buses ──
  {
    id: 12,
    slug: "hyundai-county-29",
    name: "Hyundai County 29 chỗ",
    brand: "Hyundai",
    category: "bus",
    seats: 29,
    luggageCapacity: 20,
    transmission: "auto",
    fuel: "dau",
    pricePerDayVnd: 4_500_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-nguyen", "dong-bac", "nam-trung-bo", "dong-nam-bo", "bac-bo", "bac-trung-bo"],
    image: IMG_BUS,
    blurb:
      "Xe buýt 29 chỗ — standard cho đoàn lớn 25–29 khách, phù hợp charter tour và trung chuyển dài.",
    features: ["29 chỗ", "Khoang hành lý hầm", "Điều hòa cả xe", "Micro"],
    b2bCapable: true,
  },
  {
    id: 13,
    slug: "hyundai-universe-45",
    name: "Hyundai Universe 45 chỗ",
    brand: "Hyundai",
    category: "bus",
    seats: 45,
    luggageCapacity: 30,
    transmission: "manual",
    fuel: "dau",
    pricePerDayVnd: 6_500_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-nguyen", "dong-bac", "nam-trung-bo", "dong-nam-bo", "bac-bo", "bac-trung-bo"],
    image: IMG_BUS,
    blurb:
      "Xe giường nằm 45 chỗ — chuyên cung đường dài Bắc–Nam, charter đoàn 40+ khách, có phụ xe.",
    features: ["45 chỗ giường nằm", "Hầm hành lý lớn", "WC (tùy xe)", "Phụ xe"],
    b2bCapable: true,
  },
  {
    id: 14,
    slug: "thaco-kinglong-35",
    name: "Thaco Kinglong 35 chỗ",
    brand: "Thaco",
    category: "bus",
    seats: 35,
    luggageCapacity: 25,
    transmission: "manual",
    fuel: "dau",
    pricePerDayVnd: 5_200_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-nguyen", "dong-bac", "nam-trung-bo", "dong-nam-bo", "bac-trung-bo"],
    image: IMG_BUS,
    blurb:
      "Xe khách 35 chỗ ghế ngồi — cho đoàn tham quan 30–35 khách, thường đặt cho tour trọn gói.",
    features: ["35 chỗ ghế ngồi", "Điều hòa", "Màn hình LED", "Khoang hành lý hầm"],
    b2bCapable: true,
  },

  // ── Pickups ──
  {
    id: 15,
    slug: "ford-ranger",
    name: "Ford Ranger Wildtrak",
    brand: "Ford",
    category: "pickup",
    seats: 5,
    luggageCapacity: 8,
    transmission: "auto",
    fuel: "dau",
    pricePerDayVnd: 2_000_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-nguyen", "dong-bac", "tay-bac"],
    image: IMG_PICKUP,
    blurb:
      "Bán tải 5 chỗ 4WD — chở hành lý cồng kềnh, lội nước nhẹ, cho những chuyến off-road Tây Nguyên.",
    features: ["4WD", "Thùng chở đồ", "Off-road", "5 chỗ"],
    b2bCapable: true,
  },
  {
    id: 16,
    slug: "mitsubishi-triton",
    name: "Mitsubishi Triton",
    brand: "Mitsubishi",
    category: "pickup",
    seats: 5,
    luggageCapacity: 8,
    transmission: "manual",
    fuel: "dau",
    pricePerDayVnd: 1_800_000,
    driverOption: "co-tai-xe",
    regionSlugs: ["tay-nguyen", "tay-bac"],
    image: IMG_PICKUP,
    blurb:
      "Bán tải 5 chỗ giá tốt — cho nhóm nhỏ cần chở thiết bị cắm trại hoặc trekking.",
    features: ["4WD", "Thùng chở đồ", "5 chỗ"],
    b2bCapable: true,
  },
  {
    id: 17,
    slug: "kia-soluto",
    name: "Kia Soluto",
    brand: "Kia",
    category: "sedan",
    seats: 5,
    luggageCapacity: 3,
    transmission: "auto",
    fuel: "xang",
    pricePerDayVnd: 700_000,
    driverOption: "tu-lai",
    regionSlugs: ["tay-nguyen", "dong-nam-bo"],
    image: IMG_SEDAN,
    blurb:
      "Sedan hạng A giá rẻ, tự lái — cho khách có GPLX B2, muốn tự do khám phá Pleiku và xung quanh.",
    features: ["Tự lái", "GPS", "Camera lùi"],
    b2bCapable: false,
  },
  {
    id: 18,
    slug: "vinfast-fadil",
    name: "VinFast Fadil",
    brand: "VinFast",
    category: "suv",
    seats: 5,
    luggageCapacity: 4,
    transmission: "auto",
    fuel: "xang",
    pricePerDayVnd: 900_000,
    driverOption: "tu-lai",
    regionSlugs: ["tay-nguyen", "dong-nam-bo", "nam-trung-bo"],
    image: IMG_SUV,
    blurb:
      "Hatchback/SUV gầm cao hạng A, tự lái — tiết kiệm và dễ xử lý cho cung đường thành phố.",
    features: ["Tự lái", "GPS", "Camera 360", "Apple CarPlay"],
    b2bCapable: false,
  },
]
