/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import glecoLogo from '../assets/gleco_logo.png';
import glecoLogoOrg from '../assets/gleco_logo_org.png';
const navLinks = [
    { label: 'Trang chủ', page: 'home' as const },
    { label: 'Khám phá', page: 'explore' as const },
    { label: 'Nhật ký', page: 'blog' as const },
];

export type PageName = 'home' | 'explore' | 'blog';

type NavbarProps = {
    isOverHero: boolean;
    activePage: PageName;
    onNavigate: (page: PageName, href?: string) => void;
};

const fluidEase = 'ease-[cubic-bezier(0.32,0.72,0,1)]';

export default function Navbar({ isOverHero, activePage, onNavigate }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [menuOpen]);

    const light = isOverHero && !menuOpen;

    const islandClass = light
        ? 'border-white/15 bg-white/10 text-[#fffaf0] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_16px_50px_rgba(3,12,18,0.18)]'
        : 'border-[#203828]/10 bg-[#fffaf0]/85 text-[#203828] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_16px_50px_rgba(45,58,42,0.10)]';
    const inactiveNavLinkClass = light
        ? 'text-[#fffaf0]/85 hover:bg-white/15 hover:text-white'
        : 'text-[#203828]/75 hover:bg-[#203828]/8 hover:text-[#203828]';
    const activeNavLinkClass = light
        ? 'bg-[#fffaf0] text-[#1e2528]'
        : 'bg-[#203828] text-[#fffaf0]';

    return (
        <>
            <header className="site-navbar fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-4 pt-4 md:px-8 md:pt-6 lg:px-10">
                <a
                    href="#"
                    aria-label="Trang chủ Gia Lai Eco Tourist"
                    onClick={(event) => {
                        event.preventDefault();
                        setMenuOpen(false);
                        onNavigate('home');
                    }}
                    className={`relative inline-flex h-14 w-32 items-center overflow-hidden rounded-full border backdrop-blur-xl transition-all duration-700 ${fluidEase} focus:outline-none focus:ring-4 focus:ring-[#d9a441]/40 active:scale-[0.98] md:h-16 md:w-40 ${islandClass}`}
                >
                    <img
                        src={glecoLogo}
                        alt="Gia Lai Eco Tourist Co., Ltd."
                        className={`absolute inset-0 h-full w-full object-contain p-1.5 transition-opacity duration-500 ${light ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <img
                        src={glecoLogoOrg}
                        alt=""
                        aria-hidden="true"
                        className={`absolute inset-0 h-full w-full object-contain p-1.5 transition-opacity duration-500 ${light ? 'opacity-0' : 'opacity-100'}`}
                    />
                </a>

                <nav
                    aria-label="Điều hướng chính"
                    className={`hidden items-center gap-1 rounded-full border p-1.5 text-sm font-semibold backdrop-blur-xl transition-all duration-700 ${fluidEase} md:absolute md:left-1/2 md:flex md:-translate-x-1/2 ${islandClass}`}
                >
                    {navLinks.map((link) => {
                        const isActive = link.page === activePage;

                        return (
                            <a
                                key={link.label}
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault();
                                    onNavigate(link.page);
                                }}
                                className={`rounded-full px-5 py-2.5 transition-all duration-500 ${fluidEase} focus:outline-none focus:ring-2 ${isActive ? activeNavLinkClass : inactiveNavLinkClass} ${light ? 'focus:ring-white/70' : 'focus:ring-[#d9a441]/45'}`}
                            >
                                {link.label}
                            </a>
                        );
                    })}
                </nav>

                <button
                    type="button"
                    aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                    className={`relative grid h-14 w-14 place-items-center rounded-full border backdrop-blur-xl transition-all duration-700 ${fluidEase} focus:outline-none focus:ring-4 focus:ring-[#d9a441]/40 active:scale-95 md:hidden ${islandClass}`}
                >
                    <span className={`absolute h-[1.5px] w-5 rounded-full bg-current transition-all duration-500 ${fluidEase} ${menuOpen ? 'translate-y-0 rotate-45' : '-translate-y-[4px]'}`} />
                    <span className={`absolute h-[1.5px] w-5 rounded-full bg-current transition-all duration-500 ${fluidEase} ${menuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-[4px]'}`} />
                </button>
            </header>

            <div
                className={`fixed inset-0 z-20 flex flex-col items-center justify-center bg-[#f2efe7]/78 px-6 backdrop-blur-3xl transition-opacity duration-700 ${fluidEase} ${menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                aria-hidden={!menuOpen}
            >
                <span
                    className={`mb-10 inline-flex items-center gap-2 rounded-full border border-[#203828]/10 bg-[#fffaf0] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a5a16] transition-all duration-700 ${fluidEase} ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                >
                    <span className="h-1 w-1 rounded-full bg-[#d9a441]" />
                    Gia Lai Eco Tourist
                </span>
                {navLinks.map((link, i) => (
                    <a
                        key={link.label}
                        href="#"
                        tabIndex={menuOpen ? 0 : -1}
                        onClick={(event) => {
                            event.preventDefault();
                            setMenuOpen(false);
                            onNavigate(link.page);
                        }}
                        style={{ transitionDelay: menuOpen ? `${120 + i * 80}ms` : '0ms' }}
                        className={`mt-2 font-serif text-6xl font-black tracking-[-0.04em] transition-all duration-700 ${fluidEase} focus:outline-none sm:text-7xl ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} ${link.page === activePage ? 'italic text-[#8a5a16]' : 'text-[#203828] hover:italic hover:text-[#8a5a16]'}`}
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </>
    );
}
