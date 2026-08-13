import { tourGroups } from "./tours"
import type { Difficulty, Theme, Tour, TourGroup } from "./tours"

/**
 * Facet group configuration.
 *
 * Each group declares how its options test a tour, so the filter engine can
 * stay generic: it never needs to know what "duration band" means, only how to
 * ask a group whether a tour matches an option.
 */

/** Keys used in the URL. Region lives outside this list, in its own strip. */
export type FacetKey =
  | "theme"
  | "duration"
  | "price"
  | "difficulty"
  | "season"
  | "group"
  | "tourGroup"
  | "destination"
  | "special"

export type FacetOption = {
  /** Stable value written to the URL. */
  value: string
  /** Vietnamese label. */
  label: string
  /** Whether a given tour satisfies this option. */
  matches: (tour: Tour) => boolean
}

export type FacetGroup = {
  key: FacetKey
  label: string
  /**
   * `multiple` lets options inside the group combine as OR (FR-004).
   * `single` restricts the group to one active option at a time.
   */
  mode: "single" | "multiple"
  options: FacetOption[]
}

const themeLabels: Record<Theme, string> = {
  trekking: "Trekking",
  "van-hoa": "Văn hóa",
  "thien-nhien": "Thiên nhiên",
  "phieu-luu": "Phiêu lưu",
  "am-thuc": "Ẩm thực",
  "bien-dao": "Biển đảo",
}

const difficultyLabels: Record<Difficulty, string> = {
  de: "Nhẹ nhàng",
  vua: "Vừa sức",
  kho: "Thử thách",
}

/** Public label lookups, reused by cards and chips so wording never diverges. */
export function themeLabel(theme: string): string {
  return themeLabels[(theme as Theme)] ?? theme
}

export function difficultyLabel(difficulty: string): string {
  return difficultyLabels[(difficulty as Difficulty)] ?? difficulty
}

const seasonMonths: Record<string, number[]> = {
  xuan: [1, 2, 3],
  he: [4, 5, 6],
  thu: [7, 8, 9],
  dong: [10, 11, 12],
}

const seasonLabels: Record<string, string> = {
  xuan: "Tháng 1 - 3",
  he: "Tháng 4 - 6",
  thu: "Tháng 7 - 9",
  dong: "Tháng 10 - 12",
}

export const facetGroups: FacetGroup[] = [
  {
    key: "theme",
    label: "Chủ đề",
    mode: "multiple",
    options: (Object.keys(themeLabels) as Theme[]).map((theme) => ({
      value: theme,
      label: themeLabels[theme],
      matches: (tour) => tour.theme === theme,
    })),
  },
  {
    key: "duration",
    label: "Số ngày",
    mode: "multiple",
    options: [
      {
        value: "1",
        label: "1 ngày",
        matches: (tour) => tour.durationDays === 1,
      },
      {
        value: "2-3",
        label: "2 - 3 ngày",
        matches: (tour) => tour.durationDays >= 2 && tour.durationDays <= 3,
      },
      {
        value: "4+",
        label: "4 ngày trở lên",
        matches: (tour) => tour.durationDays >= 4,
      },
    ],
  },
  {
    key: "price",
    label: "Mức giá",
    mode: "multiple",
    options: [
      {
        value: "duoi-1",
        label: "Dưới 1 triệu",
        matches: (tour) => tour.priceVnd < 1_000_000,
      },
      {
        value: "1-2",
        label: "1 - 2 triệu",
        matches: (tour) =>
          tour.priceVnd >= 1_000_000 && tour.priceVnd < 2_000_000,
      },
      {
        value: "2-4",
        label: "2 - 4 triệu",
        matches: (tour) =>
          tour.priceVnd >= 2_000_000 && tour.priceVnd < 4_000_000,
      },
      {
        value: "tren-4",
        label: "Trên 4 triệu",
        matches: (tour) => tour.priceVnd >= 4_000_000,
      },
    ],
  },
  {
    key: "difficulty",
    label: "Thể lực",
    mode: "multiple",
    options: (Object.keys(difficultyLabels) as Difficulty[]).map(
      (difficulty) => ({
        value: difficulty,
        label: difficultyLabels[difficulty],
        matches: (tour) => tour.difficulty === difficulty,
      }),
    ),
  },
  {
    key: "season",
    label: "Thời điểm khởi hành",
    mode: "multiple",
    options: Object.keys(seasonMonths).map((season) => ({
      value: season,
      label: seasonLabels[season],
      matches: (tour) =>
        tour.departureMonths.some((month) =>
          seasonMonths[season].includes(month),
        ),
    })),
  },
  {
    key: "group",
    label: "Quy mô nhóm",
    mode: "multiple",
    options: [
      {
        value: "rat-nho",
        label: "Tối đa 8 người",
        matches: (tour) => tour.groupMax <= 8,
      },
      {
        value: "nho",
        label: "9 - 12 người",
        matches: (tour) => tour.groupMax > 8 && tour.groupMax <= 12,
      },
      {
        value: "vua",
        label: "13 người trở lên",
        matches: (tour) => tour.groupMax > 12,
      },
    ],
  },
  {
    key: "tourGroup",
    label: "Loại hành trình",
    mode: "single",
    options: (Object.entries(tourGroups) as [TourGroup, (typeof tourGroups)[TourGroup]][]).map(
      ([value, group]) => ({
        value,
        label: group.label,
        matches: (tour) => tour.tourGroup === value,
      }),
    ),
  },
  {
    key: "destination",
    label: "Điểm đến quốc tế",
    mode: "multiple",
    options: [
      "Thái Lan",
      "Campuchia",
      "Singapore",
      "Hàn Quốc",
      "Nhật Bản",
      "Trung Quốc",
      "Mỹ",
      "Khác",
    ].map((value) => ({
      value,
      label: value,
      matches: (tour) =>
        tour.tourGroup === "international" && tour.category === value,
    })),
  },
  {
    key: "special",
    label: "Hành trình đặc biệt",
    mode: "multiple",
    options: [
      "Tour du thuyền",
      "Tour trải nghiệm học sinh-sinh viên",
      "Tour Cựu Chiến Binh",
    ].map((value) => ({
      value,
      label: value,
      matches: (tour) =>
        tour.tourGroup === "special" && tour.category === value,
    })),
  },
]

const facetGroupByKey = new Map<string, FacetGroup>(
  facetGroups.map((group) => [group.key, group]),
)

export function findFacetGroup(key: string): FacetGroup | undefined {
  return facetGroupByKey.get(key)
}

/** Label for an option value inside a group, used by the active-filter chips. */
export function facetOptionLabel(groupKey: string, value: string): string {
  const option = facetGroupByKey
    .get(groupKey)
    ?.options.find((candidate) => candidate.value === value)
  return option?.label ?? value
}
