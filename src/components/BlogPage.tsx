import { ArrowRight, ArrowUpRight, BookOpenText, MapPin, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import BackHomeButton from './BackHomeButton';
import { blogStories } from '../data/blog';

type BlogPageProps = {
  onBackHome: () => void;
  onExplore: () => void;
};

const fluidEase = 'ease-[cubic-bezier(0.32,0.72,0,1)]';
const revealDelay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties;

export default function BlogPage({ onBackHome, onExplore }: BlogPageProps) {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [expandedStory, setExpandedStory] = useState<string | null>(null);
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)'));
    if (els.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    setExpandedStory(null);
  }, [activeCategory]);

  const categories = useMemo(() => ['Tất cả', ...Array.from(new Set(blogStories.map((story) => story.category)))], []);
  const activeStories = useMemo(() => blogStories.filter((story) => activeCategory === 'Tất cả' || story.category === activeCategory), [activeCategory]);
  const activeFeatured = activeStories[0] ?? blogStories[0];
  const remainingStories = activeStories.filter((story) => story.id !== activeFeatured.id);
  const visibleSideStories = remainingStories.slice(0, 2);
  const archiveStories = remainingStories.slice(2);

  return (
    <main id="main-content" className="min-h-[100dvh] overflow-hidden bg-[#f7f5eb] pt-28 text-[#14251c] md:pt-36">
      <section className="relative px-4 pb-24 md:px-8 md:pb-32">
        <div aria-hidden="true" className="absolute -right-40 top-6 h-80 w-80 rounded-full bg-[#d7c08b]/24 blur-3xl" />
        <div aria-hidden="true" className="absolute -left-28 top-72 h-72 w-72 rounded-full bg-[#7b9a81]/18 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <BackHomeButton onClick={onBackHome} />

          <header className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div className="max-w-4xl">
              <p className="reveal inline-flex items-center gap-2 rounded-full bg-[#173d2b] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#f7f5eb]" style={revealDelay(80)}><BookOpenText size={12} strokeWidth={1.5} /> Nhật ký hành trình</p>
              <h1 className="reveal mt-6 font-serif text-balance text-5xl font-black leading-[0.88] tracking-[-0.06em] text-[#173d2b] md:text-7xl lg:text-8xl" style={revealDelay(150)}>Những điều còn ở lại sau một chuyến đi.</h1>
            </div>
            <p className="reveal max-w-sm text-pretty text-base leading-7 text-[#536656] lg:pb-2" style={revealDelay(240)}>Các câu chuyện nhỏ từ những hành trình Gia Lai Eco đã đi qua — rừng, hồ, nông trại, nhà rông và những người đã gặp trên đường.</p>
          </header>

          <div className="reveal mt-16 grid gap-4 border-y border-[#173d2b]/10 py-5 sm:grid-cols-3" style={revealDelay(300)}>
            <Metric value="26" label="chuyến đi đã hoàn thành" />
            <Metric value="08" label="người địa phương đồng hành" />
            <Metric value="01" label="nhịp đi chậm, luôn giữ lại" />
          </div>
        </div>
      </section>

      <section className="bg-[#edf2e9] px-4 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8a5a16]">Trang mở đầu</p>
              <h2 className="mt-3 text-balance text-4xl font-black tracking-[-0.055em] text-[#14251c] md:text-5xl">Một chuyến đi, nhìn từ bên trong.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#536656]">Mỗi ghi chép được lưu lại sau khi đoàn đã về: ít vội, nhiều chi tiết, và luôn có tiếng nói của nơi chốn.</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <article className="reveal group lg:col-span-8" style={revealDelay(80)}>
              <div className="rounded-[2.2rem] bg-[#173d2b]/9 p-1.5 ring-1 ring-[#173d2b]/10">
                <div className="overflow-hidden rounded-[calc(2.2rem-0.375rem)] bg-[#173d2b] text-[#f7f5eb] shadow-[inset_0_1px_1px_rgba(255,255,255,0.16)]">
                  <div className="grid min-h-full md:grid-cols-[1.18fr_0.82fr]">
                    <div className="relative min-h-[22rem] overflow-hidden md:min-h-[34rem]">
                      <img src={activeFeatured.image} alt={`Cảnh sắc ${activeFeatured.location} trong câu chuyện ${activeFeatured.title}`} className={`h-full w-full object-cover transition-transform duration-1000 ${fluidEase} group-hover:scale-[1.045]`} fetchPriority="high" decoding="async" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#102218]/48 via-transparent to-transparent" />
                      <p className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-[#f7f5eb]/92 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#173d2b]"><MapPin size={12} strokeWidth={1.6} /> {activeFeatured.location}</p>
                    </div>
                    <div className="flex flex-col p-7 md:p-9">
                      <div className="flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#d7c08b]"><span>{activeFeatured.category}</span><span>{activeFeatured.date}</span></div>
                      <h3 className="mt-8 font-serif text-4xl font-black leading-[0.98] tracking-[-0.05em] md:text-5xl">{activeFeatured.title}</h3>
                      <p className="mt-6 text-pretty text-sm leading-7 text-[#f7f5eb]/72">{activeFeatured.excerpt}</p>
                      <p className="mt-6 text-xs font-bold text-[#d7c08b]">{activeFeatured.highlight} · {activeFeatured.readTime}</p>
                      <button type="button" onClick={() => setExpandedStory(expandedStory === activeFeatured.id ? null : activeFeatured.id)} aria-expanded={expandedStory === activeFeatured.id} className={`group/button mt-auto inline-flex w-fit items-center gap-3 pt-10 font-black text-[#f7f5eb] transition-opacity duration-500 ${fluidEase} hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#d7c08b] focus:ring-offset-4 focus:ring-offset-[#173d2b]`}>
                        {expandedStory === activeFeatured.id ? 'Thu gọn ghi chép' : 'Mở ghi chép'}
                        <span className={`grid h-9 w-9 place-items-center rounded-full bg-[#f7f5eb]/12 transition-transform duration-700 ${fluidEase} group-hover/button:translate-x-1 group-hover/button:-translate-y-[1px]`}><ArrowUpRight size={16} strokeWidth={1.5} /></span>
                      </button>
                      {expandedStory === activeFeatured.id && <p className="mt-5 border-t border-white/15 pt-5 text-sm leading-7 text-[#f7f5eb]/84">Đây là phần mở đầu của nhật ký. Các câu chuyện đầy đủ sẽ được bổ sung khi thư viện hành trình phát triển.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <div className="grid gap-6 lg:col-span-4">
              {visibleSideStories.map((story, index) => <article key={story.id} className="reveal group" style={revealDelay(150 + index * 100)}>
                <div className={`rounded-[1.8rem] bg-[#f7f5eb]/70 p-1.5 ring-1 ring-[#173d2b]/8 transition-transform duration-700 ${fluidEase} group-hover:-translate-y-1`}>
                  <div className="flex h-full overflow-hidden rounded-[calc(1.8rem-0.375rem)] bg-[#f7f5eb] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] sm:min-h-[14rem] lg:block">
                    <img src={story.image} alt={`Cảnh sắc ${story.location}`} className={`h-36 w-32 shrink-0 object-cover transition-transform duration-700 ${fluidEase} group-hover:scale-[1.04] sm:h-auto sm:w-[42%] lg:h-40 lg:w-full`} loading="lazy" decoding="async" />
                    <div className="flex flex-1 flex-col p-5"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a5a16]">{story.category}</p><h3 className="mt-3 text-xl font-black leading-tight tracking-[-0.04em] text-[#14251c]">{story.title}</h3><p className="mt-auto pt-5 text-xs font-bold text-[#536656]">{story.date} · {story.readTime}</p></div>
                  </div>
                </div>
              </article>)}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="reveal flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl"><p className="inline-flex items-center gap-2 rounded-full bg-[#d7c08b]/35 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#735013]"><Sparkles size={12} strokeWidth={1.5} /> Thư viện hành trình</p><h2 className="mt-5 text-balance text-4xl font-black tracking-[-0.055em] text-[#14251c] md:text-6xl">Chuyện của đường đi.</h2></div>
            <div className="flex flex-wrap gap-2">{categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`rounded-full px-4 py-2.5 text-sm font-black transition-all duration-500 ${fluidEase} active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#c28a36]/25 ${activeCategory === category ? 'bg-[#173d2b] text-[#f7f5eb]' : 'bg-[#edf2e9] text-[#536656] hover:-translate-y-0.5 hover:text-[#173d2b]'}`}>{category}</button>)}</div>
          </div>

          {archiveStories.length ? <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-12">
            {archiveStories.map((story, index) => <article key={story.id} className={`reveal group ${index === 0 ? 'lg:col-span-7' : 'lg:col-span-5'}`} style={revealDelay(index * 90)}>
              <div className={`h-full rounded-[2rem] bg-[#edf2e9] p-1.5 ring-1 ring-[#173d2b]/8 transition-transform duration-700 ${fluidEase} group-hover:-translate-y-1.5`}>
                <div className="flex h-full flex-col overflow-hidden rounded-[calc(2rem-0.375rem)] bg-[#f7f5eb] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
                  <div className={`overflow-hidden ${index === 0 ? 'aspect-[1.65]' : 'aspect-[1.9]'}`}><img src={story.image} alt={`Cảnh sắc ${story.location}`} className={`h-full w-full object-cover transition-transform duration-1000 ${fluidEase} group-hover:scale-[1.05]`} loading="lazy" decoding="async" /></div>
                  <div className="flex flex-1 flex-col p-6 md:p-8"><div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#8a5a16]"><span>{story.category}</span><span>{story.date}</span></div><h3 className="mt-5 text-balance text-3xl font-black leading-[1.02] tracking-[-0.05em] text-[#14251c]">{story.title}</h3><p className="mt-4 text-pretty text-sm leading-6 text-[#536656]">{story.excerpt}</p><div className="mt-auto flex items-center justify-between gap-4 pt-8 text-xs font-bold text-[#536656]"><span>{story.location}</span><span>{story.readTime}</span></div></div>
                </div>
              </div>
            </article>)}
          </div> : <div className="reveal mt-14 rounded-[2rem] bg-[#edf2e9] p-8 text-center ring-1 ring-[#173d2b]/8"><p className="font-serif text-3xl font-black text-[#173d2b]">Ghi chép này đang được viết thêm.</p><button type="button" onClick={() => setActiveCategory('Tất cả')} className={`group mt-6 inline-flex items-center gap-3 rounded-full bg-[#173d2b] py-2 pl-5 pr-2 text-sm font-black text-[#f7f5eb] transition-all duration-700 ${fluidEase} active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#c28a36]/30`}>Xem tất cả <span className={`grid h-8 w-8 place-items-center rounded-full bg-white/12 transition-transform duration-700 ${fluidEase} group-hover:translate-x-1`}><ArrowRight size={14} strokeWidth={1.6} /></span></button></div>}
        </div>
      </section>

      <section className="bg-[#173d2b] px-4 py-24 text-[#f7f5eb] md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div className="reveal"><p className="inline-flex rounded-full bg-[#f7f5eb]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#d7c08b]">Đi tiếp cùng chúng tôi</p><h2 className="mt-6 max-w-3xl font-serif text-balance text-5xl font-black leading-[0.92] tracking-[-0.055em] md:text-7xl">Câu chuyện đẹp nhất vẫn là chuyến đi sắp tới.</h2></div>
          <div className="reveal rounded-[2rem] bg-[#f7f5eb]/9 p-1.5 ring-1 ring-white/12" style={revealDelay(120)}><div className="rounded-[calc(2rem-0.375rem)] bg-[#f7f5eb]/8 p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] md:p-8"><p className="text-pretty leading-7 text-[#f7f5eb]/76">Hãy chọn một cung đường. Phần còn lại, đội ngũ địa phương sẽ cùng bạn giữ nhịp thật vừa vặn.</p><button type="button" onClick={onExplore} className={`group mt-7 inline-flex items-center gap-4 rounded-full bg-[#d7c08b] py-3 pl-6 pr-3 font-black text-[#14251c] transition-all duration-700 ${fluidEase} hover:-translate-y-1 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#f7f5eb]/30`}>Khám phá hành trình <span className={`grid h-10 w-10 place-items-center rounded-full bg-[#14251c]/12 transition-transform duration-700 ${fluidEase} group-hover:translate-x-1 group-hover:-translate-y-[1px]`}><ArrowRight size={16} strokeWidth={1.6} /></span></button></div></div>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="flex items-baseline gap-3 sm:justify-center"><span className="font-serif text-4xl font-black tracking-[-0.06em] text-[#173d2b]">{value}</span><span className="max-w-28 text-[10px] font-black uppercase leading-4 tracking-[0.14em] text-[#536656]">{label}</span></div>;
}
