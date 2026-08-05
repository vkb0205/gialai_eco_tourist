# Plan: Gialai Eco Tourist Website Redesign

## Context
Redesign the existing placeholder React app into a full multi-section eco-tourism website for "Gialai Eco Tourist" — a Gia Lai, Vietnam tour operator since 2012. The user provided 3 reference screenshots showing an elegant editorial Vietnamese eco-tourism aesthetic: dark hero overlaid with forest photography, bold serif display fonts, warm cream section backgrounds, deep forest-green accents, and generous whitespace.

The deliverable is a single-page React app with scroll-based sections (no routing needed). All content, images, and interactions should feel production-ready.

---

## Aesthetic

**Stance:** Archival-editorial. Bold serif headlines, clean humanist sans body text, earth-toned palette, photography-forward. Matches the reference screenshots closely.

**Fonts (Google Fonts):**
- Display: `Lora` (bold, editorial serif — matching the references)
- Body: `Inter` (clean, readable sans)

**Palette (CSS tokens in `src/index.css`):**
```
--background: #f5f0e8        (warm cream page ground)
--foreground: #1a1a14        (near-black text)
--card: #ffffff
--card-foreground: #1a1a14
--primary: #2d5a27           (deep forest green)
--primary-foreground: #f5f0e8
--secondary: #e8e0d0         (muted warm sand)
--secondary-foreground: #4a4035
--muted: #ede8dc
--muted-foreground: #7a6f60
--accent: #8b5e3c            (warm bark brown)
--accent-foreground: #f5f0e8
--border: #d4cbbf
--ring: #2d5a27
--radius: 4px
```

---

## File Changes

### `src/index.css`
- Add Google Fonts `@import` for Lora + Inter (before all other CSS)
- Add CSS custom property tokens
- Add global `font-family: 'Inter'` on body, `font-family: 'Lora'` for display headings via `.font-display` utility
- Hide scrollbars while keeping scroll functional

### `src/App.tsx`
Full replacement with the following sections (each as a named component in the same file or inline):

1. **`<Navbar>`** — sticky, transitions from transparent-on-dark-hero to cream-bg on scroll. Logo (leaf icon SVG + brand name), nav links (Tours, Destinations, About, Contact), CTA button "Book Now".

2. **`<Hero>`** — full-viewport section. Background: Unsplash photo of Vietnam green highlands (`photo-1603269414002`). Dark overlay gradient. Large bold Lora headline: *"Explore the wild heart of the Central Highlands"*. Subheading. Two CTAs: "View Tours" (primary green button) + "Contact Us" (outlined). Stats strip at bottom: 26+ Tours, 12 Years Experience, 4.8 Rating, 500+ Travelers.

3. **`<About>`** — two-column layout (text left, nature photo right). Story of local guides since 2012, licensed, sustainable. Certified badges row.

4. **`<TourPackages>`** — heading + filter tabs (All / Trekking / Camping / Kayaking / Village / Cultural / Land). 6 cards in a responsive 3-col grid. Each card: Unsplash image, badge (difficulty), title, duration, price, "Details →" button. Cards: 
   - Kon Ka Kinh Forest Trek (3 days, Moderate, from $89)
   - Biển Hồ Camping Night (2 days, Easy, from $65)
   - Ba Hồ Kayaking Adventure (1 day, Easy, from $45)
   - Bahnar Village Homestay (2 days, Easy, from $75)
   - Central Highlands Cultural Tour (4 days, Easy, from $120)
   - Kon Chư Răng Expedition (5 days, Hard, from $180)

5. **`<Destinations>`** — asymmetric mosaic grid of 5 Gia Lai destination cards: Biển Hồ (volcanic lake), Kon Ka Kinh (biosphere), Kon Chư Răng (nature reserve), Ia Grai Waterfalls, Bahnar Village. Large/small card mix. Hover reveals description overlay.

6. **`<WhyChooseUs>`** — centered heading + 6 feature icons in 3×2 grid: Safety First, Local Expert Guides, Small Groups (max 12), Eco-Friendly Practices, Fully Licensed, 100% Customizable. SVG icons inline.

7. **`<Gallery>`** — masonry-style 3-column CSS grid with 9 photos of varying heights. Short captions on hover. Uses mix of Unsplash photos collected above.

8. **`<ContactBooking>`** — two-column: left = booking form (name, email, phone, preferred dates, number of people, tour interest select, message textarea, submit button); right = contact details (phone, email, address), embedded Google Maps iframe placeholder, social links (Facebook, Instagram, WhatsApp).

9. **`<Footer>`** — dark green background, 3-col layout: logo+tagline, quick links, newsletter signup. Copyright line.

---

## Image Sources (Unsplash)

| Section | URL ID |
|---|---|
| Hero BG | `photo-1603269414002` (Vietnam green mountains) |
| About | `photo-1731119347526` (aerial lush green valley, Vietnam) |
| Trekking card | `photo-1585970661791` (green mountains) |
| Camping card | `photo-1778381464400` (white tents green valley, Vietnam) |
| Kayaking card | `photo-1543411789` (group in canoe) |
| Village card | `photo-1767924280511` (traditional hut, Vietnam) |
| Cultural card | `photo-1773393893547` (woman with baby, terraced fields) |
| Expedition card | `photo-1696276959983` (village in valley, mountains) |
| Gallery imgs | mix of the above + `photo-1686766219304`, `photo-1695094412603`, `photo-1700816287310`, `photo-1684511058469`, `photo-1663564000694` |

Also use the 3 user-uploaded images (`/src/imports/image.png`, `image-1.png`, `image-2.png`) — import as ES modules and place in gallery and/or hero area.

---

## Interactivity
- Navbar background changes on scroll (`useEffect` + `window.scrollY`)
- Tour filter tabs control which cards are shown (`useState`)
- Contact form has controlled inputs with basic validation feedback
- Gallery photos reveal caption on hover via CSS `group` classes
- Smooth scroll on nav link click (`scroll-behavior: smooth` in CSS)

---

## Verification
1. Check that all sections render without error in the preview panel
2. Scroll through to verify Navbar transparency → solid transition
3. Click tour filter tabs to confirm card filtering works
4. Check mobile layout at ~375px (nav collapses, grids reflow to 1 col)
5. Submit form to confirm controlled inputs work
