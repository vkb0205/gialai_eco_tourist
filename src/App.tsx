/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useCallback, useEffect, useState, type CSSProperties } from 'react';
import { ArrowRight, ChevronDown, Globe, MapPinned, Star } from 'lucide-react';
import heroImage from './assets/bien_ho_2.jpeg_2K_202607252001.jpeg';
import glecoLogo from './assets/gleco_logo.png';
import Navbar, { type PageName } from './components/Navbar';
import PageNavigationButton from './components/PageNavigationButton';
import HorizontalScrollCarousel from './components/HorizontalScrollCarousel';
import { blogStories } from './data/blog';
import { destinations, testimonials } from './data/homepage';

const ExplorePage = lazy(() => import('./components/ExplorePage'));
const BlogPage = lazy(() => import('./components/BlogPage'));

const fluidEase = 'ease-[cubic-bezier(0.32,0.72,0,1)]';
const revealDelay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties;
const consultHref = 'mailto:tours@gialaieco.example';

// const tripNotes = [
//   { icon: Trees, value: 'Rừng', label: 'đường mòn, thác nước, bóng cây Kon Ka Kinh' },
//   { icon: Coffee, value: 'Cà phê', label: 'nông trại nhỏ, mẻ rang mới, câu chuyện địa phương' },
//   { icon: Route, value: 'Hồ', label: 'sớm mai Biển Hồ, triền thông, nhịp đi bộ nhẹ' },
// ];

const planningSteps = [
  ['Chọn vùng đi', 'Pleiku hợp buổi sớm bên hồ. Kbang hợp cho ngày vào rừng và thác.'],
  ['Chọn nhịp độ', 'Đi nhẹ để chụp ảnh, hoặc đi đủ cung với lịch khởi hành sớm.'],
  ['Gặp chủ nhà', 'Chúng tôi xác nhận người đón tiếp trước khi gợi ý làng, nông trại hay xưởng rang.'],
  ['Nhận lịch trình', 'Bạn có giờ đón, lưu ý trang phục, tiền mặt và phương án dự phòng trước chuyến đi.'],
];

function startViewTransition(update: () => void) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };

  if (typeof doc.startViewTransition === 'function') {
    return doc.startViewTransition(update);
  }

  update();
  return undefined;
}

export default function App() {
  const [activePage, setActivePage] = useState<PageName>('home');
  const [isOverHero, setIsOverHero] = useState(true);

  useEffect(() => {
    if (activePage !== 'home') {
      setIsOverHero(false);
      return;
    }

    const hero = document.getElementById('hero');

    if (!hero || typeof IntersectionObserver === 'undefined') {
      setIsOverHero(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setIsOverHero(entry.isIntersecting), {
      rootMargin: '-72px 0px 0px 0px',
      threshold: 0,
    });

    observer.observe(hero);

    return () => observer.disconnect();
  }, [activePage]);

  useEffect(() => {
    if (activePage !== 'home') return;

    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)'));
    if (els.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [activePage]);

  const handleNavigate = useCallback((page: PageName, href?: string) => {
    if (href && page === 'home') {
      setActivePage('home');
      window.requestAnimationFrame(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }

    if (page === activePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    startViewTransition(() => {
      setActivePage(page);
      window.scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' });
    });
  }, [activePage]);

  const handleHeroContinue = useCallback(() => {
    document.querySelector('#tour-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="min-h-screen bg-[#eef3e8] text-[#14251c] font-sans selection:bg-[#c28a36]/25">
      <a href="#main-content" className="skip-link">Đến nội dung chính</a>

      <Navbar isOverHero={isOverHero} activePage={activePage} onNavigate={handleNavigate} />

      {activePage === 'explore' ? (
        <div key="explore" className="page-shell explore-page-shell">
          <Suspense fallback={<div className="explore-loading" role="status">Đang tải trải nghiệm...</div>}>
            <ExplorePage onBackHome={() => handleNavigate('home')} />
          </Suspense>
        </div>
      ) : activePage === 'blog' ? (
        <div key="blog" className="page-shell explore-page-shell">
          <Suspense fallback={<div className="explore-loading" role="status">Đang tải nhật ký...</div>}>
            <BlogPage onBackHome={() => handleNavigate('home')} onExplore={() => handleNavigate('explore')} />
          </Suspense>
        </div>
      ) : (
        <div key="home" className="page-shell explore-page-shell">
          <main id="main-content">
            <section id="hero" className="eco-hero relative min-h-[100dvh] overflow-hidden bg-[#07170f] text-[#f7f5eb]">
              <img
                src={heroImage}
                alt="Biển Hồ T’Nưng và rừng xanh nhìn từ trên cao"
                className="absolute inset-0 h-full w-full object-cover opacity-88"
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(214,155,69,0.24),transparent_28%),linear-gradient(90deg,rgba(5,18,12,0.92)_0%,rgba(9,24,17,0.68)_45%,rgba(9,24,17,0.18)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#eef3e8] via-[#eef3e8]/55 to-transparent" />
              <div aria-hidden="true" className="absolute left-5 top-28 hidden max-w-[10rem] rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/80 backdrop-blur-xl md:block">Local-first travel</div>

              <div className="relative z-10 mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-10 px-5 pb-20 pt-24 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:pt-24">
                <div className="max-w-3xl text-left">
                  <p className="reveal mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#d7c08b] backdrop-blur-xl">Du lịch sinh thái Gia Lai</p>
                  <h1 className="reveal text-balance font-serif text-5xl font-black leading-[0.86] tracking-[-0.075em] md:text-7xl lg:text-8xl">
                    Đi chậm giữa cao nguyên xanh.
                  </h1>
                  <p style={revealDelay(140)} className="reveal mt-6 max-w-xl text-pretty text-base leading-7 text-[#f7f5eb]/86 md:text-xl md:leading-8">
                    Những hành trình nhỏ quanh Biển Hồ, rừng, cà phê và làng bản — thiết kế bởi người địa phương để bạn thấy Gia Lai sâu hơn.
                  </p>
                  <a
                    href="#"
                    onClick={(event) => { event.preventDefault(); handleNavigate('explore'); }}
                    style={revealDelay(260)}
                    className={`reveal group mt-8 inline-flex items-center gap-4 rounded-full bg-[#f7f5eb] py-3 pl-7 pr-3 font-black text-[#14251c] shadow-[0_24px_70px_rgba(0,0,0,0.26)] transition-all duration-700 ${fluidEase} hover:-translate-y-1 hover:bg-white active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#f7f5eb]/45`}
                  >
                    Khám phá
                    <span className={`grid h-11 w-11 place-items-center rounded-full bg-[#c28a36] text-[#14251c] transition-transform duration-700 ${fluidEase} group-hover:translate-x-1 group-hover:-translate-y-[1px]`}>
                      <ArrowRight size={18} strokeWidth={1.75} />
                    </span>
                  </a>
                  <div style={revealDelay(340)} className="reveal mt-10 grid max-w-xl grid-cols-3 gap-3">
                    {[['26+', 'chuyến đi'], ['08', 'chủ nhà'], ['4.8', 'đánh giá']].map(([value, label]) => (
                      <div key={label} className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-xl">
                        <p className="font-serif text-3xl font-black tracking-[-0.06em] text-[#d7c08b]">{value}</p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/68">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleHeroContinue}
                  style={revealDelay(420)}
                  className={`reveal hero-swipe-cue group absolute bottom-7 left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#f7f5eb]/22 bg-[#07170f]/22 px-3.5 py-2 text-[#f7f5eb] shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-700 ${fluidEase} hover:border-[#f7f5eb]/42 hover:bg-[#f7f5eb]/12 focus:outline-none focus:ring-4 focus:ring-[#f7f5eb]/35 active:scale-[0.98] md:bottom-9`}
                  aria-label="Vuốt xuống để khám phá nội dung tiếp theo"
                >
                  <span className="flex items-center gap-3 text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#f7f5eb]/88">
                    Vuốt xuống
                    <span className="hero-swipe-cue__icon grid h-9 w-9 place-items-center rounded-full bg-[#f7f5eb] text-[#14251c] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-1">
                      <ChevronDown size={18} strokeWidth={1.75} />
                    </span>
                  </span>
                </button>

              </div>
            </section>

            <section id="tour-details" className="deferred-section eco-section-light bg-[#f7f5eb] py-24 md:py-32">
              <div className="mx-auto max-w-7xl px-5 md:px-8">
                <div className="reveal max-w-3xl">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#7b6a2d]">Nhật ký hành trình</p>
                  <h2 className="mt-4 text-balance text-4xl font-black leading-[0.98] tracking-[-0.055em] text-[#14251c] md:text-6xl">Những cung đường đáng ở lại lâu hơn.</h2>
                  <p className="mt-5 max-w-2xl text-pretty leading-7 text-[#536656]">Những lát cắt từ rừng, hồ, làng nghề và nông trại — nơi hành trình được kể bằng nhịp đi chậm hơn.</p>
                </div>

                <HorizontalScrollCarousel className="mt-14 lg:grid-cols-12" desktopColumns={3} ariaLabel="Nhật ký hành trình">
                  {blogStories.slice(0, 5).map((story, i) => (
                    <article
                      key={story.id}
                      style={revealDelay((i % 3) * 90)}
                      className={`reveal group overflow-hidden rounded-[2rem] bg-[#edf2e9] ring-1 ring-[#14251c]/8 transition-all duration-700 ${fluidEase} hover:-translate-y-1.5 hover:shadow-[0_30px_80px_rgba(20,37,28,0.14)] ${i === 0 ? 'lg:col-span-7' : i === 1 ? 'lg:col-span-5' : 'lg:col-span-4'}`}
                    >
                      <div className={`${i === 0 ? 'md:grid md:grid-cols-[1.15fr_0.85fr]' : ''} h-full`}>
                        <img src={story.image} alt={`Khoảnh khắc ${story.title}`} className={`${i === 0 ? 'h-80 md:h-full' : 'h-64'} w-full object-cover transition-transform duration-700 ${fluidEase} group-hover:scale-[1.04]`} loading="lazy" decoding="async" />
                        <div className="flex h-full flex-col p-6 md:p-7">
                          <p className="text-sm font-bold text-[#7b6a2d]">{story.category}</p>
                          <h3 className="mt-4 text-pretty text-2xl font-black leading-tight tracking-[-0.035em] text-[#14251c] md:text-3xl">{story.title}</h3>
                          <p className="mt-4 flex-1 text-pretty text-sm leading-6 text-[#536656]">{story.excerpt}</p>
                          <div className="mt-6 flex items-center justify-between gap-3 text-sm font-bold text-[#536656]">
                            <span>{story.date} · {story.readTime}</span>
                            <button type="button" onClick={() => handleNavigate('blog')} className="font-black text-[#173d2b] underline decoration-[#c28a36]/45 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#c28a36]">Đọc tiếp</button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </HorizontalScrollCarousel>

                <div className="mt-10">
                  <PageNavigationButton onClick={() => handleNavigate('blog')}>Xem nhật ký hành trình</PageNavigationButton>
                </div>
              </div>
            </section>

            <section id="featured-tours" className="deferred-section eco-section-mist bg-[#edf2e9] py-24 md:py-32">
              <div className="mx-auto max-w-7xl px-5 md:px-8">
                <div className="reveal flex max-w-4xl flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[#7b6a2d]">Chọn lọc cho bạn</p>
                    <h2 className="mt-4 text-balance text-4xl font-black leading-[0.98] tracking-[-0.055em] text-[#14251c] md:text-6xl">Hành trình nổi bật.</h2>
                  </div>
                  <p className="max-w-md text-pretty leading-7 text-[#536656]">Ba trải nghiệm mở đầu cho những ngày muốn ở gần rừng, hồ và nhịp sống cao nguyên.</p>
                </div>

                <HorizontalScrollCarousel className="mt-14" desktopColumns={3} ariaLabel="Hành trình nổi bật">
                  {destinations.slice(0, 3).map((dest, i) => (
                    <article key={dest.title} style={revealDelay(i * 90)} className={`reveal group overflow-hidden rounded-[2rem] bg-[#f7f5eb] ring-1 ring-[#14251c]/8 transition-all duration-700 ${fluidEase} hover:-translate-y-1.5 hover:shadow-[0_30px_80px_rgba(20,37,28,0.14)]`}>
                      <div className="overflow-hidden">
                        <img src={dest.image} alt={`Cảnh sắc ${dest.title}`} className={`h-64 w-full object-cover transition-transform duration-700 ${fluidEase} group-hover:scale-[1.04]`} loading="lazy" decoding="async" />
                      </div>
                      <div className="p-6 md:p-7">
                        <div className="flex items-center justify-between gap-4 text-sm font-bold text-[#7b6a2d]">
                          <span>{dest.category}</span>
                          <span>{dest.duration}</span>
                        </div>
                        <h3 className="mt-4 text-pretty text-2xl font-black leading-tight tracking-[-0.035em] text-[#14251c]">{dest.title}</h3>
                        <p className="mt-4 text-pretty text-sm leading-6 text-[#536656]">{dest.copy}</p>
                        <div className="mt-6 flex items-center justify-between gap-3 text-sm font-bold text-[#536656]">
                          <span>{dest.location} · {dest.pace}</span>
                          <button type="button" onClick={() => handleNavigate('explore')} className="font-black text-[#173d2b] underline decoration-[#c28a36]/45 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#c28a36]">Khám phá</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </HorizontalScrollCarousel>

                <div className="mt-10">
                  <PageNavigationButton onClick={() => handleNavigate('explore')}>Khám phá mọi hành trình</PageNavigationButton>
                </div>
              </div>
            </section>

            <section id="travel-plan" className="deferred-section eco-section-mist bg-[#edf2e9] py-24 md:py-32">
              <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <div className="reveal rounded-[2rem] bg-[#173d2b] p-7 text-[#f7f5eb] shadow-[0_30px_90px_rgba(23,61,43,0.22)] md:p-9">
                  <MapPinned className="mb-10 text-[#c28a36]" size={34} strokeWidth={1.5} />
                  <h2 className="text-4xl font-black leading-none tracking-[-0.05em] md:text-6xl">Bắt đầu từ nhịp đi của bạn.</h2>
                  <p className="mt-6 text-pretty leading-7 text-[#f7f5eb]/76">Kể cho chúng tôi số ngày, nhóm đi và điều bạn tò mò. Đội ngũ địa phương sẽ gợi ý hành trình vừa sức.</p>
                  <a href={consultHref} className={`group mt-8 inline-flex items-center gap-3 rounded-full bg-[#c28a36] py-2 pl-6 pr-2 font-black text-[#14251c] transition-all duration-700 ${fluidEase} hover:bg-[#d69b45] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#f7f5eb]/35`}>
                    Nhận tư vấn
                    <span className={`grid h-10 w-10 place-items-center rounded-full bg-[#14251c]/15 transition-transform duration-700 ${fluidEase} group-hover:translate-x-1 group-hover:-translate-y-[1px]`}><ArrowRight size={16} strokeWidth={1.75} /></span>
                  </a>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {planningSteps.map(([title, copy], i) => (
                    <article key={title} style={revealDelay(i * 80)} className="reveal rounded-[1.5rem] bg-[#f7f5eb] p-6 ring-1 ring-[#14251c]/8">
                      <h3 className="text-2xl font-black tracking-tight text-[#14251c]">{title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#536656]">{copy}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* <section className="deferred-section bg-[#f7f5eb] py-24 md:py-32">
              <div className="mx-auto max-w-7xl px-5 md:px-8">
                <div className="grid gap-5 md:grid-cols-3">
                  {tripNotes.map((item, i) => (
                    <article key={item.value} style={revealDelay(i * 80)} className="reveal rounded-[1.5rem] bg-[#edf2e9] p-6 ring-1 ring-[#14251c]/8">
                      <item.icon className="mb-8 text-[#c28a36]" size={26} strokeWidth={1.5} />
                      <h2 className="text-4xl font-black tracking-[-0.05em] text-[#14251c]">{item.value}</h2>
                      <p className="mt-3 text-sm leading-6 text-[#536656]">{item.label}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section> */}

            <section id="testimonials" className="deferred-section eco-section-mist bg-[#edf2e9] py-24 md:py-32">
              <div className="mx-auto max-w-7xl px-5 md:px-8">
                <div className="reveal max-w-3xl">
                  <h2 className="text-balance text-4xl font-black leading-[0.98] tracking-[-0.055em] text-[#14251c] md:text-6xl">Du khách nhớ điều gì sau chuyến đi.</h2>
                  <p className="mt-5 max-w-2xl text-pretty leading-7 text-[#536656]">Những lời kể ngắn từ người đã đi qua hồ, rừng và nông trại cùng hướng dẫn viên địa phương.</p>
                </div>
                <HorizontalScrollCarousel className="mt-14" desktopColumns={3} ariaLabel="Đánh giá từ du khách">
                  {testimonials.map((test, i) => (
                    <article key={test.name} style={revealDelay(i * 90)} className="reveal rounded-[2rem] bg-[#f7f5eb] p-6 ring-1 ring-[#14251c]/8">
                      <div className="mb-7 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img src={test.image} alt={`Chân dung ${test.name}`} className="h-14 w-14 rounded-2xl object-cover" loading="lazy" decoding="async" />
                          <div>
                            <h3 className="font-black text-[#14251c]">{test.name}</h3>
                            <p className="text-sm font-medium text-[#536656]">{test.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-[#edf2e9] px-3 py-1">
                          <Star size={16} className="fill-[#c28a36] text-[#c28a36]" />
                          <span className="tabular-nums font-black text-[#14251c]">{test.rating}</span>
                        </div>
                      </div>
                      <p className="text-pretty text-lg leading-8 text-[#2d4035]">“{test.quote}”</p>
                    </article>
                  ))}
                </HorizontalScrollCarousel>
              </div>
            </section>
          </main>

          <footer className="relative z-10 bg-[#173d2b] py-14 text-[#f7f5eb] md:py-16">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 md:flex-row md:items-center md:justify-between md:px-8">
              <div className="flex items-center gap-4">
                <img src={glecoLogo} alt="Gia Lai Eco Tourist Co., Ltd." className="h-16 w-auto object-contain" />
                <p className="text-sm font-medium text-[#f7f5eb]/68">© 2026 Gia Lai Eco Tourist. Du lịch chậm, gần văn hóa địa phương.</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-[#f7f5eb]/78">
                <a href={consultHref} className={`group inline-flex items-center gap-3 rounded-full bg-[#c28a36] py-2 pl-5 pr-2 font-black text-[#14251c] transition-all duration-700 ${fluidEase} hover:bg-[#d69b45] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#f7f5eb]/40`}>
                  Nhận tư vấn
                  <span className={`grid h-9 w-9 place-items-center rounded-full bg-[#14251c]/15 transition-transform duration-700 ${fluidEase} group-hover:translate-x-1 group-hover:-translate-y-[1px]`}><Globe size={15} strokeWidth={1.75} /></span>
                </a>
                <a href="mailto:privacy@gialaieco.example?subject=Chinh%20sach%20bao%20mat" className={`transition-colors duration-500 ${fluidEase} hover:text-[#f7f5eb] focus:outline-none focus:ring-2 focus:ring-[#c28a36]`}>Chính sách bảo mật</a>
                <a href="mailto:legal@gialaieco.example?subject=Dieu%20khoan" className={`transition-colors duration-500 ${fluidEase} hover:text-[#f7f5eb] focus:outline-none focus:ring-2 focus:ring-[#c28a36]`}>Điều khoản</a>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
