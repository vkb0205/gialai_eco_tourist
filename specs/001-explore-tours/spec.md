# Feature Specification: Explore Page (Tour Package Catalogue)

**Feature Branch**: `001-explore-tours`
**Created**: 2026-08-05
**Status**: Draft
**Input**: "An explore page which will have all the tour packages given by the agency, with all the filters and product ranges across different regions in Vietnam."

## Scope Decision

The agency is presented as a **nationwide operator with equal weight across 8 Vietnamese regions**: Tây Bắc, Đông Bắc, Bắc Bộ, Bắc Trung Bộ, Nam Trung Bộ, Tây Nguyên, Đông Nam Bộ, and Đồng bằng sông Cửu Long. The catalogue holds approximately 24 tour packages, 3 per region.

This is an additive route. The existing single-page landing experience keeps its content, anchors, and brand identity unchanged.

## User Scenarios & Testing

### User Story 1 - Browse the full catalogue (Priority: P1) 🎯 MVP

A traveller who knows they want a trip in Vietnam but has not chosen a destination opens the Explore page and sees every tour the agency offers, presented so they can scan and compare.

**Why this priority**: Without a complete, readable list there is nothing to filter. This story alone replaces the current situation where only 4 sample trips are visible on the landing page.

**Independent Test**: Navigate to `#/explore` with no filters applied. All 24 packages render with title, region, duration, price, difficulty, and image. The count reads "24 hành trình".

**Acceptance Scenarios**:

1. **Given** a traveller lands on the Explore page, **When** the page finishes loading, **Then** every published package is listed with its region, duration, starting price, and difficulty visible without opening the card.
2. **Given** a traveller is on a 375px-wide phone, **When** they scroll the catalogue, **Then** cards stack in a single readable column and no horizontal scrolling of the page occurs.
3. **Given** images are still loading, **When** the traveller looks at the grid, **Then** placeholders occupy the final card dimensions so content does not shift when images arrive.
4. **Given** a remote image fails to load, **When** the card renders, **Then** the title, region, duration, and price remain readable.

---

### User Story 2 - Narrow the catalogue by region (Priority: P1) 🎯 MVP

A traveller planning around a specific part of Vietnam restricts the catalogue to one or more regions.

**Why this priority**: Region is the primary axis the user named. It is the difference between a list and a catalogue.

**Independent Test**: Select "Tây Bắc". Only Tây Bắc packages remain, the result count updates, and a removable chip naming the region appears.

**Acceptance Scenarios**:

1. **Given** the full catalogue, **When** the traveller selects one region, **Then** only packages in that region remain and the result count updates immediately.
2. **Given** one region is selected, **When** the traveller selects a second region, **Then** packages from both regions are shown, because regions combine as OR.
3. **Given** a region is selected, **When** the traveller removes its chip, **Then** the catalogue returns to its previous wider result set.
4. **Given** a region filter is active, **When** the traveller copies the URL and opens it in a new tab, **Then** the same region selection is restored.

---

### User Story 3 - Narrow by trip attributes (Priority: P2)

A traveller with a fixed budget, a fixed number of free days, or a fitness limit filters on those attributes, alone or combined with region.

**Why this priority**: These facets turn browsing into planning, but the page is already useful without them.

**Independent Test**: Apply "Dưới 1 triệu" and "1 ngày" together. Only packages satisfying both remain, and the two facets display as two removable chips.

**Acceptance Scenarios**:

1. **Given** the catalogue, **When** the traveller picks a price band, **Then** only packages whose starting price falls inside that band remain.
2. **Given** a theme and a duration are both selected, **When** results render, **Then** only packages matching both criteria appear, because different facet groups combine as AND.
3. **Given** a facet option would return zero results under the current selection, **When** the traveller views the filter panel, **Then** that option is shown disabled with a zero count rather than being removed from the panel.
4. **Given** several filters are active, **When** the traveller activates "Xóa tất cả", **Then** every filter clears and the full catalogue returns.

---

### User Story 4 - Search and order results (Priority: P3)

A traveller who already has a place or keyword in mind types it, and orders the results by price or duration.

**Why this priority**: A convenience layer over an already-working catalogue.

**Independent Test**: Type "thác" into the search field. Only packages referencing waterfalls remain. Switch sort to price ascending and confirm the cheapest package leads.

**Acceptance Scenarios**:

1. **Given** the catalogue, **When** the traveller types a keyword, **Then** matching happens across title, region, and highlights, and is insensitive to case and to Vietnamese diacritics.
2. **Given** a keyword and a region filter are both active, **When** results render, **Then** both constraints apply together.
3. **Given** results are displayed, **When** the traveller selects price ascending, **Then** packages reorder by starting price from lowest, and the choice survives a filter change.

---

### User Story 5 - Recover from an empty result set (Priority: P3)

A traveller whose filter combination matches nothing is told why and offered a way out.

**Why this priority**: An unexplained blank grid reads as a broken page. Constitution principle IV requires empty states.

**Independent Test**: Combine filters that cannot co-exist. A composed message appears naming the active constraints, with an action to relax them.

**Acceptance Scenarios**:

1. **Given** a filter combination matching no package, **When** results render, **Then** a written explanation appears naming which filters are active.
2. **Given** the empty state is visible, **When** the traveller activates the offered action, **Then** the most restrictive filter is removed and results reappear.
3. **Given** the empty state is visible, **When** a screen reader is in use, **Then** the change in result count is announced.

---

### Edge Cases

- Result counts must stay consistent between the toolbar total, the region pill counts, and the facet counts.
- A region with no packages must still appear in the region strip, showing a zero count in a disabled state.
- Deep links carrying an unknown region or malformed filter value must fall back to the unfiltered catalogue rather than rendering an error.
- Browser back and forward must move through filter states rather than leaving the page.
- Keyboard-only operation must reach every filter control, and the mobile filter sheet must trap focus while open and return focus to its trigger on close.
- Prices are starting prices per traveller and must never be presented as a confirmed booking total.

## Requirements

### Functional Requirements

- **FR-001**: The site MUST serve an Explore route at `#/explore`, reachable from the primary navigation on every page, without breaking existing landing-page anchors.
- **FR-002**: The Explore page MUST list every published package with title, region, duration, starting price, difficulty, group ceiling, and a representative image.
- **FR-003**: The page MUST provide filtering by region, theme, duration band, price band, difficulty, departure season, and group size.
- **FR-004**: Options inside one facet group MUST combine as OR; separate facet groups MUST combine as AND.
- **FR-005**: The page MUST display a live result count that updates on every filter change and is announced to assistive technology.
- **FR-006**: Every active filter MUST appear as an individually removable chip, alongside a single control that clears all filters.
- **FR-007**: Filter, search, and sort state MUST serialise into the URL so a filtered view can be shared and restored, including through browser history navigation.
- **FR-008**: The page MUST offer keyword search across title, region, and highlights, insensitive to case and Vietnamese diacritics.
- **FR-009**: The page MUST offer ordering by curated default, price ascending, price descending, and duration.
- **FR-010**: Facet options yielding zero results under the current selection MUST render disabled with a zero count, never disappear.
- **FR-011**: The page MUST provide distinct loading, empty, and populated states, with loading placeholders matching final card dimensions.
- **FR-012**: On viewports below 1024px the filter panel MUST be a dismissible overlay opened by a control that displays the active filter count.
- **FR-013**: Each package MUST expose exactly one booking action, reusing the existing enquiry destination and the existing "Đặt hành trình" label.
- **FR-014**: Prices MUST be labelled as starting prices per traveller in Vietnamese đồng, with no countdown timers, scarcity counters, or fabricated review scores.
- **FR-015**: Catalogue content MUST be marked in source as representative sample data until the agency supplies verified inventory.
- **FR-016**: The page MUST be operable by keyboard alone, with visible focus on every control, and MUST NOT depend on hover to reveal information.
- **FR-017**: The Explore page MUST reuse the established brand tokens, type stack, and corner-radius system, introducing no new accent colour.
- **FR-018**: Long result sets MUST be paginated progressively, with an explicit control to reveal more rather than an automatic infinite scroll.

### Key Entities

- **Region**: A Vietnamese travel region. Carries a slug, a Vietnamese display name, a one-line characterisation, a representative image, and a derived package count.
- **Tour Package**: A sellable journey. Carries an identifier, slug, title, owning region, theme, duration in days plus a display label, starting price as a sortable number, difficulty, group ceiling, departure months, image, short description, highlights, and community-impact notes.
- **Facet Group**: A filter dimension. Carries a key, a Vietnamese label, a selection mode of single or multiple, and its options.
- **Filter State**: The traveller's current selection across all facet groups, plus keyword and sort order. Serialisable to and from the URL.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A traveller can move from first view of the Explore page to a filtered set of five or fewer relevant packages in under 30 seconds.
- **SC-002**: Applying or removing any filter updates results in under 100ms on a mid-range mobile device, with no full page reload.
- **SC-003**: The catalogue is fully operable by keyboard alone, verified across the region strip, every facet group, the mobile filter sheet, sort, and pagination.
- **SC-004**: Every text and control meets WCAG 2.1 AA contrast, verified against each background the component sits on.
- **SC-005**: Cumulative Layout Shift stays below 0.1 while the catalogue loads and while filters are applied.
- **SC-006**: A shared filtered URL reproduces an identical result set for a second traveller.
- **SC-007**: No filter combination produces an unexplained blank area; every zero-result state offers a recovery action.

## Assumptions

- Tour content is authored as representative sample data in this feature. Real inventory, real photography, and verified pricing arrive in a later feature and are explicitly out of scope here.
- All packages are domestic Vietnamese journeys, so passport, visa, and border requirements from the constitution's International Travel Readiness section do not apply. Adding an international package would require revisiting that section.
- Booking remains an enquiry flow through the existing contact section. No payment, availability calendar, or reservation state is introduced.
- The interface stays Vietnamese-only in this feature, with copy kept localisation-ready.
- No backend exists. The catalogue ships as a static typed dataset in the client bundle.

## Out of Scope

- Individual tour detail pages, itinerary day breakdowns, and per-tour galleries.
- Real availability, seat counts, live pricing, and payment.
- Reviews, ratings, wishlists, and account features.
- Map-based browsing and geospatial search.
- English or other language versions.
