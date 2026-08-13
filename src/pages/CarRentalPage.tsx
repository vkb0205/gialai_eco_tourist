import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowUpRight,
  Check,
  FunnelSimple,
  MagnifyingGlass,
  MapPin,
  Users,
  X,
} from "@phosphor-icons/react"
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
    <header className="relative isolate overflow-hidden bg-[#183024] text-white">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(8,26,19,.98),rgba(24,48,36,.72),rgba(213,103,66,.2))]" />
      <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-25 mix-blend-screen" />
      <div className="mx-auto max-w-[1440px] px-6 pb-12 pt-32 lg:px-12 lg:pb-16">
        <div className="max-w-3xl">
          <p className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.28em] text-[#f2b08e]"><span className="h-px w-10 bg-[#f2b08e]" /> Dịch vụ vận chuyển</p>
          <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-[1.02] tracking-[-.05em]">Thuê xe cho mọi hành trình</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 lg:text-lg">Từ xe 4 chỗ có tài xế đến xe khách 45 chỗ cho đoàn lớn. Chọn cung đường, quy mô và cách di chuyển — chúng tôi lo phần còn lại.</p>
          <form className="mt-8 max-w-2xl" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="rental-search" className="sr-only">Tìm loại xe</label>
            <div className="flex items-center rounded-2xl bg-white p-2 text-[#183024] shadow-[0_18px_45px_rgba(0,0,0,.2)]">
              <MagnifyingGlass className="ml-3 h-5 w-5 shrink-0 text-[#69746b]" aria-hidden="true" />
              <input id="rental-search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Tìm Toyota, xe 16 chỗ, xe có tài xế…" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-[#9aa199]" />
              {draft && <button type="button" onClick={() => setDraft("")} aria-label="Xóa tìm kiếm" className="mr-2 rounded-full p-2 hover:bg-[#e9e6dd]"><X className="h-4 w-4" /></button>}
              <button type="submit" className="rounded-xl bg-[#d56742] px-5 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-white">Tìm xe</button>
            </div>
          </form>
        </div>
        <div className="mt-10 grid max-w-3xl grid-cols-3 gap-3 text-[10px] font-bold uppercase tracking-[.14em] text-white/65 sm:gap-8"><span><strong className="block font-display text-2xl text-[#fed24f]">4–45</strong> chỗ ngồi</span><span><strong className="block font-display text-2xl text-[#fed24f]">8</strong> vùng miền</span><span><strong className="block font-display text-2xl text-[#fed24f]">24/7</strong> hỗ trợ đoàn</span></div>
      </div>
    </header>
  )
}

function Facets({ state, counts, onToggle, idPrefix }: { state: CarFilterState; counts: Record<CarFacetKey, Record<string, number>>; onToggle: (key: CarFacetKey, value: string) => void; idPrefix: string }) {
  return <div className="divide-y divide-[#e0dcd2]">{carFacetGroups.map((group) => <details key={group.key} open={group.key === "category" || group.key === "seats" || group.key === "driver"} className="group"><summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#526257]">{group.label}<span className="text-[#d56742] group-open:rotate-180">⌄</span></summary><div className="space-y-2 pb-4">{group.options.map((option) => { const checked = state.facets[group.key]?.includes(option.value); const disabled = !checked && (counts[group.key]?.[option.value] ?? 0) === 0; const id = `${idPrefix}-${group.key}-${option.value}`; return <label key={option.value} htmlFor={id} className={`flex items-center gap-3 text-[13px] ${disabled ? "text-[#a5aba5]" : "text-[#42524a]"}`}><input id={id} type={group.mode === "single" ? "radio" : "checkbox"} checked={checked} disabled={disabled} onChange={() => onToggle(group.key, option.value)} className="h-4 w-4 accent-[#d56742]" /><span className="flex-1">{option.label}</span><span className="text-[10px] tabular-nums text-[#9aa199]">{counts[group.key]?.[option.value] ?? 0}</span></label>})}</div></details>)}</div>
}

function RegionFilter({ selected, counts, onToggle }: { selected: string[]; counts: Record<string, number>; onToggle: (slug: string) => void }) {
  return <section><div className="flex items-baseline justify-between"><h2 className="text-[10px] font-bold uppercase tracking-[.2em] text-[#526257]">Chọn cung đường</h2><span className="text-[10px] text-[#9aa199]">{regions.length} vùng</span></div><div className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-wrap">{regions.map((region) => { const active = selected.includes(region.slug); const disabled = !active && (counts[region.slug] ?? 0) === 0; return <button key={region.slug} type="button" disabled={disabled} onClick={() => onToggle(region.slug)} className={`shrink-0 rounded-full border px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.1em] transition ${active ? "border-[#183024] bg-[#183024] text-white" : disabled ? "border-[#e0dcd2] text-[#a5aba5]" : "border-[#d2cec3] bg-white text-[#526257] hover:border-[#d56742] hover:text-[#d56742]"}`}>{region.name}</button>})}</div></section>
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [failed, setFailed] = useState(false)
  return <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e0dcd2] bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(24,48,36,.13)]"><div className="relative aspect-[1.6/1] overflow-hidden bg-[#e9e6dd]">{failed ? <div className="flex h-full items-center justify-center text-[#9aa199]">Ảnh xe</div> : <img src={vehicle.image} alt={vehicle.name} onError={() => setFailed(true)} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}<span className="absolute left-4 top-4 rounded-full bg-[#e7f6e9] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.1em] text-[#278641]">Có xe ngay</span><button type="button" aria-label={`Lưu ${vehicle.name}`} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#183024]">♡</button></div><div className="flex flex-1 flex-col p-5 lg:p-6"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#8a928b]">{vehicle.brand} · {categoryLabel(vehicle.category)}</p><h3 className="mt-2 font-display text-[25px] leading-tight tracking-[-.04em] text-[#183024]">{vehicle.name}</h3><p className="mt-3 line-clamp-2 text-[13px] leading-6 text-[#69746b]">{vehicle.blurb}</p><div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#e5e1d8] pt-4 text-[11px] text-[#526257]"><span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-[#d56742]" />{vehicle.seats} chỗ</span><span>{transmissionLabel(vehicle.transmission)}</span><span>{fuelLabel(vehicle.fuel)}</span></div><div className="mt-auto flex items-end justify-between gap-3 border-t border-[#e5e1d8] pt-4"><p className="m-0"><span className="block text-[9px] font-bold uppercase tracking-[.14em] text-[#8a928b]">Giá từ / ngày</span><strong className="mt-1 block text-[16px] text-[#b4502f]">{formatVnd(vehicle.pricePerDayVnd)}</strong></p><a href="#contact" onClick={goToEnquiry} className="inline-flex items-center gap-2 rounded-full bg-[#183024] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.12em] text-white transition hover:bg-[#d56742]">Đặt xe <ArrowUpRight className="h-3.5 w-3.5" /></a></div></div></article>
}

function EmptyRental({ suggestion, onRelax, onClear }: { suggestion: CarRelaxSuggestion | null; onRelax: (suggestion: CarRelaxSuggestion) => void; onClear: () => void }) {
  return <div className="rounded-2xl border border-dashed border-[#c8c4b8] bg-white px-6 py-16 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e9e6dd] text-[#d56742]"><FunnelSimple className="h-6 w-6" /></div><h2 className="mt-5 font-display text-3xl text-[#183024]">Chưa có xe phù hợp</h2><p className="mt-3 text-sm text-[#69746b]">Hãy nới rộng một điều kiện để tìm được phương án di chuyển phù hợp.</p><div className="mt-7 flex flex-wrap justify-center gap-3">{suggestion && <button type="button" onClick={() => onRelax(suggestion)} className="rounded-full bg-[#183024] px-5 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-white">Bỏ “{suggestion.label}”</button>}<button type="button" onClick={onClear} className="rounded-full border border-[#c8c4b8] px-5 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#183024]">Xóa tất cả</button></div></div>
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

  return <div className="pt-[78px] pb-24"><RentalHeader keyword={state.keyword} onKeywordChange={onKeyword} /><div className="mx-auto max-w-[1440px] px-6 pt-9 lg:px-12 lg:pt-12"><RegionFilter selected={state.regions} counts={result.regionCounts} onToggle={onToggleRegion} /><div className="mt-10 grid gap-10 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-12"><aside className="hidden lg:block lg:sticky lg:top-[100px] lg:h-fit"><div className="rounded-2xl border border-[#e0dcd2] bg-white p-6"><div className="flex items-center justify-between"><h2 className="m-0 font-mono text-[11px] font-bold uppercase tracking-[.18em] text-[#183024]">Bộ lọc xe</h2>{activeCount > 0 && <button type="button" onClick={onClear} className="text-[10px] font-bold uppercase text-[#d56742]">Xóa tất cả</button>}</div><div className="mt-3 flex items-center rounded-xl bg-[#f6f3ec] px-3 py-2.5"><MagnifyingGlass className="h-4 w-4 text-[#69746b]" /><span className="ml-2 text-[12px] text-[#9aa199]">Đã lọc theo từ khóa ở trên</span></div><Facets state={state} counts={result.facetCounts} onToggle={onToggleFacet} idPrefix="rental-rail" /></div></aside><section className="min-w-0"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e0dcd2] pb-5"><p className="m-0 text-sm text-[#42524a]"><strong className="text-[#183024]">{result.total}</strong> xe phù hợp</p><div className="flex items-center gap-2"><button ref={triggerRef} type="button" onClick={() => setDrawerOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-[#c8c4b8] bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.12em] lg:hidden"><FunnelSimple className="h-4 w-4" /> Bộ lọc {activeCount > 0 && <span className="rounded-full bg-[#183024] px-2 py-1 text-white">{activeCount}</span>}</button><label htmlFor="car-sort" className="text-[10px] font-bold uppercase tracking-[.12em] text-[#69746b]">Sắp xếp</label><select id="car-sort" value={state.sort} onChange={(event) => apply({ ...state, sort: event.target.value as CarSortMode })} className="rounded-full border border-[#c8c4b8] bg-white px-3 py-2.5 text-[12px] text-[#183024] outline-none">{CAR_SORT_MODES.map((mode) => <option key={mode} value={mode}>{CAR_SORT_LABELS[mode]}</option>)}</select></div></div>{chips.length > 0 && <div className="flex flex-wrap gap-2 py-4">{chips.map((chip) => <button key={`${chip.kind}-${("groupKey" in chip ? chip.groupKey : "")}-${chip.value}`} type="button" onClick={() => onRemove(chip.kind, chip.value, "groupKey" in chip ? chip.groupKey : undefined)} className="inline-flex items-center gap-2 rounded-full bg-[#183024] px-3.5 py-2 text-[10px] font-semibold text-white">{chip.label}<X className="h-3 w-3" /></button>)}</div>}<div className="pt-3">{!ready ? <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="aspect-[.8] animate-pulse rounded-2xl bg-white" />)}</div> : result.total === 0 ? <EmptyRental suggestion={suggestion} onRelax={(item) => { if (item.kind === "region") onToggleRegion(item.value ?? ""); else if (item.kind === "facet" && item.groupKey) onToggleFacet(item.groupKey, item.value ?? ""); else onKeyword("")} } onClear={onClear} /> : <><div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{visible.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div>{pageCount > 1 && <div className="mt-10 flex justify-center gap-2"><button type="button" disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)} className="rounded-full border border-[#c8c4b8] px-4 py-2 text-sm disabled:opacity-40">←</button>{Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => <button key={p} type="button" onClick={() => setPage(p)} className={`h-9 w-9 rounded-full text-xs font-bold ${p === currentPage ? "bg-[#183024] text-white" : "border border-[#c8c4b8] bg-white"}`}>{p}</button>)}<button type="button" disabled={currentPage === pageCount} onClick={() => setPage((p) => p + 1)} className="rounded-full border border-[#c8c4b8] px-4 py-2 text-sm disabled:opacity-40">→</button></div>}</>}</div></section></div><section className="mt-16 overflow-hidden rounded-2xl bg-[#183024] px-6 py-10 text-white lg:px-12"><div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#f2b08e]">Giải pháp B2B</p><h2 className="mt-3 font-display text-3xl tracking-[-.04em]">Đoàn 20 đến 200 khách?</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Chúng tôi kết nối đội xe địa phương, tài xế và phụ xe để điều phối tour, sự kiện, team building hoặc nhu cầu trung chuyển lớn.</p></div><a href="#contact" onClick={goToEnquiry} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#fed24f] px-6 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#183024]">Nhận báo giá đoàn <ArrowUpRight className="h-4 w-4" /></a></div></section></div><RentalDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} state={state} counts={result.facetCounts} onToggle={onToggleFacet} onClear={onClear} resultCount={result.total} /></div>
}

function RentalDrawer({ open, onClose, state, counts, onToggle, onClear, resultCount }: { open: boolean; onClose: () => void; state: CarFilterState; counts: Record<CarFacetKey, Record<string, number>>; onToggle: (key: CarFacetKey, value: string) => void; onClear: () => void; resultCount: number }) {
  if (!open) return null
  return <div className="fixed inset-0 z-[60] lg:hidden"><button type="button" onClick={onClose} aria-label="Đóng bộ lọc" className="absolute inset-0 bg-[#10231a]/60" /><div className="absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col overflow-y-auto bg-[#f6f3ec] p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-display text-2xl text-[#183024]">Bộ lọc xe</h2><button type="button" onClick={onClose} aria-label="Đóng bộ lọc" className="rounded-full border border-[#c8c4b8] p-2"><X className="h-5 w-5" /></button></div><div className="mt-4"><Facets state={state} counts={counts} onToggle={onToggle} idPrefix="rental-drawer" /></div><div className="mt-auto flex gap-3 border-t border-[#e0dcd2] pt-5"><button type="button" onClick={onClear} className="rounded-full border border-[#c8c4b8] px-4 py-3 text-[10px] font-bold uppercase">Xóa tất cả</button><button type="button" onClick={onClose} className="flex-1 rounded-full bg-[#183024] px-4 py-3 text-[10px] font-bold uppercase text-white">Xem {resultCount} xe</button></div></div></div>
}
