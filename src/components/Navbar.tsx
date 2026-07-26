/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import glecoLogo from '../assets/gleco_logo.png';
import glecoLogoOrg from '../assets/gleco_logo_org.png';
import { navLinks } from '../data/homepage';

export type PageName = 'home' | 'explore';

type NavbarProps = {
    isOverHero: boolean;
    activePage: PageName;
    onNavigate: (page: PageName, href?: string) => void;
};

export default function Navbar({ isOverHero, activePage, onNavigate }: NavbarProps) {
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
    return (
        <header className={`fixed left-0 right-0 top-0 z-30 grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:px-8 lg:px-14 ${navbarRowSurfaceClass}`}>
            <a
                href="#"
                aria-label="Trang chủ Gia Lai Eco Tourist"
                onClick={(event) => {
                    event.preventDefault();
                    onNavigate('home');
                }}
                className="relative inline-flex h-20 w-44 items-center focus:outline-none focus:ring-4 focus:ring-[#fffaf0]/50 md:h-24 md:w-52"
            >
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
                {navLinks.map((link) => {
                    const isActive = link.page === activePage;

                    return (
                        <a
                            key={link.label}
                            href={link.href ?? '#'}
                            onClick={(event) => {
                                event.preventDefault();
                                onNavigate(link.page, link.href);
                            }}
                            className={`rounded-full px-6 py-3 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none focus:ring-2 ${isActive ? activeNavLinkClass : inactiveNavLinkClass} ${isOverHero ? 'focus:ring-white/70' : 'focus:ring-[#d9a441]/45'}`}
                        >
                            {link.label}
                        </a>
                    );
                })}
            </nav>

            <span aria-hidden="true" />
        </header>
    );
}
