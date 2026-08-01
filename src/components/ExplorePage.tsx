import {
  ChevronDown,
  Compass,
  ImagePlus,
  Mic,
  Send,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import BackHomeButton from './BackHomeButton';
import { destinations as homeDestinations, partners } from '../data/homepage';
import { exploreRegions, type ExplorePackage } from '../data/explore';

type ExplorePageProps = { onBackHome: () => void };

type TourItem = ExplorePackage & {
  id: string;
  regionId: string;
  regionLabel: string;
  rating: number;
  reviews: number;
  location?: string;
};

type ChatRole = 'user' | 'assistant';
type ChatMessage = { id: string; role: ChatRole; text: string };

function ChatPortal({ children }: { children: ReactNode }) {
  return createPortal(<div className="explore-chat-portal">{children}</div>, document.body);
}
type FilterKey = 'category' | 'rating' | 'region' | 'duration' | 'pace' | 'price' | 'sort';
type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating';

const FILTER_LABELS: { key: FilterKey; label: string }[] = [
  { key: 'category', label: 'Danh mục' },
  { key: 'rating', label: 'Đánh giá' },
  { key: 'region', label: 'Vùng' },
  { key: 'duration', label: 'Thời lượng' },
  { key: 'pace', label: 'Nhịp độ' },
  { key: 'price', label: 'Giá' },
  { key: 'sort', label: 'Sắp xếp' },
];

const REGION_IMAGES: Record<string, string> = {
  'central-highlands': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=800',
  'northern-mountains': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
  'central-coast': 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800',
  'southern-delta': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
};

const SUGGESTED_PROMPTS = ['Hồ núi lửa', 'Trekking rừng', 'Cà phê cao nguyên', 'Làng nghề'];
const INITIAL_MESSAGES: ChatMessage[] = [{ id: 'a1', role: 'assistant', text: 'Xin chào. Mình là trợ lý hành trình Gia Lai Eco. Bạn muốn khám phá rừng, hồ núi lửa, cà phê hay làng nghề?' }];
const TOURS_PER_PAGE = 9;

const parsePrice = (price: string) => Number(price.replace(/[^0-9.]/g, '')) || 0;
const hashSeed = (value: string) => value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0);
const ratingFromId = (id: string) => Math.round((4.2 + (hashSeed(id) % 80) / 100) * 10) / 10;
const reviewsFromId = (id: string) => 12 + (hashSeed(id) % 220);

function buildCatalog(): TourItem[] {
  const fromRegions = exploreRegions.flatMap((region) => region.packages.map((pkg, index) => ({
    ...pkg,
    id: `${region.id}-${index}`,
    regionId: region.id,
    regionLabel: region.label,
    rating: ratingFromId(`${region.id}-${pkg.title}`),
    reviews: reviewsFromId(`${region.id}-${pkg.title}`),
  })));
  const fromHome = homeDestinations.map((dest, index) => ({
    id: `home-${index}`,
    title: dest.title,
    category: dest.category,
    duration: dest.duration,
    pace: dest.pace,
    price: dest.price,
    image: dest.image,
    copy: dest.copy,
    regionId: 'central-highlands',
    regionLabel: 'Tây Nguyên',
    location: dest.location,
    rating: ratingFromId(`home-${dest.title}`),
    reviews: reviewsFromId(`home-${dest.title}`),
  }));
  const seen = new Set<string>();
  return [...fromHome, ...fromRegions].filter((item) => {
    const key = item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function replyForPrompt(prompt: string): string {
  const q = prompt.toLowerCase();
  if (q.includes('hồ') || q.includes('biển hồ') || q.includes('núi lửa')) return 'Gợi ý: Bình minh trên Biển Hồ T’Nưng và cung đường núi lửa Chư Đăng Ya. Nhịp rất dễ, hợp buổi sớm và chụp ảnh.';
  if (q.includes('rừng') || q.includes('trekking') || q.includes('kon ka')) return 'Gợi ý: Đi bộ giữa rừng Kon Ka Kinh, 3 đến 4 giờ dưới tán cổ thụ, có điểm picnic bên suối.';
  if (q.includes('cà phê') || q.includes('ca phe') || q.includes('coffee')) return 'Gợi ý: Một ngày cùng cà phê Pleiku, hái quả, xem rang thủ công và nếm Robusta theo cách người địa phương.';
  if (q.includes('làng') || q.includes('jrai') || q.includes('nghề')) return 'Gợi ý: Thăm làng dệt Jrai, gặp nghệ nhân và tìm hiểu hoa văn bên nhà rông.';
  if (q.includes('gia đình') || q.includes('dễ') || q.includes('chậm')) return 'Cho nhịp chậm hoặc gia đình: Biển Hồ T’Nưng, thác Phú Cường và cà phê Pleiku.';
  return 'Bạn có thể lọc theo vùng, thời lượng hoặc nhịp độ. Nói rõ rừng, hồ, cà phê hoặc làng nghề để mình gợi ý.';
}

function parseDuration(duration: string) {
  if (duration.includes('ngày')) return duration.includes('2') ? 'long' : 'day';
  const hours = Number(duration.match(/\d+/)?.[0] ?? 0);
  return hours <= 4 ? 'short' : 'day';
}

export default function ExplorePage({ onBackHome }: ExplorePageProps) {
  const catalog = useMemo(() => buildCatalog(), []);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedPace, setSelectedPace] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => Array.from(new Set(catalog.map((item) => item.category))).sort(), [catalog]);
  const filtered = useMemo(() => {
    let list = catalog.filter((item) => {
      if (selectedRegion !== 'all' && item.regionId !== selectedRegion) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedDuration !== 'all' && parseDuration(item.duration) !== selectedDuration) return false;
      if (selectedPace !== 'all' && item.pace !== selectedPace) return false;
      if (item.rating < minRating) return false;
      return true;
    });
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [catalog, minRating, selectedCategory, selectedDuration, selectedPace, selectedRegion, sortBy]);

  const totalPages = Math.ceil(filtered.length / TOURS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const paginatedTours = filtered.slice((activePage - 1) * TOURS_PER_PAGE, activePage * TOURS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [minRating, selectedCategory, selectedDuration, selectedPace, selectedRegion, sortBy]);

  const regionCards = useMemo(() => exploreRegions.map((region) => ({
    ...region,
    image: REGION_IMAGES[region.id] ?? region.packages[0]?.image,
    count: catalog.filter((item) => item.regionId === region.id).length,
    rating: ratingFromId(region.id),
  })), [catalog]);

  const resetFilters = () => {
    setSelectedRegion('all');
    setSelectedCategory('all');
    setSelectedDuration('all');
    setSelectedPace('all');
    setMinRating(0);
    setSortBy('featured');
    setCurrentPage(1);
    setOpenFilter(null);
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((previous) => [...previous, { id: `u-${Date.now()}`, role: 'user', text: trimmed }, { id: `a-${Date.now() + 1}`, role: 'assistant', text: replyForPrompt(trimmed) }]);
    setDraft('');
    window.setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const filterSummary = (key: FilterKey) => {
    if (key === 'category') return selectedCategory === 'all' ? 'Danh mục' : selectedCategory;
    if (key === 'rating') return minRating ? `${minRating}+ sao` : 'Đánh giá';
    if (key === 'region') return selectedRegion === 'all' ? 'Vùng' : exploreRegions.find((region) => region.id === selectedRegion)?.label ?? 'Vùng';
    if (key === 'duration') return selectedDuration === 'all' ? 'Thời lượng' : selectedDuration === 'short' ? 'Dưới nửa ngày' : selectedDuration === 'day' ? 'Một ngày' : 'Nhiều ngày';
    if (key === 'pace') return selectedPace === 'all' ? 'Nhịp độ' : selectedPace;
    if (key === 'price') return sortBy === 'price-asc' ? 'Giá thấp' : sortBy === 'price-desc' ? 'Giá cao' : 'Giá';
    if (sortBy === 'rating') return 'Đánh giá cao';
    return 'Sắp xếp';
  };

  const activeFilter = (key: FilterKey) => openFilter === key || (key === 'category' && selectedCategory !== 'all') || (key === 'rating' && minRating > 0) || (key === 'region' && selectedRegion !== 'all') || (key === 'duration' && selectedDuration !== 'all') || (key === 'pace' && selectedPace !== 'all') || (key === 'price' && sortBy.startsWith('price')) || (key === 'sort' && sortBy !== 'featured');

  return (
    <main id="main-content" className="min-h-screen bg-[#f2efe7] pt-28 text-[#203828] md:pt-32">
      <div className="mx-auto max-w-[96rem] px-4 pb-12 md:px-8 md:pb-20">
        <header className="grid gap-8 pb-10 md:grid-cols-[1fr_0.7fr] md:items-end md:pb-14">
          <div>
            <BackHomeButton onClick={onBackHome} />
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#8a5a16]">Đi chậm, chọn kỹ</p>
            <h1 className="mt-3 max-w-3xl text-balance text-5xl font-black leading-[0.94] tracking-[-0.065em] md:text-7xl">Tìm chuyến đi hợp nhịp của bạn.</h1>
          </div>
          <p className="max-w-sm text-pretty text-base leading-7 text-[#536656] md:justify-self-end">Khám phá những cung đường có người địa phương dẫn lối, từ cao nguyên Gia Lai đến nhiều vùng đất khác của Việt Nam.</p>
        </header>

        <div className="relative z-20 flex flex-wrap gap-2 border-y border-[#203828]/12 py-4">
          {FILTER_LABELS.map(({ key, label }) => (
            <div key={key} className="relative">
              <button type="button" onClick={() => setOpenFilter((current) => current === key ? null : key)} className={`inline-flex max-w-[13rem] items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#d9a441]/50 ${activeFilter(key) ? 'border-[#203828] bg-[#203828] text-[#fffaf0]' : 'border-[#d9cfbd] bg-[#fffaf0] text-[#203828] hover:border-[#203828]/50'}`}>
                <span className="truncate">{filterSummary(key)}</span><ChevronDown size={14} className={`shrink-0 transition ${openFilter === key ? 'rotate-180' : ''}`} />
              </button>
              {openFilter === key && <FilterMenu filter={key} categories={categories} selectedCategory={selectedCategory} selectedRegion={selectedRegion} selectedDuration={selectedDuration} selectedPace={selectedPace} minRating={minRating} sortBy={sortBy} setSelectedCategory={(value) => { setSelectedCategory(value); setOpenFilter(null); }} setSelectedRegion={(value) => { setSelectedRegion(value); setOpenFilter(null); }} setSelectedDuration={(value) => { setSelectedDuration(value); setOpenFilter(null); }} setSelectedPace={(value) => { setSelectedPace(value); setOpenFilter(null); }} setMinRating={(value) => { setMinRating(value); setOpenFilter(null); }} setSortBy={(value) => { setSortBy(value); setOpenFilter(null); }} />}
            </div>
          ))}
          <button type="button" onClick={resetFilters} className="ml-auto px-2 py-2 text-sm font-bold text-[#536656] underline decoration-[#d9a441] underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#d9a441]">Đặt lại</button>
        </div>

        <div className={`explore-chat-layout mt-8 grid gap-10 ${chatOpen ? 'explore-chat-layout--open' : ''}`}>
          <div>
            <section aria-labelledby="regions-title">
              <div className="flex items-end justify-between gap-4"><div><h2 id="regions-title" className="text-3xl font-black tracking-[-0.04em] md:text-4xl">Chọn vùng để bắt đầu</h2><p className="mt-2 text-sm leading-6 text-[#536656]">Mỗi vùng có một nhịp riêng.</p></div><span className="text-sm font-bold text-[#8a5a16]">{filtered.length} trải nghiệm</span></div>
              <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {regionCards.map((region) => <button key={region.id} type="button" onClick={() => setSelectedRegion(selectedRegion === region.id ? 'all' : region.id)} className={`group overflow-hidden rounded-2xl border text-left transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#d9a441] ${selectedRegion === region.id ? 'border-[#203828] ring-2 ring-[#203828]/15' : 'border-[#203828]/10 bg-[#fffaf0]'}`}><div className="aspect-[1.35] overflow-hidden bg-[#d9cfbd]"><img src={region.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" /></div><div className="p-3"><span className="block truncate text-sm font-black">{region.label}</span><span className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#536656]"><Star size={11} className="fill-[#d9a441] text-[#d9a441]" /> {region.rating.toFixed(1)} <span className="text-[#9aa396]">{region.count} gói</span></span></div></button>)}
              </div>
            </section>

            <section aria-labelledby="results-title" className="mt-14">
              <div className="flex items-end justify-between gap-4"><h2 id="results-title" className="text-3xl font-black tracking-[-0.04em] md:text-4xl">Danh sách chuyến đi phổ biến</h2><span className="hidden text-sm text-[#536656] sm:block">Lọc theo sở thích, không theo lịch cố định</span></div>
              {filtered.length === 0 ? <EmptyState onReset={resetFilters} /> : <>
                <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-4">
                  {paginatedTours.map((item, index) => <article key={item.id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#203828]/10 bg-[#fffaf0] transition duration-500 sm:rounded-[1.5rem] sm:hover:-translate-y-1 sm:hover:shadow-[0_24px_60px_rgba(32,56,40,0.13)]"><div className="aspect-[1.1] overflow-hidden bg-[#d9cfbd] sm:aspect-[1.25]"><img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-700 sm:group-hover:scale-105" loading={index < 3 ? 'eager' : 'lazy'} /></div><div className="flex flex-1 flex-col p-2.5 sm:p-5 md:p-6"><p className="truncate text-[8px] font-bold uppercase leading-tight tracking-[0.08em] text-[#8a5a16] sm:text-xs sm:tracking-[0.12em]">{item.category}</p><h3 className="mt-1 line-clamp-2 text-[11px] font-black leading-[1.15] tracking-[-0.03em] sm:mt-3 sm:text-2xl sm:leading-tight sm:tracking-[-0.04em]">{item.title}</h3><p className="mt-3 hidden line-clamp-3 text-sm leading-6 text-[#536656] sm:block">{item.copy}</p><div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 text-[10px] font-bold sm:gap-x-3 sm:gap-y-2 sm:pt-6 sm:text-sm"><span className="hidden items-center gap-1 sm:flex"><Star size={14} className="fill-[#d9a441] text-[#d9a441]" /> {item.rating.toFixed(1)} <span className="font-medium text-[#9aa396]">({item.reviews})</span></span><span className="hidden text-[#9aa396] sm:inline">{item.duration}</span><span className="truncate text-[#8a5a16]">{item.price}</span></div></div></article>)}
                </div>
                {totalPages > 1 && <nav aria-label="Phân trang chuyến đi" className="mt-6 flex flex-wrap items-center justify-center gap-1 sm:mt-8 sm:gap-2"><button type="button" onClick={() => setCurrentPage(activePage - 1)} disabled={activePage === 1} className="rounded-full border border-[#d9cfbd] bg-[#fffaf0] px-2.5 py-2 text-xs font-bold text-[#203828] transition hover:border-[#203828]/50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#d9a441]/50 sm:px-4 sm:text-sm"><span className="sm:hidden">Trước</span><span className="hidden sm:inline">Trang trước</span></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button key={page} type="button" onClick={() => setCurrentPage(page)} aria-current={page === activePage ? 'page' : undefined} className={`grid h-9 w-9 place-items-center rounded-full border text-xs font-black transition focus:outline-none focus:ring-2 focus:ring-[#d9a441]/50 sm:h-10 sm:w-10 sm:text-sm ${page === activePage ? 'border-[#203828] bg-[#203828] text-[#fffaf0]' : 'border-[#d9cfbd] bg-[#fffaf0] text-[#203828] hover:border-[#203828]/50'}`}>{page}</button>)}<button type="button" onClick={() => setCurrentPage(activePage + 1)} disabled={activePage === totalPages} className="rounded-full border border-[#d9cfbd] bg-[#fffaf0] px-2.5 py-2 text-xs font-bold text-[#203828] transition hover:border-[#203828]/50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#d9a441]/50 sm:px-4 sm:text-sm"><span className="sm:hidden">Sau</span><span className="hidden sm:inline">Trang sau</span></button></nav>}
              </>}
            </section>

            {/* <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-[#203828]/12 pt-5 text-sm font-semibold text-[#536656]"><span>Đồng hành cùng</span>{partners.slice(0, 5).map((partner) => <span key={partner.name} className="inline-flex items-center gap-2 rounded-full bg-[#fffaf0] px-3 py-1.5"><span className="font-black text-[#8a5a16]">{partner.mark}</span>{partner.name}</span>)}</div> */}
          </div>

          <ChatPortal>{chatOpen ? <Assistant messages={messages} draft={draft} setDraft={setDraft} sendMessage={sendMessage} onSubmit={(event) => { event.preventDefault(); sendMessage(draft); }} onClose={() => setChatOpen(false)} chatEndRef={chatEndRef} /> : <button type="button" onClick={() => setChatOpen(true)} className="explore-chat-trigger fixed bottom-6 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#203828] px-5 py-3 text-sm font-black text-[#fffaf0] shadow-[0_18px_50px_rgba(32,56,40,0.35)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#d9a441]/40"><Sparkles size={16} className="text-[#d9a441]" /> Mở trợ lý</button>}</ChatPortal>
        </div>
      </div>
    </main>
  );
}

function FilterMenu({ filter, categories, selectedCategory, selectedRegion, selectedDuration, selectedPace, minRating, sortBy, setSelectedCategory, setSelectedRegion, setSelectedDuration, setSelectedPace, setMinRating, setSortBy }: { filter: FilterKey; categories: string[]; selectedCategory: string; selectedRegion: string; selectedDuration: string; selectedPace: string; minRating: number; sortBy: SortKey; setSelectedCategory: (value: string) => void; setSelectedRegion: (value: string) => void; setSelectedDuration: (value: string) => void; setSelectedPace: (value: string) => void; setMinRating: (value: number) => void; setSortBy: (value: SortKey) => void }) {
  const option = (label: string, active: boolean, onClick: () => void) => <button type="button" onClick={onClick} className={`block w-full rounded-xl px-3 py-2 text-left text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#d9a441] ${active ? 'bg-[#203828] text-[#fffaf0]' : 'text-[#203828] hover:bg-[#f2efe7]'}`}>{label}</button>;
  const options = filter === 'category' ? [['Tất cả', 'all'], ...categories.map((category) => [category, category])] : filter === 'region' ? [['Mọi vùng', 'all'], ...exploreRegions.map((region) => [region.label, region.id])] : filter === 'duration' ? [['Mọi thời lượng', 'all'], ['Dưới nửa ngày', 'short'], ['Một ngày', 'day'], ['Nhiều ngày', 'long']] : filter === 'pace' ? [['Mọi nhịp độ', 'all'], ...Array.from(new Set(exploreRegions.flatMap((region) => region.packages.map((item) => item.pace))).values()).map((pace) => [pace, pace])] : filter === 'rating' ? [['Mọi đánh giá', '0'], ['4+ sao', '4'], ['4.5+ sao', '4.5']] : filter === 'price' ? [['Giá thấp đến cao', 'price-asc'], ['Giá cao đến thấp', 'price-desc']] : [['Nổi bật', 'featured'], ['Đánh giá cao', 'rating'], ['Giá tăng dần', 'price-asc'], ['Giá giảm dần', 'price-desc']];
  return <div className="absolute left-0 top-[calc(100%+0.5rem)] min-w-[13rem] rounded-2xl border border-[#e4e0d6] bg-[#fffaf0] p-2 shadow-[0_20px_50px_rgba(45,58,42,0.16)]">{options.map(([label, value]) => { const active = filter === 'category' ? selectedCategory === value : filter === 'region' ? selectedRegion === value : filter === 'duration' ? selectedDuration === value : filter === 'pace' ? selectedPace === value : filter === 'rating' ? minRating === Number(value) : sortBy === value; const onClick = () => { if (filter === 'category') setSelectedCategory(value); else if (filter === 'region') setSelectedRegion(value); else if (filter === 'duration') setSelectedDuration(value); else if (filter === 'pace') setSelectedPace(value); else if (filter === 'rating') setMinRating(Number(value)); else setSortBy(value as SortKey); }; return <span key={`${filter}-${value}`}>{option(label, active, onClick)}</span>; })}</div>;
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return <div className="mt-6 border border-dashed border-[#d9cfbd] bg-[#fffaf0]/60 px-6 py-16 text-center"><Compass className="mx-auto mb-4 text-[#8a5a16]" size={32} /><p className="font-black">Chưa có trải nghiệm khớp bộ lọc</p><p className="mt-2 text-sm text-[#536656]">Bỏ bớt một lựa chọn để xem thêm hành trình.</p><button type="button" onClick={onReset} className="mt-5 rounded-full bg-[#203828] px-5 py-2.5 text-sm font-black text-[#fffaf0] focus:outline-none focus:ring-4 focus:ring-[#d9a441]/35">Xóa bộ lọc</button></div>;
}

function Assistant({ messages, draft, setDraft, sendMessage, onSubmit, onClose, chatEndRef }: { messages: ChatMessage[]; draft: string; setDraft: (value: string) => void; sendMessage: (text: string) => void; onSubmit: (event: FormEvent) => void; onClose: () => void; chatEndRef: RefObject<HTMLDivElement | null> }) {
  return <aside className="flex max-h-[calc(100dvh-9rem)] flex-col border-l border-[#203828]/12 bg-[#fffaf0] xl:sticky xl:top-28"><div className="relative border-b border-[#203828]/10 px-5 py-6"><button type="button" onClick={onClose} aria-label="Đóng trợ lý" className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-[#536656] hover:bg-[#f2efe7] focus:outline-none focus:ring-2 focus:ring-[#d9a441]"><X size={16} /></button><div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#203828] text-[#d9a441]"><Sparkles size={20} /></div><h2 className="text-xl font-black">Trợ lý hành trình</h2><p className="mt-1 text-sm font-semibold text-[#536656]">Gợi ý theo sở thích và nhịp đi.</p></div><div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">{messages.map((message) => message.role === 'assistant' ? <div key={message.id} className="flex gap-2.5"><span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#203828] text-[#d9a441]"><Sparkles size={13} /></span><div className="rounded-2xl rounded-tl-md bg-[#f2efe7] px-3.5 py-2.5 text-sm leading-6 text-[#3e5143]">{message.text}</div></div> : <div key={message.id} className="flex justify-end"><div className="max-w-[85%] rounded-2xl rounded-tr-md bg-[#203828] px-3.5 py-2.5 text-sm leading-6 text-[#fffaf0]">{message.text}</div></div>)}<div className="border-y border-[#203828]/10 py-4"><div className="flex items-start gap-3"><ImagePlus size={18} className="mt-1 shrink-0 text-[#8a5a16]" /><div><p className="text-sm font-black">Gợi ý theo hình ảnh</p><p className="mt-1 text-xs leading-5 text-[#536656]">Chọn một chủ đề để nhận gợi ý tương tự.</p></div></div><div className="mt-3 flex flex-wrap gap-1.5">{SUGGESTED_PROMPTS.map((prompt) => <button key={prompt} type="button" onClick={() => sendMessage(prompt)} className="rounded-full border border-[#ebe6dc] bg-[#f2efe7] px-2.5 py-1 text-[11px] font-bold text-[#536656] hover:border-[#d9a441] focus:outline-none focus:ring-2 focus:ring-[#d9a441]/40">{prompt}</button>)}</div></div><div ref={chatEndRef} /></div><form onSubmit={onSubmit} className="border-t border-[#203828]/10 p-3"><label className="flex items-center gap-2 rounded-full border border-[#e4e0d6] bg-white py-1.5 pl-4 pr-1.5 focus-within:ring-2 focus-within:ring-[#d9a441]/35"><span className="sr-only">Hỏi trợ lý</span><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Hỏi về chuyến đi..." className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#203828] outline-none placeholder:text-[#9aa396]" /><button type="button" aria-label="Ghi âm" className="grid h-9 w-9 place-items-center rounded-full text-[#536656] hover:bg-[#f2efe7] focus:outline-none focus:ring-2 focus:ring-[#d9a441]"><Mic size={16} /></button><button type="submit" aria-label="Gửi" className="grid h-9 w-9 place-items-center rounded-full bg-[#203828] text-[#fffaf0] hover:bg-[#2a4a34] focus:outline-none focus:ring-2 focus:ring-[#d9a441]"><Send size={15} /></button></label></form></aside>;
}
