/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Coffee, Globe, MapPinned, Play, Route, Star } from 'lucide-react';
import heroImage from '../assets/bien_ho_2.jpeg_2K_202607252001.jpeg';
import glecoLogo from '../assets/gleco_logo.png';
import glecoLogoOrg from '../assets/gleco_logo_org.png';

const navLinks = [
  { label: 'Khám phá', href: '#tour-details' },
  { label: 'Lên kế hoạch', href: '#travel-plan' },
  { label: 'Trải nghiệm', href: '#guides' },
  { label: 'Cảm nhận du khách', href: '#testimonials' },
];

const destinations = [
  {
    title: 'Đi bộ giữa rừng Kon Ka Kinh',
    location: 'Huyện Kbang',
    category: 'Rừng nguyên sinh',
    duration: '3–4 giờ',
    pace: 'Dễ',
    price: '$42.00',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80',
    copy: 'Cung đường mát rượi dưới những tán cây cổ thụ, tiếng chim rừng và một điểm dừng picnic bên dòng suối trong.',
  },
  {
    title: 'Bình minh trên Biển Hồ T’Nưng',
    location: 'Cao nguyên Pleiku',
    category: 'Hồ núi lửa',
    duration: '2–3 giờ',
    pace: 'Rất dễ',
    price: '$28.50',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80',
    copy: 'Khởi hành trước nắng sớm, băng qua những triền thông rồi thưởng thức cà phê tại quán nhỏ ven hồ của người địa phương.',
  },
  {
    title: 'Cung đường núi lửa Chư Đăng Ya',
    location: 'Huyện Chư Păh',
    category: 'Núi lửa',
    duration: '4 giờ',
    pace: 'Vừa phải',
    price: '$31.75',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80',
    copy: 'Bước trên nền đất đỏ mềm, đi qua những cánh đồng hoa theo mùa và phóng tầm mắt về cao nguyên bazan.',
  },
  {
    title: 'Thăm làng dệt Jrai',
    location: 'Huyện Ia Grai',
    category: 'Làng nghề Jrai',
    duration: '2 giờ',
    pace: 'Trải nghiệm',
    price: '$24.00',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80',
    copy: 'Gặp gỡ nghệ nhân, tìm hiểu ý nghĩa hoa văn và lắng nghe những câu chuyện bình dị bên nhà rông.',
  },
  {
    title: 'Vòng cung thác Phú Cường',
    location: 'Huyện Chư Sê',
    category: 'Thác nước',
    duration: '3–4 giờ',
    pace: 'Dễ',
    price: '$36.20',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80',
    copy: 'Sương mát, những bậc đá phủ dương xỉ và hành trình thong thả qua vườn tiêu, rừng cao su.',
  },
  {
    title: 'Một ngày cùng cà phê Pleiku',
    location: 'Nông trại ven thành phố',
    category: 'Cà phê cao nguyên',
    duration: '3 giờ',
    pace: 'Thưởng thức',
    price: '$19.80',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80',
    copy: 'Hái quả chín đúng mùa, xem mẻ rang thủ công và nếm Robusta theo ba cách pha của người địa phương.',
  },
];

const testimonials = [
  {
    name: 'Maya Santoso',
    role: 'Du khách gia đình từ Bandung',
    rating: 4.7,
    image: 'https://i.pravatar.cc/150?u=gialai-maya',
    quote: 'Lịch trình rất thư thả, không hề vội vã. Hướng dẫn viên kể về rừng tự nhiên và đầy cuốn hút.',
  },
  {
    name: 'Duc Anh Tran',
    role: 'Nhiếp ảnh gia từ Đà Nẵng',
    rating: 4.9,
    image: 'https://i.pravatar.cc/150?u=gialai-duc-anh',
    quote: 'Họ biết chính xác nơi ánh sáng chạm mặt hồ T’Nưng và dẫn chúng tôi đến những góc ngắm yên tĩnh hơn.',
  },
  {
    name: 'Elena Park',
    role: 'Du khách tự do từ Busan',
    rating: 4.8,
    image: 'https://i.pravatar.cc/150?u=gialai-elena',
    quote: 'Tôi rất trân trọng các chi tiết thiết thực: điểm tiếp nước, giờ đón rõ ràng và tư vấn chân thành về độ khó của cung đường.',
  },
];

const smallCards = [
  { title: 'Nông trại cà phê', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80' },
  { title: 'Cung đường bazan', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80' },
  { title: 'Sớm mai bên hồ', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80' },
  { title: 'Nghề thủ công làng', image: 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?auto=format&fit=crop&q=80' },
];

const partners = [
  { name: 'K-Tech', mark: '✦' },
  { name: 'travel GiaLai', mark: '◆' },
  { name: 'ELARIVER', mark: '▰' },
  { name: 'LeoNEX', mark: '◖' },
  { name: 'cloogle tours', mark: '✤' },
  { name: 'tahlex', mark: '◒' },
  { name: 'Surx', mark: '✧' },
];

export default function App() {
  const [isOverHero, setIsOverHero] = useState(true);

  useEffect(() => {
    const hero = document.getElementById('hero');

    if (!hero) {
      return;
    }

    const updateNavbarSurface = () => {
      const { bottom } = hero.getBoundingClientRect();
      setIsOverHero(bottom > 96);
    };

    updateNavbarSurface();
    window.addEventListener('scroll', updateNavbarSurface, { passive: true });
    window.addEventListener('resize', updateNavbarSurface);

    return () => {
      window.removeEventListener('scroll', updateNavbarSurface);
      window.removeEventListener('resize', updateNavbarSurface);
    };
  }, []);

  const navbarRowSurfaceClass = isOverHero
    ? 'bg-transparent'
    : 'bg-[#8FA28A]/60 shadow-[0_18px_70px_rgba(45,58,42,0.12)] ring-1 ring-[#203828]/7 backdrop-blur-2xl';
  const navSurfaceClass = isOverHero
    ? 'border-white/18 bg-white/10 text-[#fffaf0] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_18px_70px_rgba(3,12,18,0.18)]'
    : 'border-[#203828]/10 bg-[#fffaf0]/92 text-[#203828] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_18px_70px_rgba(45,58,42,0.14)]';
  const inactiveNavLinkClass = isOverHero
    ? 'hover:bg-white/14 hover:text-white'
    : 'hover:bg-[#203828]/8 hover:text-[#203828]';
  const activeNavLinkClass = isOverHero
    ? 'bg-[#fffaf0] text-[#1e2528] shadow-[0_10px_26px_rgba(255,255,255,0.16)]'
    : 'bg-[#203828] text-[#fffaf0] shadow-[0_10px_26px_rgba(32,56,40,0.14)]';
  const ctaSurfaceClass = isOverHero
    ? 'border-white/18 bg-white/10 text-[#fffaf0] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_18px_60px_rgba(3,12,18,0.20)] hover:bg-white/18 focus:ring-white/40'
    : 'border-[#203828]/10 bg-[#fffaf0]/94 text-[#203828] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_18px_60px_rgba(45,58,42,0.12)] hover:bg-white focus:ring-[#d9a441]/35';
  const ctaIconClass = isOverHero
    ? 'bg-[#fffaf0] text-[#1e2528]'
    : 'bg-[#203828] text-[#fffaf0]';

  return (
    <div className="min-h-screen bg-[#f2efe7] text-[#203828] font-sans selection:bg-[#d9a441]/30">
      <a href="#main-content" className="skip-link">Đến nội dung chính</a>

      <div id="hero" className="relative w-full min-h-[100dvh] overflow-hidden rounded-b-[2rem] bg-[#17261d] md:rounded-b-[3rem]">
        <img
          src={heroImage}
          alt="Góc nhìn từ trên cao của Biển Hồ T’Nưng và rừng xanh Gia Lai"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,20,0.42)_0%,rgba(11,17,20,0.18)_33%,rgba(11,17,20,0.34)_64%,rgba(11,17,20,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,250,240,0.20),transparent_28%),radial-gradient(circle_at_14%_88%,rgba(255,250,240,0.12),transparent_22%)]" />

        <header className={`fixed left-0 right-0 top-0 z-30 grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:px-8 lg:px-14 ${navbarRowSurfaceClass}`}>
          <a href="#" aria-label="Trang chủ Gia Lai Eco Tourist" className="relative inline-flex h-20 w-44 items-center focus:outline-none focus:ring-4 focus:ring-[#fffaf0]/50 md:h-24 md:w-52">
            <img
              src={glecoLogo}
              alt="Gia Lai Eco Tourist Co., Ltd."
              className={`absolute inset-0 h-full w-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOverHero ? 'opacity-100' : 'opacity-0'}`}
            />
            <img
              src={glecoLogoOrg}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOverHero ? 'opacity-0' : 'opacity-100'}`}
            />
          </a>

          <nav aria-label="Điều hướng chính" className={`hidden items-center gap-2 rounded-full border p-2 text-sm font-semibold backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] lg:flex ${navSurfaceClass}`}>
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                className={`rounded-full px-6 py-3 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none focus:ring-2 ${index === 0 ? activeNavLinkClass : inactiveNavLinkClass} ${isOverHero ? 'focus:ring-white/70' : 'focus:ring-[#d9a441]/45'}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a href="mailto:tours@gialaieco.example" className={`ml-auto inline-flex items-center gap-3 rounded-full border py-2 pl-5 pr-2 backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-4 ${ctaSurfaceClass}`}>
            <span className="hidden text-sm font-bold md:inline">Đặt hành trình</span>
            <span className={`grid h-11 w-11 place-items-center rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${ctaIconClass}`}><ArrowUpRight size={22} strokeWidth={2.4} /></span>
          </a>
        </header>

        <main id="main-content" className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-5 pb-44 pt-28 text-center md:px-10 lg:px-16">
          <span className="mb-7 inline-flex rounded-full border border-white/18 bg-white/12 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f5d889] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_18px_55px_rgba(3,12,18,0.18)] backdrop-blur-2xl md:text-sm">
            Du lịch chậm từ cao nguyên Việt Nam
          </span>
          <h1 className="max-w-7xl text-balance text-[clamp(4.4rem,11vw,10.5rem)] font-light leading-[0.86] tracking-[-0.075em] text-[#fffaf0] drop-shadow-[0_18px_70px_rgba(0,0,0,0.36)]">
            <span className="block font-serif italic font-black tracking-[-0.055em]">Đi chậm hơn.<br />Nhớ lâu hơn.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-base leading-7 text-[#fffaf0]/90 drop-shadow md:text-lg">Từ Biển Hồ lộng gió đến những cánh rừng nguyên sinh, hãy kết nối với thiên nhiên, văn hóa bản địa và những người thuộc từng con đường nơi đây.</p>
          <a href="#tour-details" className="group mt-10 inline-flex items-center justify-center gap-5 rounded-full border border-white/22 bg-white/18 px-9 py-4 text-lg font-black text-[#fffaf0] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_24px_70px_rgba(3,12,18,0.25)] backdrop-blur-2xl transition duration-200 hover:-translate-y-1 hover:bg-white/24 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-white/45 md:px-12 md:py-5 md:text-xl">
            Khám phá điểm đến <ArrowRight size={26} className="transition group-hover:translate-x-1" />
          </a>
        </main>

        <button className="absolute bottom-8 left-5 z-20 hidden items-center gap-4 rounded-full border border-white/20 bg-white/18 py-3 pl-3 pr-8 text-[#fffaf0] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_22px_65px_rgba(3,12,18,0.27)] backdrop-blur-2xl transition duration-200 hover:bg-white/24 focus:outline-none focus:ring-4 focus:ring-white/40 md:flex lg:left-14">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#fffaf0]/82 text-[#1e2528]"><Play size={22} className="ml-1 fill-current" /></span>
          <span className="text-base font-bold">Xem câu chuyện hành trình</span>
        </button>

        <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 md:flex">
          <span className="h-1.5 w-16 rounded-full bg-[#fffaf0]" />
          <span className="h-1.5 w-16 rounded-full bg-[#fffaf0]/28" />
          <span className="h-1.5 w-16 rounded-full bg-[#fffaf0]/28" />
        </div>

        <div className="absolute bottom-0 right-0 z-20 hidden max-w-4xl translate-x-8 gap-5 pb-8 lg:flex">
          {smallCards.map((card, idx) => (
            <article key={card.title} className={`group relative h-52 w-44 overflow-hidden rounded-[1.65rem] border border-white/25 shadow-[0_24px_70px_rgba(3,12,18,0.38)] ${idx > 1 ? 'hidden xl:block' : ''}`}>
              <img src={card.image} alt={`${card.title} tại Gia Lai`} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12191d]/88 via-[#12191d]/14 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-[#fffaf0]">
                <span className="max-w-24 text-lg font-black leading-tight tracking-tight">{card.title}</span>
                <span className="text-sm font-bold text-[#fffaf0]/82">Gia Lai</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <section aria-labelledby="trusted-partners-title" className="bg-[#f4f4f2] py-16 text-[#1f2d26] md:py-20">
        <div className="mx-auto max-w-[92rem] px-5 md:px-8">
          <div className="mb-14 grid grid-cols-[1fr_auto_1fr] items-center gap-5">
            <span className="h-px bg-[#d9d9d5]" />
            <div className="text-center">
              <p className="mb-2 text-base font-semibold text-[#6d716d]">Cùng đồng hành</p>
              <h2 id="trusted-partners-title" className="text-4xl font-black tracking-[-0.045em] text-[#111813] md:text-5xl">Đối tác tin cậy</h2>
            </div>
            <span className="h-px bg-[#d9d9d5]" />
          </div>

          <div className="relative">
            <button aria-label="Đối tác trước" className="absolute left-0 top-1/2 z-10 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-white text-[#38443d] shadow-[0_14px_34px_rgba(22,30,25,0.13)] transition hover:-translate-x-0.5 hover:bg-[#fffaf0] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#d9a441]/35 md:h-16 md:w-16">
              <ChevronLeft size={30} strokeWidth={2.3} />
            </button>

            <div className="mx-14 overflow-hidden md:mx-20">
              <div className="flex min-w-max items-center justify-between gap-12 md:gap-16 lg:gap-20">
                {partners.map((partner) => (
                  <div key={partner.name} className="flex min-w-fit items-center gap-3 text-[#2d3731]/58 grayscale transition duration-200 hover:text-[#203828] hover:grayscale-0">
                    <span className="grid h-12 w-12 place-items-center rounded-[1rem] text-4xl font-black leading-none text-[#2d3731]/42 md:h-14 md:w-14 md:text-5xl">{partner.mark}</span>
                    <span className="whitespace-nowrap text-3xl font-black tracking-[-0.06em] md:text-4xl">{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <button aria-label="Đối tác tiếp theo" className="absolute right-0 top-1/2 z-10 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-white text-[#38443d] shadow-[0_14px_34px_rgba(22,30,25,0.13)] transition hover:translate-x-0.5 hover:bg-[#fffaf0] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#d9a441]/35 md:h-16 md:w-16">
              <ChevronRight size={30} strokeWidth={2.3} />
            </button>
          </div>
        </div>
      </section>

      <section id="tour-details" className="bg-[#fffaf0] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-3 font-semibold italic text-[#8a5a16]">cùng người địa phương tạo nên hành trình</p>
              <h2 className="text-balance font-serif text-5xl font-black leading-none tracking-[-0.04em] text-[#203828] md:text-7xl">Khám phá Gia Lai theo nhịp điệu của bạn.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[{ icon: Route, value: '12', label: 'cung đường đã trải nghiệm' }, { icon: CalendarDays, value: '3.5h', label: 'thời lượng trung bình nửa ngày' }, { icon: Coffee, value: '8', label: 'điểm dừng do gia đình vận hành' }].map(item => (
                <div key={item.label} className="rounded-[1.5rem] bg-[#e8e0cf] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
                  <item.icon className="mb-5 text-[#8a5a16]" size={24} />
                  <div className="tabular-nums text-4xl font-black tracking-tight text-[#203828]">{item.value}</div>
                  <p className="mt-1 text-sm font-semibold text-[#536656]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="guides" className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest, i) => (
              <article key={dest.title} className={`group flex flex-col overflow-hidden rounded-[2rem] bg-[#f2efe7] shadow-[0_24px_70px_rgba(45,58,42,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(45,58,42,0.16)] ${i === 1 || i === 4 ? 'lg:translate-y-10' : ''}`}>
                <div className="relative h-64 overflow-hidden">
                  <img src={dest.image} alt={`Cảnh sắc ${dest.title}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute left-4 top-4 rounded-full bg-[#fffaf0]/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#203828] backdrop-blur">{dest.category}</div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h3 className="text-pretty text-2xl font-black leading-tight tracking-tight text-[#203828]">{dest.title}</h3>
                    <span className="tabular-nums rounded-full bg-[#203828] px-3 py-1 text-sm font-bold text-[#fffaf0]">{dest.price}</span>
                  </div>
                  <p className="mb-5 flex-1 text-pretty text-sm leading-6 text-[#536656]">{dest.copy}</p>
                  <div className="flex items-center justify-between gap-3 border-t border-[#d9cfbd] pt-4 text-sm font-bold text-[#536656]">
                    <span>{dest.duration} · {dest.pace}</span>
                    <a href="mailto:tours@gialaieco.example" className="inline-flex items-center gap-2 font-bold text-[#8a5a16] transition hover:gap-3 focus:outline-none focus:ring-2 focus:ring-[#d9a441] focus:ring-offset-4 focus:ring-offset-[#f2efe7]">Tìm hiểu <ArrowRight size={16} /></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="travel-plan" className="bg-[#f2efe7] py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="rounded-[2rem] bg-[#203828] p-8 text-[#fffaf0] shadow-[0_30px_90px_rgba(32,56,40,0.22)]">
            <MapPinned className="mb-10 text-[#d9a441]" size={34} />
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#d9a441]">Thiết kế cho riêng nhóm bạn</p>
            <h2 className="mt-4 font-serif text-5xl font-black leading-none tracking-[-0.04em]">Chưa biết bắt đầu từ đâu?</h2>
            <p className="mt-6 text-pretty leading-7 text-[#fffaf0]/76">Hãy cho chúng tôi biết bạn đi từ đâu, có bao nhiêu ngày và điều gì khiến bạn tò mò. Đội ngũ địa phương sẽ gợi ý một hành trình chỉn chu cho nhóm bạn, gia đình và khách du lịch tự do.</p>
            <a href="mailto:tours@gialaieco.example" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d9a441] px-5 py-3 font-black text-[#203828] transition hover:bg-[#e2b65d] focus:outline-none focus:ring-4 focus:ring-[#fffaf0]/35">Nhận tư vấn miễn phí <ArrowRight size={18} /></a>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {[['01', 'Chọn điểm dừng chân', 'Pleiku phù hợp cho buổi sớm bên hồ và nông trại cà phê; Kbang lý tưởng hơn cho những ngày vào rừng.'], ['02', 'Chọn nhịp độ', 'Bạn có thể chọn chuyến đi nhẹ nhàng, nhiều thời gian chụp ảnh hoặc cung đường đầy đủ với lịch khởi hành sớm.'], ['03', 'Gặp gỡ chủ nhà', 'Chúng tôi xác nhận người đón tiếp trước khi gợi ý lịch thăm làng, nông trại hay xưởng rang.'], ['04', 'Du lịch nhẹ nhàng', 'Bạn nhận được giờ đón, gợi ý trang phục, lưu ý tiền mặt và phương án dự phòng trước chuyến đi.']].map(([num, title, copy]) => (
              <article key={num} className="rounded-[1.5rem] bg-[#fffaf0] p-6 shadow-[0_18px_55px_rgba(45,58,42,0.08)] transition duration-200 hover:-translate-y-1">
                <span className="tabular-nums text-sm font-black tracking-[0.22em] text-[#8a5a16]">{num}</span>
                <h3 className="mt-5 text-2xl font-black tracking-tight text-[#203828]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#536656]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="bg-[#f2efe7] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-14 max-w-3xl">
            <p className="mb-3 font-semibold italic text-[#8a5a16]">cảm nhận của du khách</p>
            <h2 className="text-balance font-serif text-5xl font-black leading-none tracking-[-0.04em] text-[#203828] md:text-7xl">Điều còn đọng lại sau mỗi chặng đường</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map(test => (
              <article key={test.name} className="rounded-[2rem] bg-[#fffaf0] p-7 shadow-[0_24px_70px_rgba(45,58,42,0.10)]">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={test.image} alt={`Chân dung ${test.name}`} className="h-14 w-14 rounded-2xl object-cover" />
                    <div>
                      <h3 className="font-black text-[#203828]">{test.name}</h3>
                      <p className="text-sm font-medium text-[#536656]">{test.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#f2efe7] px-3 py-1">
                    <Star size={16} className="fill-[#d9a441] text-[#d9a441]" />
                    <span className="tabular-nums font-black text-[#203828]">{test.rating}</span>
                  </div>
                </div>
                <p className="text-pretty text-lg leading-8 text-[#3e5143]">“{test.quote}”</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 mt-[-2rem] rounded-t-[2rem] bg-[#203828] py-12 text-[#fffaf0] shadow-[0_-18px_70px_rgba(32,56,40,0.18)] md:rounded-t-[4rem]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-4">
            <img src={glecoLogo} alt="Gia Lai Eco Tourist Co., Ltd." className="h-20 w-auto object-contain" />
            <p className="text-sm font-medium text-[#fffaf0]/65">© 2026 Gia Lai Eco Tourist. Du lịch chậm, giàu bản sắc địa phương.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-[#fffaf0]/78">
            <a href="mailto:tours@gialaieco.example" className="inline-flex items-center gap-2 rounded-full bg-[#d9a441] px-5 py-3 font-black text-[#203828] transition hover:bg-[#e2b65d] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#fffaf0]/40"><Globe size={18} /> Liên hệ tư vấn</a>
            <a href="#" className="transition hover:text-[#fffaf0] focus:outline-none focus:ring-2 focus:ring-[#d9a441]">Chính sách bảo mật</a>
            <a href="#" className="transition hover:text-[#fffaf0] focus:outline-none focus:ring-2 focus:ring-[#d9a441]">Điều khoản</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

