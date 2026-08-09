import type {
  DriverOption,
  FuelType,
  Transmission,
  Vehicle,
  VehicleCategory,
} from "./carRental"

/**
 * Facet group configuration for the car rental catalogue.
 *
 * Mirrors the pattern in `filters.ts`: each group declares how its options
 * test a vehicle, so the filter engine stays generic.
 */

/** Keys used in the URL. Region lives outside this list, in its own strip. */
export type CarFacetKey =
  | "category"
  | "seats"
  | "transmission"
  | "fuel"
  | "driver"
  | "price"
  | "b2b"

export type CarFacetOption = {
  /** Stable value written to the URL. */
  value: string
  /** Vietnamese label. */
  label: string
  /** Whether a given vehicle satisfies this option. */
  matches: (vehicle: Vehicle) => boolean
}

export type CarFacetGroup = {
  key: CarFacetKey
  label: string
  mode: "single" | "multiple"
  options: CarFacetOption[]
}

const categoryLabels: Record<VehicleCategory, string> = {
  sedan: "Sedan",
  suv: "SUV / MPV",
  van: "Van",
  minibus: "Minibus",
  bus: "Xe khách",
  pickup: "Bán tải",
}

const transmissionLabels: Record<Transmission, string> = {
  auto: "Tự động",
  manual: "Số sàn",
}

const fuelLabels: Record<FuelType, string> = {
  xang: "Xăng",
  dau: "Dầu Diesel",
  dien: "Điện",
  hybrid: "Hybrid",
}

const driverLabels: Record<DriverOption, string> = {
  "co-tai-xe": "Có tài xế",
  "tu-lai": "Tự lái",
}

/** Public label lookups, reused by cards and chips. */
export function categoryLabel(category: string): string {
  return categoryLabels[category as VehicleCategory] ?? category
}

export function transmissionLabel(transmission: string): string {
  return transmissionLabels[transmission as Transmission] ?? transmission
}

export function fuelLabel(fuel: string): string {
  return fuelLabels[fuel as FuelType] ?? fuel
}

export function driverLabel(driver: string): string {
  return driverLabels[driver as DriverOption] ?? driver
}

export const carFacetGroups: CarFacetGroup[] = [
  {
    key: "category",
    label: "Loại xe",
    mode: "multiple",
    options: (Object.keys(categoryLabels) as VehicleCategory[]).map(
      (category) => ({
        value: category,
        label: categoryLabels[category],
        matches: (v) => v.category === category,
      }),
    ),
  },
  {
    key: "seats",
    label: "Số chỗ ngồi",
    mode: "multiple",
    options: [
      {
        value: "4-5",
        label: "4 – 5 chỗ",
        matches: (v) => v.seats <= 5,
      },
      {
        value: "7-8",
        label: "7 – 8 chỗ",
        matches: (v) => v.seats >= 6 && v.seats <= 8,
      },
      {
        value: "12-16",
        label: "12 – 16 chỗ",
        matches: (v) => v.seats >= 9 && v.seats <= 16,
      },
      {
        value: "19+",
        label: "19 chỗ trở lên",
        matches: (v) => v.seats >= 19,
      },
    ],
  },
  {
    key: "transmission",
    label: "Hộp số",
    mode: "single",
    options: (Object.keys(transmissionLabels) as Transmission[]).map(
      (transmission) => ({
        value: transmission,
        label: transmissionLabels[transmission],
        matches: (v) => v.transmission === transmission,
      }),
    ),
  },
  {
    key: "fuel",
    label: "Nhiên liệu",
    mode: "multiple",
    options: (Object.keys(fuelLabels) as FuelType[]).map((fuel) => ({
      value: fuel,
      label: fuelLabels[fuel],
      matches: (v) => v.fuel === fuel,
    })),
  },
  {
    key: "driver",
    label: "Tài xế",
    mode: "single",
    options: (Object.keys(driverLabels) as DriverOption[]).map((driver) => ({
      value: driver,
      label: driverLabels[driver],
      matches: (v) => v.driverOption === driver,
    })),
  },
  {
    key: "price",
    label: "Giá thuê / ngày",
    mode: "multiple",
    options: [
      {
        value: "duoi-1",
        label: "Dưới 1 triệu",
        matches: (v) => v.pricePerDayVnd < 1_000_000,
      },
      {
        value: "1-2",
        label: "1 – 2 triệu",
        matches: (v) =>
          v.pricePerDayVnd >= 1_000_000 && v.pricePerDayVnd < 2_000_000,
      },
      {
        value: "2-4",
        label: "2 – 4 triệu",
        matches: (v) =>
          v.pricePerDayVnd >= 2_000_000 && v.pricePerDayVnd < 4_000_000,
      },
      {
        value: "tren-4",
        label: "Trên 4 triệu",
        matches: (v) => v.pricePerDayVnd >= 4_000_000,
      },
    ],
  },
  {
    key: "b2b",
    label: "Phù hợp đoàn lớn",
    mode: "single",
    options: [
      {
        value: "co",
        label: "Phù hợp B2B / đoàn lớn",
        matches: (v) => v.b2bCapable,
      },
    ],
  },
]

const carFacetGroupByKey = new Map<string, CarFacetGroup>(
  carFacetGroups.map((group) => [group.key, group]),
)

export function findCarFacetGroup(key: string): CarFacetGroup | undefined {
  return carFacetGroupByKey.get(key)
}

/** Label for an option value inside a group, used by active-filter chips. */
export function carFacetOptionLabel(groupKey: string, value: string): string {
  const option = carFacetGroupByKey
    .get(groupKey)
    ?.options.find((candidate) => candidate.value === value)
  return option?.label ?? value
}
