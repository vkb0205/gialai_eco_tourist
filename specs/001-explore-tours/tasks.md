# Tasks: Explore Page (Tour Package Catalogue)

**Input**: Design documents from `/specs/001-explore-tours/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md)

**Tests**: No test runner is configured in this project and none was requested. Test tasks are therefore omitted. Each story carries a manual verification step instead, traceable to the acceptance scenarios in spec.md.

**Organization**: Tasks are grouped by user story so each can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- File paths are relative to the repository root

## Path Conventions

Single-project frontend. All source lives under `src/`, per the Structure Decision in plan.md.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Directory scaffolding and the dependency swap that unblocks every later component

- [X] T001 Install `@phosphor-icons/react` as a runtime dependency in `package.json` (completed: version 2.1.10)
- [ ] T002 Create the feature directory structure: `src/data/`, `src/lib/`, `src/components/layout/`, `src/components/explore/`, `src/pages/`
- [ ] T003 [P] Add shared text helpers in `src/lib/text.ts`: diacritic folding that also maps `đ` to `d` (NFD does not decompose it), and a VND price formatter emitting the existing `2.400.000đ` format

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Routing, shared chrome extraction, and the data layer. No user story can begin until these land.

**⚠️ CRITICAL**: T004 through T011 block all story phases

### Routing and app shell

- [ ] T004 Implement hash routing in `src/lib/useHashRoute.ts`: parse `#/` and `#/explore` plus a query string, subscribe via `useSyncExternalStore` on `hashchange`, and export a `navigateTo` helper that accepts an optional scroll target for landing-page anchors
- [ ] T005 Extract the navigation component from `src/App.tsx` into `src/components/layout/Navigation.tsx`, replacing the `window.addEventListener("scroll")` handler at `src/App.tsx:200` with an IntersectionObserver sentinel, and adding a "Khám phá" link to `#/explore` that keeps the desktop nav on one line
- [ ] T006 [P] Extract the footer from `src/App.tsx` into `src/components/layout/Footer.tsx`, making its section links route-aware so they return to the landing page from `#/explore`
- [ ] T007 Move the landing sections (Hero, IntroStrip, Story, Experiences, Destinations, Philosophy, Journal, Contact) from `src/App.tsx` into `src/pages/HomePage.tsx`, and fix the em-dash in the Philosophy copy at `src/App.tsx:508`
- [ ] T008 Reduce `src/App.tsx` to a routing shell that renders Navigation, the active page, and Footer
- [ ] T009 Replace all 12 hand-rolled SVG icon components with named `@phosphor-icons/react` imports across `src/pages/HomePage.tsx`, `src/components/layout/Navigation.tsx`, and `src/components/layout/Footer.tsx`, standardising on one weight

### Data layer

- [ ] T010 [P] Define the 8 regions in `src/data/regions.ts`: slug, Vietnamese display name, one-line characterisation, representative image, in the fixed north-to-south order Tây Bắc, Đông Bắc, Bắc Bộ, Bắc Trung Bộ, Nam Trung Bộ, Tây Nguyên, Đông Nam Bộ, Đồng bằng sông Cửu Long
- [ ] T011 [P] Define the `Tour` type in `src/data/tours.ts` with id, slug, title, regionSlug, theme, durationDays, durationLabel, priceVnd as a sortable number, difficulty, groupMax, departureMonths, image, blurb, highlights, and impact, plus a header comment marking the dataset as representative sample data per FR-015
- [ ] T012 Author 24 tour records in `src/data/tours.ts`, 3 per region, using real Vietnamese place references, organic non-round prices, and no fabricated ratings or scarcity claims
- [ ] T013 [P] Define facet group configuration in `src/data/filters.ts` for theme, duration band, price band, difficulty, departure season, and group size, each carrying a key, Vietnamese label, selection mode of single or multiple, and its options

**Checkpoint**: Routing works, both routes render shared chrome, and the dataset is importable and typed

---

## Phase 3: User Story 1 - Browse the full catalogue (Priority: P1) 🎯 MVP

**Goal**: Every package is visible, scannable, and comparable at all viewport widths

**Independent Test**: Open `#/explore` with no filters. All 24 packages render with region, duration, price, and difficulty visible. The count reads "24 hành trình".

### Implementation

- [ ] T014 [P] [US1] Build `src/components/explore/TourCard.tsx` reusing the existing card treatment from `src/App.tsx:390`: 2px radius, hairline border, locked image aspect ratio, `loading="lazy"`, descriptive alt text, a starting-price label satisfying FR-014, and one booking action reusing the existing "Đặt hành trình" label per FR-013
- [ ] T015 [P] [US1] Build `src/components/explore/TourCardSkeleton.tsx` matching TourCard's exact dimensions so the loading state cannot shift layout
- [ ] T016 [US1] Build `src/pages/ExplorePage.tsx` rendering the full catalogue in a responsive grid: 1 column below `md`, 2 at `md`, 3 at `xl`
- [ ] T017 [US1] Register the `#/explore` route in `src/App.tsx` and verify the navigation link reaches it
- [ ] T018 [US1] Verify at 375px, 768px, and 1440px that no horizontal page scrolling occurs and that cards remain readable when a remote image fails to load

**Checkpoint**: The catalogue is browsable end to end. This is the MVP and is independently shippable.

---

## Phase 4: User Story 2 - Narrow by region (Priority: P1) 🎯 MVP

**Goal**: Region filtering with shareable URLs

**Independent Test**: Select "Tây Bắc". Only Tây Bắc packages remain, the count updates, a removable chip appears, and reopening the copied URL restores the selection.

### Implementation

- [ ] T019 [US2] Build the pure filter engine in `src/lib/filterTours.ts`: accept dataset plus filter state, return filtered results and per-option counts in a single pass so displayed counts cannot drift from results per FR-010
- [ ] T020 [US2] Build URL state serialisation in `src/lib/urlState.ts`: encode filter state into the hash query, parse it back on load, and fall back to the unfiltered catalogue on unknown or malformed values
- [ ] T021 [US2] Wire filter state into `src/pages/ExplorePage.tsx` with the URL as the single source of truth, so browser back and forward move through filter states
- [ ] T022 [US2] Build `src/components/explore/RegionStrip.tsx` as a horizontal scroll-snap row of region pills showing name and package count, keyboard reachable, with zero-count regions shown disabled rather than hidden
- [ ] T023 [US2] Verify multi-region selection combines as OR, and that a copied URL reproduces an identical result set for a second visitor

**Checkpoint**: Region filtering is complete and shareable. Combined with US1, this satisfies the P1 scope.

---

## Phase 5: User Story 3 - Narrow by trip attributes (Priority: P2)

**Goal**: The remaining six facet groups, in a sticky desktop rail and a mobile overlay

**Independent Test**: Apply "Dưới 1 triệu" and "1 ngày" together. Only packages satisfying both remain, shown as two removable chips.

### Implementation

- [ ] T024 [P] [US3] Build `src/components/explore/FacetGroups.tsx` rendering any facet group from `src/data/filters.ts`, with disabled zero-count options, correct `aria-pressed` or checkbox semantics, and visible focus
- [ ] T025 [US3] Build `src/components/explore/FilterRail.tsx` as the sticky desktop panel at `lg` and above, consuming FacetGroups
- [ ] T026 [US3] Build `src/components/explore/FilterDrawer.tsx` as the below-`lg` overlay per FR-012: opened by a control displaying the active filter count, with focus trap, Escape to dismiss, `aria-expanded`, and focus restored to the trigger on close
- [ ] T027 [US3] Build `src/components/explore/ResultsToolbar.tsx` with the result count in an `aria-live` region per FR-005, individually removable active-filter chips, and a single "Xóa tất cả" control per FR-006
- [ ] T028 [US3] Verify that options within a group combine as OR and separate groups combine as AND, matching FR-004

**Checkpoint**: Full faceted filtering works on both desktop and mobile

---

## Phase 6: User Story 4 - Search and order results (Priority: P3)

**Goal**: Keyword search and sorting

**Independent Test**: Type "thác" and confirm waterfall packages match. Switch to price ascending and confirm the cheapest leads.

### Implementation

- [ ] T029 [US4] Add diacritic-insensitive keyword matching across title, region, and highlights to `src/lib/filterTours.ts`, using the folding helper from `src/lib/text.ts`
- [ ] T030 [US4] Build `src/components/explore/ExploreHeader.tsx`: headline, one supporting line under 20 words, and an inline labelled search field with WCAG AA placeholder and focus-ring contrast, top padding capped at `pt-24`, no section-number eyebrow, no scroll cue
- [ ] T031 [US4] Add the four sort modes to `src/lib/filterTours.ts` and a labelled sort control to `src/components/explore/ResultsToolbar.tsx`, ensuring the choice survives filter changes per FR-009
- [ ] T032 [US4] Verify keyword and region filters apply together, and that "thac" matches "thác"

**Checkpoint**: Search and sort layer complete

---

## Phase 7: User Story 5 - Recover from an empty result set (Priority: P3)

**Goal**: No unexplained blank grid

**Independent Test**: Combine mutually exclusive filters. A written explanation names the active constraints and offers a recovery action.

### Implementation

- [ ] T033 [US5] Build `src/components/explore/EmptyResults.tsx` naming the active filters in prose and offering an action that removes the most restrictive one
- [ ] T034 [US5] Wire loading, empty, and populated states into `src/pages/ExplorePage.tsx` per FR-011
- [ ] T035 [US5] Add progressive pagination with an explicit "Xem thêm" control per FR-018, never automatic infinite scroll
- [ ] T036 [US5] Verify with a screen reader that result count changes are announced and that the empty state is reachable and actionable by keyboard

**Checkpoint**: All five user stories are independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T037 Decide the theme question explicitly: either add `prefers-color-scheme: dark` values to the token block in `src/index.css:22` site-wide, or record a deliberate light-only decision, since the Explore page must not differ from the landing page
- [ ] T038 [P] Add CSS-only motion gated behind `prefers-reduced-motion`: card press feedback, chip enter and exit, and filter-change transitions. No animation library, consistent with the plan's `MOTION_INTENSITY` of 4
- [ ] T039 Run the design pre-flight audit across the new components: zero em-dashes, eyebrow count at or below `ceil(sections / 3)`, a single accent colour, one corner-radius system, no decorative status dots, no pills overlaid on images, no filled progress tracks
- [ ] T040 Run the accessibility pass against SC-003 and SC-004: keyboard traversal of region strip, every facet group, the mobile sheet, sort, and pagination, plus contrast verification of every control against its actual background
- [ ] T041 Run `npx tsc --noEmit` and `npm run build`, then `npm run format`, and resolve everything reported
- [ ] T042 Verify SC-002 and SC-005 in the browser: filter response under 100ms and CLS below 0.1 while the catalogue loads
- [ ] T043 [P] Optional landing-page consistency pass: retire the numbered section eyebrows, remove the hero scroll cue at `src/App.tsx:313`, and trim the hero text stack to four elements

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies
- **Foundational (Phase 2)**: depends on Setup, blocks every user story
- **US1 (Phase 3)** and **US2 (Phase 4)**: both P1, together forming the MVP
- **US3 (Phase 5)**: depends on the filter engine delivered in T019
- **US4 (Phase 6)** and **US5 (Phase 7)**: P3, both depend on US1 and US2
- **Polish (Phase 8)**: depends on all shipped stories

### Critical Path

T002 → T004 → T005 → T007 → T008 → T016 → T019 → T021 → T027

### Within Each User Story

Data before engine, engine before UI, core implementation before verification.

### Parallel Opportunities

- T003, T010, T011, T013 can run together (different files, no shared dependencies)
- T006 can run alongside T005
- T014 and T015 can run together
- T024 can start while T019 is being verified
- T038 and T043 can run together during polish

---

## Implementation Strategy

### MVP First

1. Phase 1 Setup
2. Phase 2 Foundational (blocking)
3. Phase 3 US1, then Phase 4 US2
4. **STOP and VALIDATE**: the catalogue browses and filters by region, shareable by URL
5. Deployable at this point

### Incremental Delivery

Setup and Foundational, then US1 plus US2 as the MVP, then US3 for full faceting, then US4 and US5 as the convenience and resilience layer, then polish. Each increment leaves the site in a shippable state.

---

## Notes

- No test runner exists, so every story ends in an explicit manual verification task tied to its acceptance scenarios
- T007 and T008 touch the same file sequentially and must not be parallelised
- The dataset is sample content; FR-015 requires the marker comment to survive until real inventory replaces it
- Commit after each task or logical group
