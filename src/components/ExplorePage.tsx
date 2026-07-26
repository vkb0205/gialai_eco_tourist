import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Compass, LocateFixed, MapPinned, RotateCcw, Search } from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import vietnamMap from '../assets/vn.svg?raw';
import { exploreRegions, type ExploreDestination } from '../data/explore';

type ExplorePageProps = { onBackHome: () => void };
type SelectionSource = 'click' | 'keyboard' | 'filter';
type Direction = 'up' | 'down' | 'left' | 'right';

type SelectedPoint = { pointId: string; regionId: string; provinceName: string; source: SelectionSource };
type MapPointInfo = { pointId: string; provinceName: string; regionId: string; aliases: string[] };
type SearchResult = { id: string; label: string; summary: string; pointId: string; regionId: string; provinceName: string; type: 'province' | 'destination' };
type TransformState = { x: number; y: number; scale: number };

const SELECTED_POINT_ZOOM = 2.45;
const FULL_TRANSFORM: TransformState = { x: 0, y: 0, scale: 1 };
const PAN_STEP = 96;
const PAN_BOUNDARY = 720;

const normalizeSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/\s+/g, ' ').trim();
const toCssTransform = ({ x, y, scale }: TransformState) => `translate(${x}px, ${y}px) scale(${scale})`;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function ExplorePage({ onBackHome }: ExplorePageProps) {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const [transform, setTransform] = useState<TransformState>(FULL_TRANSFORM);
  const [filterQuery, setFilterQuery] = useState('');
  const [lastBoundary, setLastBoundary] = useState<Direction | null>(null);
  const mapStageRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const activeRegion = useMemo(() => exploreRegions.find((region) => region.id === selectedPoint?.regionId) ?? null, [selectedPoint?.regionId]);

  const provinceMetadataLookup = useMemo(() => {
    const lookup = new Map<string, MapPointInfo>();
    exploreRegions.forEach((region) => {
      region.provinceIds.forEach((provinceId, index) => {
        const provinceName = region.provinceNames[index] ?? provinceId;
        const aliases = region.provinceAliases?.[provinceId] ?? [];
        const info = { pointId: provinceId, provinceName, regionId: region.id, aliases };
        lookup.set(provinceId, info);
        lookup.set(provinceName, info);
        aliases.forEach((alias) => lookup.set(alias, info));
      });
    });
    return lookup;
  }, []);

  const searchResults = useMemo<SearchResult[]>(() => {
    const query = normalizeSearch(filterQuery);
    if (!query) return [];
    const results: SearchResult[] = [];
    const addIfMatch = (result: SearchResult, labels: string[]) => {
      if (labels.some((label) => normalizeSearch(label).includes(query))) results.push(result);
    };
    exploreRegions.forEach((region) => {
      region.provinceIds.forEach((provinceId, index) => {
        const provinceName = region.provinceNames[index] ?? provinceId;
        const aliases = region.provinceAliases?.[provinceId] ?? [];
        addIfMatch({ id: `province-${provinceId}`, label: provinceName, summary: `Tỉnh thuộc ${region.label}`, pointId: provinceId, regionId: region.id, provinceName, type: 'province' }, [provinceName, provinceId, region.label, ...aliases]);
      });
      region.destinations.filter((d) => d.isSelectable).forEach((destination: ExploreDestination) => {
        const province = provinceMetadataLookup.get(destination.provinceId);
        if (!province) return;
        addIfMatch({ id: destination.id, label: destination.name, summary: destination.summary, pointId: province.pointId, regionId: region.id, provinceName: province.provinceName, type: 'destination' }, [destination.name, ...destination.aliases, province.provinceName]);
      });
    });
    return results.slice(0, 8);
  }, [filterQuery, provinceMetadataLookup]);

  const centerMapOnPoint = (mark: SVGCircleElement) => {
    const stage = mapStageRef.current;
    const root = mapRef.current;
    const svg = root?.querySelector('svg');
    if (!stage || !root || !svg) return;
    const viewBox = svg.viewBox.baseVal;
    const pointX = ((mark.cx.baseVal.value - viewBox.x) / (viewBox.width || 1)) * root.offsetWidth;
    const pointY = ((mark.cy.baseVal.value - viewBox.y) / (viewBox.height || 1)) * root.offsetHeight;
    const rootLeft = (stage.clientWidth - root.offsetWidth) / 2;
    const rootTop = (stage.clientHeight - root.offsetHeight) / 2;
    setTransform({ x: stage.clientWidth / 2 - rootLeft - pointX * SELECTED_POINT_ZOOM, y: stage.clientHeight / 2 - rootTop - pointY * SELECTED_POINT_ZOOM, scale: SELECTED_POINT_ZOOM });
    setLastBoundary(null);
  };

  const selectPoint = (point: Omit<SelectedPoint, 'source'>, source: SelectionSource) => {
    setSelectedPoint({ ...point, source });
    const mark = mapRef.current?.querySelector<SVGCircleElement>(`svg #label_points circle[id="${point.pointId}"]`);
    if (mark) centerMapOnPoint(mark);
  };

  const resetMapView = () => { setSelectedPoint(null); setHoveredPointId(null); setTransform(FULL_TRANSFORM); setLastBoundary(null); };

  const panMap = (direction: Direction) => {
    if (!selectedPoint) return;
    setTransform((current) => {
      const next = { ...current };
      if (direction === 'up') next.y += PAN_STEP;
      if (direction === 'down') next.y -= PAN_STEP;
      if (direction === 'left') next.x += PAN_STEP;
      if (direction === 'right') next.x -= PAN_STEP;
      const clamped = { ...next, x: clamp(next.x, -PAN_BOUNDARY, PAN_BOUNDARY), y: clamp(next.y, -PAN_BOUNDARY, PAN_BOUNDARY) };
      setLastBoundary(clamped.x !== next.x || clamped.y !== next.y ? direction : null);
      return clamped;
    });
  };

  useEffect(() => {
    const root = mapRef.current;
    if (!root) return;
    const provincePaths = Array.from(root.querySelectorAll<SVGPathElement>('svg path[id]'));
    const provinceNameLookup = new Map<string, string>();
    provincePaths.forEach((path) => {
      const provinceName = path.getAttribute('name') ?? path.id;
      const info = provinceMetadataLookup.get(path.id) ?? provinceMetadataLookup.get(provinceName);
      provinceNameLookup.set(path.id, provinceName);
      path.classList.toggle('is-unavailable', !info);
      path.classList.toggle('is-selected-region', info?.pointId === selectedPoint?.pointId);
      path.classList.toggle('is-hovered-region', info?.pointId === hoveredPointId && hoveredPointId !== selectedPoint?.pointId);
    });

    const provinceMarks = Array.from(root.querySelectorAll<SVGCircleElement>('svg #label_points circle[id]'));
    const cleanups = provinceMarks.map((mark) => {
      const fallbackName = provinceNameLookup.get(mark.id) ?? mark.getAttribute('class') ?? mark.id;
      const pointInfo = provinceMetadataLookup.get(mark.id) ?? provinceMetadataLookup.get(fallbackName);
      mark.classList.toggle('is-unavailable', !pointInfo);
      if (!pointInfo) return undefined;
      mark.classList.add('is-clickable');
      mark.classList.toggle('is-selected-region', selectedPoint?.pointId === pointInfo.pointId);
      mark.classList.toggle('is-hovered-region', hoveredPointId === pointInfo.pointId && selectedPoint?.pointId !== pointInfo.pointId);
      mark.setAttribute('role', 'button');
      mark.setAttribute('tabindex', '0');
      mark.setAttribute('aria-label', `Chọn ${pointInfo.provinceName}`);
      mark.setAttribute('aria-pressed', String(selectedPoint?.pointId === pointInfo.pointId));
      const onEnter = () => setHoveredPointId(pointInfo.pointId);
      const onLeave = () => setHoveredPointId((current) => (current === pointInfo.pointId ? null : current));
      const onClick = () => selectPoint(pointInfo, 'click');
      const onKey = (event: KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectPoint(pointInfo, 'keyboard'); } };
      mark.addEventListener('pointerenter', onEnter); mark.addEventListener('pointerleave', onLeave); mark.addEventListener('click', onClick); mark.addEventListener('keydown', onKey);
      return () => { mark.removeEventListener('pointerenter', onEnter); mark.removeEventListener('pointerleave', onLeave); mark.removeEventListener('click', onClick); mark.removeEventListener('keydown', onKey); };
    });
    return () => cleanups.forEach((cleanup) => cleanup?.());
  }, [hoveredPointId, provinceMetadataLookup, selectedPoint?.pointId]);

  const navButtons: { direction: Direction; label: string; icon: ReactNode }[] = [
    { direction: 'up', label: 'Di chuyển bản đồ lên', icon: <ArrowUp size={18} /> },
    { direction: 'left', label: 'Di chuyển bản đồ sang trái', icon: <ArrowLeft size={18} /> },
    { direction: 'right', label: 'Di chuyển bản đồ sang phải', icon: <ArrowRight size={18} /> },
    { direction: 'down', label: 'Di chuyển bản đồ xuống', icon: <ArrowDown size={18} /> },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-[#f2efe7] pt-32 text-[#203828] md:pt-40">
      <section className="mx-auto max-w-[92rem] px-5 pb-16 md:px-8 lg:px-14">
        <button type="button" onClick={onBackHome} className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#d9cfbd] bg-[#fffaf0] px-5 py-3 font-black text-[#203828] shadow-sm transition hover:-translate-x-1 focus:outline-none focus:ring-4 focus:ring-[#d9a441]/35"><ArrowLeft size={18} /> Trang chủ</button>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div><p className="mb-5 inline-flex rounded-full bg-[#d9a441]/20 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#8a5a16]">Bản đồ tương tác</p><h1 className="text-balance font-serif text-6xl font-black leading-none tracking-[-0.055em] md:text-8xl">Chọn vùng trên bản đồ.</h1></div>
          <p className="text-pretty text-lg leading-8 text-[#536656] md:text-xl">Di chuột chỉ xem trước. Click, nhấn Enter hoặc chọn từ bộ lọc để tập trung bản đồ vào tỉnh mong muốn.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[92rem] gap-8 px-5 pb-24 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.55fr)] lg:px-14 lg:pb-32">
        <div className="relative overflow-hidden rounded-[2.4rem] bg-[#203828] p-4 text-[#fffaf0] shadow-[0_35px_100px_rgba(32,56,40,0.22)] md:rounded-[3.5rem] md:p-7">
          <div className="relative z-10 mb-5 grid gap-4 xl:grid-cols-[1fr_minmax(18rem,0.8fr)_auto] xl:items-start">
            <div><p className="text-sm font-black uppercase tracking-[0.18em] text-[#d9a441]">Khám phá có chủ đích</p><h2 className="mt-2 text-3xl font-black tracking-[-0.04em] md:text-5xl">{activeRegion ? activeRegion.label : 'Việt Nam'}</h2></div>
            <label className="block rounded-[1.4rem] bg-white/10 p-3 backdrop-blur"><span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#f5d889]"><Search size={15} /> Tìm điểm đến</span><input value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} placeholder="Nhập Pleiku, Hội An, Cà Mau..." className="w-full rounded-full border border-white/16 bg-[#fffaf0] px-4 py-3 text-sm font-bold text-[#203828] outline-none focus:ring-4 focus:ring-[#d9a441]/45" /></label>
            <button type="button" onClick={resetMapView} className="inline-flex w-fit items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-3 text-sm font-black text-[#fffaf0] backdrop-blur-2xl transition hover:bg-white/18 focus:outline-none focus:ring-4 focus:ring-white/30"><RotateCcw size={17} /> Xem toàn bản đồ</button>
          </div>

          {filterQuery.trim() && <div className="relative z-20 mb-5 rounded-[1.5rem] bg-[#fffaf0] p-3 text-[#203828] shadow-xl" role="listbox" aria-label="Kết quả tìm kiếm điểm đến">{searchResults.length ? searchResults.map((result) => <button key={result.id} type="button" onClick={() => selectPoint(result, 'filter')} className="block w-full rounded-[1rem] px-4 py-3 text-left transition hover:bg-[#f2efe7] focus:outline-none focus:ring-3 focus:ring-[#d9a441]" role="option"><span className="block font-black">{result.label} <span className="text-xs uppercase text-[#8a5a16]">{result.type === 'province' ? 'Tỉnh' : 'Điểm đến'}</span></span><span className="text-sm text-[#536656]">{result.summary}</span></button>) : <p className="px-4 py-3 text-sm font-bold text-[#8a5a16]">Không tìm thấy kết quả phù hợp. Hãy thử tên tỉnh hoặc điểm đến khác.</p>}</div>}

          <div className="relative min-h-[39rem] overflow-hidden rounded-[2rem] border border-white/12 bg-[#f7efe1] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] md:min-h-[50rem] xl:min-h-[56rem]">
            <div className="absolute left-5 top-5 z-20 flex max-w-[18rem] items-start gap-3 rounded-[1.35rem] bg-[#fffaf0]/92 p-4 text-[#203828] shadow-[0_16px_40px_rgba(45,58,42,0.14)] backdrop-blur-xl"><LocateFixed className="mt-1 text-[#8a5a16]" size={22} /><div><p className="text-sm font-black">{selectedPoint ? selectedPoint.provinceName : 'Chưa chọn tỉnh'}</p><p className="mt-1 text-xs font-semibold leading-5 text-[#536656]">{selectedPoint ? 'Tỉnh đang được chọn và điều khiển hướng đã sẵn sàng.' : 'Di chuột để xem trước; click hoặc tìm kiếm để chọn.'}</p></div></div>
            <div className="absolute bottom-5 right-5 z-30 grid grid-cols-3 gap-2 rounded-[1.4rem] bg-[#203828]/90 p-3 shadow-2xl backdrop-blur" aria-label="Điều hướng bản đồ">{navButtons.map(({ direction, label, icon }, index) => <button key={direction} type="button" onClick={() => panMap(direction)} disabled={!selectedPoint} aria-label={label} className={`map-direction-button ${lastBoundary === direction ? 'is-boundary' : ''} ${index === 0 ? 'col-start-2' : index === 3 ? 'col-start-2' : ''}`}>{icon}</button>)}</div>
            <div ref={mapStageRef} className="explore-map-stage absolute inset-0 grid touch-pan-y place-items-center"><div ref={mapRef} className="explore-vietnam-map h-[48rem] w-[48rem] max-w-none md:h-[64rem] md:w-[64rem]" style={{ transform: toCssTransform(transform) }} dangerouslySetInnerHTML={{ __html: vietnamMap }} /></div>
          </div>
        </div>

        <aside className="rounded-[2.4rem] bg-[#fffaf0] p-5 shadow-[0_35px_100px_rgba(45,58,42,0.12)] md:rounded-[3rem] md:p-7">
          {activeRegion ? <><div className="mb-7 rounded-[2rem] bg-[#f2efe7] p-6 md:p-7"><div className="mb-4 flex items-center gap-3 text-[#8a5a16]"><Compass size={24} /><span className="text-sm font-black uppercase tracking-[0.18em]">{activeRegion.eyebrow}</span></div><h2 className="text-pretty font-serif text-4xl font-black leading-none tracking-[-0.045em] md:text-5xl">{activeRegion.title}</h2><p className="mt-5 leading-7 text-[#536656]">{activeRegion.copy}</p></div><div className="grid gap-5">{activeRegion.packages.map((tour) => <article key={tour.title} className="group overflow-hidden rounded-[1.8rem] bg-white shadow-[0_18px_55px_rgba(45,58,42,0.14)]"><div className="grid gap-0 sm:grid-cols-[10rem_minmax(0,1fr)]"><div className="relative h-56 overflow-hidden sm:h-full"><img src={tour.image} alt={`Hình ảnh ${tour.title}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute left-4 top-4 rounded-full bg-[#fffaf0]/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#203828] backdrop-blur">{tour.category}</div></div><div className="p-6"><div className="mb-4 flex items-start justify-between gap-4"><h3 className="text-pretty text-2xl font-black leading-tight tracking-tight text-[#203828]">{tour.title}</h3><span className="tabular-nums shrink-0 rounded-full bg-[#203828] px-3 py-1 text-sm font-bold text-[#fffaf0]">{tour.price}</span></div><p className="text-pretty text-sm leading-6 text-[#536656]">{tour.copy}</p><div className="mt-5 flex items-center justify-between gap-3 border-t border-[#d9cfbd] pt-4 text-sm font-bold text-[#536656]"><span>{tour.duration} · {tour.pace}</span><a href="mailto:tours@gialaieco.example" className="inline-flex items-center gap-2 font-bold text-[#8a5a16] transition hover:gap-3 focus:outline-none focus:ring-2 focus:ring-[#d9a441] focus:ring-offset-4 focus:ring-offset-[#f2efe7]">Tìm hiểu <ArrowRight size={16} /></a></div></div></div></article>)}</div></> : <div className="grid min-h-[36rem] place-items-center rounded-[2rem] bg-[#f2efe7] p-8 text-center md:min-h-[44rem]"><div className="max-w-sm"><MapPinned className="mx-auto mb-6 text-[#8a5a16]" size={44} /><p className="mb-4 font-semibold italic text-[#8a5a16]">chưa chọn vùng</p><h2 className="font-serif text-4xl font-black leading-none tracking-[-0.045em] md:text-6xl">Click vào bản đồ để mở tour.</h2><p className="mt-5 leading-7 text-[#536656]">Không có tỉnh nào được chọn sẵn. Hãy hover để xem trước hoặc dùng bộ lọc để tìm điểm đến.</p></div></div>}
        </aside>
      </section>
    </main>
  );
}
