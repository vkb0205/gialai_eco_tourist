import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowUpRight,
  CaretDown,
  CaretLeft,
  CaretRight,
  FunnelSimple,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react"
import forestImage from "@/imports/tours/dray-nur.webp"
import { regions, regionName } from "@/data/regions"
import { vehicles } from "@/data/carRental"
import type { Vehicle } from "@/data/carRental"
import { carFacetGroups, carFacetOptionLabel, categoryLabel, fuelLabel, transmissionLabel } from "@/data/carRentalFilters"
import type { CarFacetKey } from "@/data/carRentalFilters"
import { filterVehicles, CAR_SORT_LABELS, CAR_SORT_MODES, countActiveCarFilters, suggestCarRelaxation } from "@/lib/filterVehicles"
import type { CarFilterState, CarRelaxSuggestion, CarSortMode } from "@/lib/filterVehicles"
import { clearAllCarFilters, parseCarFilterState, serialiseCarFilterState, toggleCarFacet, toggleCarRegion } from "@/lib/vehicleUrlState"
import { navigateTo } from "@/lib/useHashRoute"
import { goToEnquiry } from "@/components/layout/Navigation"
import { formatVnd } from "@/lib/text"

function RentalHeader({ keyword, onKeywordChange }: { keyword: string; onKeywordChange: (value: string) => void }) {
  const [draft, setDraft] = useState(keyword)
  useEffect(() => setDraft(keyword), [keyword])
  useEffect(() => {
    const timer = window.setTimeout(() => onKeywordChange(draft), 240)
    return () => window.clearTimeout(timer)
  }, [draft, onKeywordChange])

  return (
    <header className="relative isolate overflow-hidden bg-[#10231a] text-white">
      <div className="absolute inset-0 -z-10">
        <img src={forestImage} alt="" aria-hidden="true" decoding="async" className="h-full w-full object-cover object-[50%_30%]" />
        <div className="absolute inset-0 bg-[#0c1f17]/65" />
      </div>
      <div className="mx-auto grid max-w-[1440px] items-end gap-10 px-6 pb-12 pt-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-16 lg:px-12 lg:pb-16 lg:pt-44">
        <div className="motion-safe:animate-[rise-in_700ms_cubic-bezier(0.32,0.72,0,1)_both]">
          <h1 className="m-0 font-display text-[clamp(2.5rem,6vw,4.75rem)] font-medium leading-[1] tracking-[-0.04em]">Thuê xe cho mọi hành trình</h1>
          <p className="m-0 mt-6 max-w-[36rem] text-lg leading-7">Từ xe 4 chỗ có tài xế đến xe khách 45 chỗ cho đoàn lớn. Chọn cung đường, quy mô và cách di chuyển, phần còn lại để chúng tôi lo.</p>
          <dl className="m-0 mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {[["4–45", "chỗ ngồi"], ["8", "vùng miền"], ["24/7", "hỗ trợ đoàn"]].map(([value, label]) => (
              <div key={label}>
                <dd className="m-0 font-display text-3xl leading-none">{value}</dd>
                <dt className="mt-1 text-[16px]">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <form role="search" className="w-full motion-safe:animate-[rise-in_700ms_cubic-bezier(0.32,0.72,0,1)_220ms_both]" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="rental-search" className="sr-only">Tìm loại xe</label>
          <div className="flex items-center rounded-full bg-white pl-5 pr-2 text-[#183024] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white">
            <MagnifyingGlass className="pointer-events-none h-5 w-5 shrink-0" aria-hidden="true" />
            <input id="rental-search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Tìm Toyota, xe 16 chỗ…" autoComplete="off" className="min-h-14 min-w-0 flex-1 bg-transparent px-3 text-[17px] outline-none placeholder:text-[#4f5b53]" />
            {draft && (
              <button type="button" onClick={() => setDraft("")} aria-label="Xóa tìm kiếm" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#e4e3dc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </form>
      </div>
    </header>
  )
}

function Facets({ state, counts, onToggle, idPrefix }: { state: CarFilterState; counts: Record<CarFacetKey, Record<string, number>>; onToggle: (key: CarFacetKey, value: string) => void; idPrefix: string }) {
  return (
    <div className="flex flex-col gap-3">
      {carFacetGroups.map((group) => (
        <details key={group.key} open={group.key === "category" || group.key === "seats" || group.key === "driver"} className="group">
          <summary className="flex min-h-11 cursor-pointer list-none select-none items-center justify-between gap-3 rounded-[2px] bg-[#ecebe5] px-4 py-2 text-[16px] font-semibold text-[#183024] outline-none transition-colors hover:bg-[#e2e1d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]">
            {group.label}
            <CaretDown aria-hidden="true" className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="space-y-0.5 px-1 pb-2 pt-2">
            {group.options.map((option) => {
              const count = counts[group.key]?.[option.value] ?? 0
              const checked = state.facets[group.key]?.includes(option.value)
              const disabled = !checked && count === 0
              const id = `${idPrefix}-${group.key}-${option.value}`
              return (
                <label key={option.value} htmlFor={id} className={`flex min-h-11 cursor-pointer items-center gap-3 text-[16px] ${disabled ? "cursor-not-allowed text-[#4f5b53]" : "text-[#2f3d35] hover:text-[#183024]"}`}>
                  <input id={id} type={group.mode === "single" ? "radio" : "checkbox"} checked={checked} disabled={disabled} onChange={() => onToggle(group.key, option.value)} className="h-[18px] w-[18px] shrink-0 accent-[#183024]" />
                  <span className="flex-1">{option.label}</span>
                  <span className="text-sm tabular-nums text-[#4f5b53]">{count}</span>
                </label>
              )
            })}
          </div>
        </details>
      ))}
    </div>
  )
}

function RegionFilter({ selected, counts, onToggle }: { selected: string[]; counts: Record<string, number>; onToggle: (slug: string) => void }) {
  return (
    <section className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:gap-6">
      <h2 className="m-0 shrink-0 font-display text-2xl tracking-[-0.02em] text-[#183024]">Chọn cung đường</h2>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo vùng miền">
        {regions.map((region) => {
          const active = selected.includes(region.slug)
          const count = counts[region.slug] ?? 0
          const disabled = !active && count === 0
          return (
            <button key={region.slug} type="button" disabled={disabled} aria-pressed={active} onClick={() => onToggle(region.slug)} className={`group flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-5 text-[15px] font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024] ${active ? "bg-[#183024] text-white" : disabled ? "cursor-not-allowed bg-[#dddbd3] text-[#4f5b53]" : "bg-white text-[#183024] hover:bg-[#183024] hover:text-white"}`}>
              {region.name}
              <span className={`text-sm font-medium tabular-nums ${active ? "text-white" : disabled ? "text-[#4f5b53]" : "text-[#4f5b53] group-hover:text-white"}`}>{count}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [failed, setFailed] = useState(false)
  const facts = [`${vehicle.seats} chỗ`, transmissionLabel(vehicle.transmission), fuelLabel(vehicle.fuel)]
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2px] bg-white transition-transform duration-300 motion-safe:hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#dddbd3]">
        {failed ? (
          <div className="flex h-full items-center justify-center text-[#4f5b53]">Ảnh xe</div>
        ) : (
          <img src={vehicle.image} alt={vehicle.name} onError={() => setFailed(true)} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 lg:p-6">
        <p className="m-0 text-[15px] font-semibold text-[#4f5b53]">{vehicle.brand} · {categoryLabel(vehicle.category)}</p>
        <h3 className="m-0 font-display text-[24px] leading-[1.15] tracking-[-0.02em] text-[#183024]">{vehicle.name}</h3>
        <p className="m-0 line-clamp-2 text-[16px] leading-6 text-[#2f3d35]">{vehicle.blurb}</p>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {facts.map((fact) => (
            <li key={fact} className="rounded-full bg-[#ecebe5] px-3 py-1.5 text-sm font-medium text-[#183024]">{fact}</li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <p className="m-0">
            <span className="block text-sm text-[#4f5b53]">Giá từ / ngày</span>
            <strong className="mt-0.5 block text-xl font-semibold text-[#183024]">{formatVnd(vehicle.pricePerDayVnd)}</strong>
          </p>
          <a href="#contact" onClick={goToEnquiry} className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[#183024] px-5 text-[15px] font-semibold text-white transition-colors hover:bg-[#a24627] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]">
            Đặt xe <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  )
}

function EmptyRental({ suggestion, onRelax, onClear }: { suggestion: CarRelaxSuggestion | null; onRelax: (suggestion: CarRelaxSuggestion) => void; onClear: () => void }) {
  return (
    <div className="rounded-[2px] bg-white px-6 py-16 text-center">
      <h2 className="m-0 font-display text-3xl text-[#183024]">Chưa có xe phù hợp</h2>
      <p className="mx-auto mt-3 max-w-md text-[17px] leading-7 text-[#2f3d35]">Hãy nới rộng một điều kiện để tìm được phương án di chuyển phù hợp.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        {suggestion && <button type="button" onClick={() => onRelax(suggestion)} className="min-h-12 rounded-full bg-[#183024] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#a24627] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]">Bỏ “{suggestion.label}”</button>}
        <button type="button" onClick={onClear} className="min-h-12 rounded-full bg-[#ecebe5] px-6 text-[15px] font-semibold text-[#183024] transition-colors hover:bg-[#dddbd3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]">Xóa tất cả</button>
      </div>
    </div>
  )
}

export default function CarRentalPage({ query }: { query: string }) {
  const state = useMemo(() => parseCarFilterState(query), [query])
  const result = useMemo(() => filterVehicles(vehicles, state), [state])
  const activeCount = countActiveCarFilters(state)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [ready, setReady] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const pageSize = 6
  useEffect(() => { const frame = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(frame) }, [])
  useEffect(() => setPage(1), [query])
  const apply = useCallback((next: CarFilterState) => navigateTo("/car-rental", serialiseCarFilterState(next)), [])
  const onToggleRegion = useCallback((slug: string) => apply(toggleCarRegion(state, slug)), [apply, state])
  const onToggleFacet = useCallback((key: CarFacetKey, value: string) => apply(toggleCarFacet(state, key, value)), [apply, state])
  const onClear = useCallback(() => apply(clearAllCarFilters(state)), [apply, state])
  const onKeyword = useCallback((keyword: string) => apply({ ...state, keyword }), [apply, state])
  const onRemove = useCallback((kind: "region" | "facet" | "keyword", value: string, groupKey?: CarFacetKey) => { if (kind === "region") onToggleRegion(value); else if (kind === "facet" && groupKey) onToggleFacet(groupKey, value); else onKeyword("") }, [onKeyword, onToggleFacet, onToggleRegion])
  const suggestion = useMemo(() => result.total === 0 ? suggestCarRelaxation(vehicles, state, (kind, groupKey, value) => kind === "region" ? regionName(value) : kind === "facet" && groupKey ? carFacetOptionLabel(groupKey, value) : `từ khóa “${value}”`) : null, [result.total, state])
  const pageCount = Math.max(1, Math.ceil(result.total / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visible = result.vehicles.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const chips = [...state.regions.map((value) => ({ kind: "region" as const, value, label: regionName(value) })), ...Object.entries(state.facets).flatMap(([groupKey, values]) => values.map((value) => ({ kind: "facet" as const, groupKey: groupKey as CarFacetKey, value, label: carFacetOptionLabel(groupKey, value) }))), ...(state.keyword.trim() ? [{ kind: "keyword" as const, value: state.keyword, label: `Từ khóa: ${state.keyword}` }] : [])]

  const pillBase = "min-h-11 rounded-full bg-white px-5 text-[15px] font-semibold text-[#183024] transition-colors hover:bg-[#dddbd3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"

  return (
    <div className="bg-[#ecebe5] pb-24 text-[#183024]">
      <RentalHeader keyword={state.keyword} onKeywordChange={onKeyword} />
      <div className="mx-auto max-w-[1440px] px-6 pt-12 lg:px-12 lg:pt-16">
        <RegionFilter selected={state.regions} counts={result.regionCounts} onToggle={onToggleRegion} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[288px_minmax(0,1fr)] lg:gap-14">
          <aside aria-label="Bộ lọc xe" className="hidden lg:sticky lg:top-[100px] lg:block lg:h-fit">
            <div className="rounded-[2px] bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="m-0 font-display text-2xl tracking-[-0.02em]">Bộ lọc xe</h2>
                {activeCount > 0 && <button type="button" onClick={onClear} className="min-h-11 text-[15px] font-semibold underline underline-offset-4 transition-colors hover:text-[#a24627] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]">Xóa tất cả</button>}
              </div>
              <div className="mt-5">
                <Facets state={state} counts={result.facetCounts} onToggle={onToggleFacet} idPrefix="rental-rail" />
              </div>
            </div>
          </aside>

          <section aria-labelledby="rental-results" className="min-w-0">
            <h2 id="rental-results" className="sr-only">Kết quả thuê xe</h2>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="m-0 text-lg text-[#2f3d35]" aria-live="polite"><strong className="font-semibold text-[#183024]">{result.total}</strong> xe phù hợp</p>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <button ref={triggerRef} type="button" onClick={() => setDrawerOpen(true)} aria-haspopup="dialog" aria-expanded={drawerOpen} className={`${pillBase} inline-flex items-center gap-2 whitespace-nowrap lg:hidden`}>
                  <FunnelSimple className="h-4 w-4" aria-hidden="true" /> Bộ lọc
                  {activeCount > 0 && <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#183024] px-1.5 text-sm font-semibold tabular-nums text-white">{activeCount}</span>}
                </button>
                <label htmlFor="car-sort" className="sr-only text-[15px] font-semibold sm:not-sr-only">Sắp xếp</label>
                <div className="relative min-w-0 flex-1 sm:flex-none">
                  <select id="car-sort" value={state.sort} onChange={(event) => apply({ ...state, sort: event.target.value as CarSortMode })} className={`${pillBase} w-full cursor-pointer appearance-none py-2.5 pr-10`}>
                    {CAR_SORT_MODES.map((mode) => <option key={mode} value={mode}>{CAR_SORT_LABELS[mode]}</option>)}
                  </select>
                  <CaretDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {chips.map((chip) => (
                  <button key={`${chip.kind}-${"groupKey" in chip ? chip.groupKey : ""}-${chip.value}`} type="button" onClick={() => onRemove(chip.kind, chip.value, "groupKey" in chip ? chip.groupKey : undefined)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#183024] pl-5 pr-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#a24627] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]">
                    {chip.label}<X className="h-3.5 w-3.5" aria-hidden="true" /><span className="sr-only">, bỏ bộ lọc này</span>
                  </button>
                ))}
              </div>
            )}

            <div className="pt-6">
              {!ready ? (
                <div aria-hidden="true" className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }, (_, i) => <div key={i} className="aspect-[4/5] rounded-[2px] bg-white motion-safe:animate-pulse" />)}
                </div>
              ) : result.total === 0 ? (
                <EmptyRental suggestion={suggestion} onRelax={(item) => { if (item.kind === "region") onToggleRegion(item.value ?? ""); else if (item.kind === "facet" && item.groupKey) onToggleFacet(item.groupKey, item.value ?? ""); else onKeyword("") }} onClear={onClear} />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {visible.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
                  </div>
                  {pageCount > 1 && (
                    <nav aria-label="Phân trang" className="mt-14 flex items-center justify-center gap-2">
                      <button type="button" disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)} aria-label="Trang trước" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white transition-colors hover:bg-[#dddbd3] disabled:cursor-not-allowed disabled:bg-[#dddbd3] disabled:text-[#4f5b53] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"><CaretLeft className="h-4 w-4" aria-hidden="true" /></button>
                      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                        <button key={p} type="button" onClick={() => setPage(p)} aria-label={`Trang ${p}`} aria-current={p === currentPage ? "page" : undefined} className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-[15px] font-semibold tabular-nums transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024] ${p === currentPage ? "bg-[#183024] text-white" : "bg-white text-[#183024] hover:bg-[#dddbd3]"}`}>{p}</button>
                      ))}
                      <button type="button" disabled={currentPage === pageCount} onClick={() => setPage((p) => p + 1)} aria-label="Trang sau" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white transition-colors hover:bg-[#dddbd3] disabled:cursor-not-allowed disabled:bg-[#dddbd3] disabled:text-[#4f5b53] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"><CaretRight className="h-4 w-4" aria-hidden="true" /></button>
                    </nav>
                  )}
                </>
              )}
            </div>
          </section>
        </div>

        <section className="mt-20 rounded-[2px] bg-[#183024] px-6 py-12 text-white lg:px-12 lg:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <div>
              <h2 className="m-0 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.03em]">Đoàn 20 đến 200 khách?</h2>
              <p className="m-0 mt-4 max-w-2xl text-[17px] leading-7">Chúng tôi kết nối đội xe địa phương, tài xế và phụ xe để điều phối tour, sự kiện, team building hoặc nhu cầu trung chuyển lớn.</p>
            </div>
            <a href="#contact" onClick={goToEnquiry} className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-8 text-[16px] font-semibold text-[#183024] transition-colors hover:bg-[#dddbd3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Nhận báo giá đoàn <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>

      <RentalDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} state={state} counts={result.facetCounts} onToggle={onToggleFacet} onClear={onClear} resultCount={result.total} />
    </div>
  )
}

function RentalDrawer({ open, onClose, state, counts, onToggle, onClear, resultCount }: { open: boolean; onClose: () => void; state: CarFilterState; counts: Record<CarFacetKey, Record<string, number>>; onToggle: (key: CarFacetKey, value: string) => void; onClear: () => void; resultCount: number }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button type="button" onClick={onClose} aria-label="Đóng bộ lọc" className="absolute inset-0 bg-[#10231a]/60" />
      <div role="dialog" aria-modal="true" aria-label="Bộ lọc xe" className="absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col overflow-y-auto bg-[#ecebe5]">
        <div className="flex items-center justify-between bg-white px-6 py-4">
          <h2 className="m-0 font-display text-2xl tracking-[-0.02em] text-[#183024]">Bộ lọc xe</h2>
          <button type="button" onClick={onClose} aria-label="Đóng bộ lọc" className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ecebe5] text-[#183024] transition-colors hover:bg-[#dddbd3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"><X className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <div className="flex-1 px-6 py-6">
          <Facets state={state} counts={counts} onToggle={onToggle} idPrefix="rental-drawer" />
        </div>
        <div className="sticky bottom-0 flex gap-3 bg-white px-6 py-4">
          <button type="button" onClick={onClear} className="min-h-12 rounded-full bg-[#ecebe5] px-5 text-[15px] font-semibold text-[#183024] transition-colors hover:bg-[#dddbd3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]">Xóa tất cả</button>
          <button type="button" onClick={onClose} className="min-h-12 flex-1 rounded-full bg-[#183024] px-5 text-[15px] font-semibold text-white transition-colors hover:bg-[#a24627] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]">Xem {resultCount} xe</button>
        </div>
      </div>
    </div>
  )
}
