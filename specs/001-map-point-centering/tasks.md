# Tasks: map-point-centering

**Input**: Design documents from `/specs/001-map-point-centering/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-interaction-contract.md, quickstart.md

**Tests**: No automated tests were explicitly requested. Constitution-required validation tasks for lint, build, accessibility, responsive behavior, and content/data separation are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Task can run in parallel because it touches different files or only reads documentation
- **[Story]**: User story task belongs to, e.g. [US1], [US2]
- All implementation tasks include exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current Explore map implementation, docs, and validation commands before feature work starts.

- [X] T001 Review `specs/001-map-point-centering/spec.md`, `specs/001-map-point-centering/plan.md`, and `specs/001-map-point-centering/contracts/ui-interaction-contract.md` to confirm scope excludes comparison behavior
- [X] T002 Inspect current map event handling and transform behavior in `src/components/ExplorePage.tsx`
- [X] T003 [P] Inspect current region map data and `mapTransform` values in `src/data/explore.ts`
- [X] T004 [P] Run baseline `npm run lint` from repository root and record any pre-existing TypeScript issues before editing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create shared map-selection primitives that both user stories depend on.

**⚠️ CRITICAL**: No user story implementation should begin until these tasks are complete.

- [X] T005 Define typed selection-source and selected-point state helpers in `src/components/ExplorePage.tsx`
- [X] T006 Refactor existing region lookup logic in `src/components/ExplorePage.tsx` so selectable SVG circle points consistently resolve `pointId`, province name, and `regionId`
- [X] T007 Add or identify map viewport/stage references needed to measure selected point position and left panel bounds in `src/components/ExplorePage.tsx`
- [X] T008 [P] Confirm editable region/tour content remains separated in `src/data/explore.ts` and avoid moving tourism copy into `src/components/ExplorePage.tsx`

**Checkpoint**: Shared point selection context is ready for user story implementation.

---

## Phase 3: User Story 1 - Center selected map point (Priority: P1) 🎯 MVP

**Goal**: Hovering, clicking, or keyboard-activating an interactive map point zooms/recenters the map so that point appears centered in the left map panel.

**Independent Test**: Open the Explore page, hover/click/keyboard-activate any selectable map point, and verify the selected point is visually active and centered in the left panel as closely as available bounds allow.

### Implementation User Story 1

- [X] T009 [US1] Add a shared `selectMapPoint` interaction handler in `src/components/ExplorePage.tsx` that accepts point ID, region ID, province name, and selection source
- [X] T010 [US1] Attach pointer hover handling to selectable SVG circle points in `src/components/ExplorePage.tsx` using the shared `selectMapPoint` handler
- [X] T011 [US1] Update existing click handling for selectable SVG circle points in `src/components/ExplorePage.tsx` to use the shared `selectMapPoint` handler
- [X] T012 [US1] Update existing Enter/Space keyboard handling in `src/components/ExplorePage.tsx` to use the shared `selectMapPoint` handler
- [X] T013 [US1] Implement point-aware transform calculation in `src/components/ExplorePage.tsx` that zooms and pans the map so the selected point lands at the left panel center target
- [X] T014 [US1] Apply the active map transform with smooth transform-only animation in `src/components/ExplorePage.tsx`
- [X] T015 [US1] Update active and selectable SVG point class toggles in `src/components/ExplorePage.tsx` so only the selected point is visually active
- [X] T016 [US1] Preserve accessible role, tabindex, aria-label, and visible focus behavior for selectable points in `src/components/ExplorePage.tsx`
- [X] T017 [US1] Manually validate quickstart hover, click, and keyboard scenarios from `specs/001-map-point-centering/quickstart.md` against `src/components/ExplorePage.tsx`

**Checkpoint**: MVP is complete when a selected map point centers in the left panel by hover, click, and keyboard activation.

---

## Phase 4: User Story 2 - Support repeated point selection (Priority: P2)

**Goal**: Selecting another point after one is already active shifts focus to the new point and recenters the map without manual panning or comparison behavior.

**Independent Test**: Select two different map points in sequence and confirm the second point becomes the only active focus and is centered in the left panel.

### Implementation User Story 2

- [X] T018 [US2] Ensure repeated point selection replaces previous selected-point state instead of accumulating selections in `src/components/ExplorePage.tsx`
- [X] T019 [US2] Ensure re-selecting the same point does not trigger duplicate active states or disorienting transform jumps in `src/components/ExplorePage.tsx`
- [X] T020 [US2] Update reset/full-map behavior so `Xem toàn bản đồ` clears selected point state and returns to the full-map view in `src/components/ExplorePage.tsx`
- [X] T021 [US2] Remove or avoid any UI behavior that suggests multi-point comparison in `src/components/ExplorePage.tsx`
- [X] T022 [US2] Manually validate quickstart repeated-selection and no-comparison scenarios from `specs/001-map-point-centering/quickstart.md` against `src/components/ExplorePage.tsx`

**Checkpoint**: Repeated selection is complete when only one selected point is active and selecting another point recenters cleanly.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validate constitution requirements and finish documentation alignment.

- [X] T023 [P] Perform responsive review for desktop, tablet, and mobile-sized viewports using `specs/001-map-point-centering/quickstart.md`
- [X] T024 [P] Perform accessibility review for keyboard navigation, visible focus states, and meaningful point labels in `src/components/ExplorePage.tsx`
- [X] T025 Verify map transitions avoid layout shift and use lightweight transform behavior in `src/components/ExplorePage.tsx`
- [X] T026 [P] Update `specs/001-map-point-centering/quickstart.md` if validation steps changed during implementation
- [X] T027 Run `npm run lint` from repository root and fix any TypeScript validation failures in changed files
- [X] T028 Run `npm run build` from repository root and fix any production build failures in changed files

---

## Dependencies

### Phase Dependencies

- **Phase 1 Setup**: No dependencies
- **Phase 2 Foundational**: Depends on Phase 1
- **Phase 3 User Story 1**: Depends on Phase 2
- **Phase 4 User Story 2**: Depends on Phase 2 and should integrate with the US1 selection state behavior
- **Phase 5 Polish**: Depends on completed user stories being validated

### User Story Dependencies

- **User Story 1 (P1)**: Start after Foundational phase; no dependency on User Story 2
- **User Story 2 (P2)**: Start after Foundational phase; uses the same selected-point state established by User Story 1 for full integration

### Within Each User Story

- Selection state helpers before event handler updates
- Event handler updates before transform validation
- Active visual styling before accessibility/responsive review
- Manual validation after implementation tasks for that story

---

## Parallel Opportunities

- T003 and T004 can run in parallel with T002 after T001 starts
- T008 can run in parallel with T005-T007 because it only verifies data/content separation
- After Phase 2, US1 and US2 can be implemented by different people only if they coordinate on selected-point state in `src/components/ExplorePage.tsx`
- T023, T024, and T026 can run in parallel after user story implementation is complete

## Parallel Example: User Story 1

```bash
Task: "Attach pointer hover handling to selectable SVG circle points in src/components/ExplorePage.tsx"
Task: "Update existing click handling for selectable SVG circle points in src/components/ExplorePage.tsx"
Task: "Update existing Enter/Space keyboard handling in src/components/ExplorePage.tsx"
```

These tasks touch the same file and require coordination, but they can be assigned together after T009 defines the shared handler.

## Parallel Example: User Story 2

```bash
Task: "Ensure repeated point selection replaces previous selected-point state instead of accumulating selections in src/components/ExplorePage.tsx"
Task: "Update reset/full-map behavior so Xem toàn bản đồ clears selected point state and returns to the full-map view in src/components/ExplorePage.tsx"
```

These tasks can be done together after selected-point state is implemented.

---

## Implementation Strategy

### MVP First

Complete Phase 1, Phase 2, and Phase 3 only. This delivers User Story 1: selected map points center in the left panel through hover, click, and keyboard activation.

### Incremental Delivery

1. Deliver MVP with User Story 1 and validate hover/click/keyboard centering.
2. Add User Story 2 repeated-selection behavior and validate one active point at a time.
3. Complete polish tasks for responsive, accessibility, lint, and build gates.

### Quality Gates

Implementation is not complete until `npm run lint`, `npm run build`, accessibility review, and responsive review have passed or any blockers are documented with owner, reason, and mitigation.
