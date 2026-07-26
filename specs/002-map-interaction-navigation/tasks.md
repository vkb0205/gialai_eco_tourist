---

description: "Task list for Interactive Map Navigation"
---

# Tasks: Interactive Map Navigation

**Input**: Design documents from `/specs/002-map-interaction-navigation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-interaction-contract.md

**Tests**: Automated tests were not explicitly requested, so this plan focuses on implementation tasks plus required validation tasks for lint, build, accessibility, responsive behavior, content/data separation, and quickstart checks.

**Organization**: Tasks are grouped by user story to support independent implementation and validation.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current feature surface and data structure before changing interactions.

- [X] T001 Review `src/components/ExplorePage.tsx`, `src/data/explore.ts`, and `src/index.css` to map existing hover, selection, transform, and SVG styling behavior
- [X] T002 Inspect `specs/002-map-interaction-navigation/contracts/ui-interaction-contract.md` and `specs/002-map-interaction-navigation/data-model.md` to confirm required idle, hovered, selected, directional, and filter states
- [X] T003 [P] Verify the current `src/data/` structure keeps tourism content separated from presentation and note any new searchable metadata needed in `src/data/explore.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared map state, structured metadata, and styling hooks required by all user stories.

**âš ï¸ CRITICAL**: No user story work should begin until these tasks are complete.

- [X] T004 Refactor shared province/destination lookup data in `src/data/explore.ts` so province ids, labels, aliases, and searchable destination records are structured for hover, selection, and filter use
- [X] T005 [P] Add normalized search helper logic and map selection types in `src/components/ExplorePage.tsx` or a nearby `src/data/` helper module to support casing/whitespace tolerant matching
- [X] T006 [P] Add CSS state hooks in `src/index.css` for idle, hover, selected, focus-visible, disabled, and boundary styles used by the SVG map and controls
- [X] T007 Verify `src/components/ExplorePage.tsx` keeps click selection and map focus separate from hover preview by aligning local state with the data model rules

**Checkpoint**: Shared interaction primitives are ready for independent user story work.

---

## Phase 3: User Story 1 - Deliberate province focus and highlight behavior (Priority: P1) ðŸŽ¯ MVP

**Goal**: Provinces only preview on hover, remain persistently selected on click, and focus the map only through explicit activation.

**Independent Test**: Load the map, confirm no province is selected on initial render, hover several provinces without map movement, then click one province and verify it becomes both highlighted and focused.

### Implementation for User Story 1

- [X] T008 [US1] Update province SVG event handling in `src/components/ExplorePage.tsx` so hover only sets temporary preview state and never triggers focus or pan
- [X] T009 [US1] Update province click and keyboard activation handling in `src/components/ExplorePage.tsx` so explicit selection sets both selected and focused province state
- [X] T010 [P] [US1] Remove any automatic pre-selected province or default highlight behavior from `src/components/ExplorePage.tsx` and related data in `src/data/explore.ts`
- [X] T011 [US1] Add visible selected-versus-hovered rendering rules in `src/index.css` and `src/components/ExplorePage.tsx` so the clicked province remains identifiable when another province is hovered
- [X] T012 [US1] Ensure reset behavior in `src/components/ExplorePage.tsx` clears focused selection back to the idle state without introducing an automatic highlight

**Checkpoint**: Hover preview and explicit focus behavior work independently of filters and directional controls.

---

## Phase 4: User Story 2 - Directional map navigation after focus (Priority: P2)

**Goal**: Provide up, down, left, and right controls that move the map only after a province is focused.

**Independent Test**: Select a province, activate each directional control, confirm the map moves by a consistent amount, and verify the selected province remains active.

### Implementation for User Story 2

- [X] T013 [US2] Add directional navigation state and boundary-aware movement helpers in `src/components/ExplorePage.tsx` so map panning is derived from the focused province
- [X] T014 [P] [US2] Render accessible directional controls in `src/components/ExplorePage.tsx` with meaningful labels and disabled/inactive states when no province is selected
- [X] T015 [US2] Wire directional control actions in `src/components/ExplorePage.tsx` to update `mapTransform` without clearing selected province state
- [X] T016 [US2] Add directional control visual states in `src/index.css` for active, inactive, focus-visible, and boundary feedback
- [X] T017 [US2] Confirm keyboard activation and pointer interaction paths in `src/components/ExplorePage.tsx` keep directional controls usable after a province is selected

**Checkpoint**: Map movement works from the focused province context and does not disturb persistent selection.

---

## Phase 5: User Story 3 - Destination filtering without manual map navigation (Priority: P3)

**Goal**: Let travelers type or choose destinations from a filter UI and jump directly to the matching province or destination.

**Independent Test**: Open the filter, type a partial province or destination name, choose a result, and confirm the matching map area is selected and focused; verify empty and no-match states show clear feedback.

### Implementation for User Story 3

- [X] T018 [US3] Add destination filter state, normalized query handling, and result derivation in `src/components/ExplorePage.tsx` using structured data from `src/data/explore.ts`
- [X] T019 [P] [US3] Render the filter button/bar, result list, empty guidance, and no-match messaging in `src/components/ExplorePage.tsx`
- [X] T020 [US3] Connect filter result selection in `src/components/ExplorePage.tsx` to the same province selection and focus path used by manual map clicks
- [X] T021 [P] [US3] Extend `src/data/explore.ts` with destination aliases and selection metadata needed for province and destination search results
- [X] T022 [US3] Add keyboard navigation and visible focus styles for filter input and result items in `src/index.css` and `src/components/ExplorePage.tsx`
- [X] T023 [US3] Ensure filter selection preserves scroll freedom and does not trap focus in `src/components/ExplorePage.tsx`

**Checkpoint**: Filtering can independently find and activate destinations without manual map scanning.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across accessibility, responsive behavior, content/data separation, and build quality.

- [X] T024 Review `src/components/ExplorePage.tsx` and `src/index.css` for keyboard accessibility, visible focus states, and non-color-only hover/selected differentiation
- [X] T025 Verify responsive behavior for the map, controls, and filter in `src/components/ExplorePage.tsx` and `src/index.css` across mobile, tablet, and desktop layouts
- [X] T026 Run `npm run lint` from the repository root and fix any TypeScript or lint issues introduced by the map navigation changes
- [X] T027 Run `npm run build` from the repository root and fix any production build issues introduced by the feature work
- [X] T028 Validate the `specs/002-map-interaction-navigation/quickstart.md` scenarios against the updated app and record any follow-up fixes in `src/components/ExplorePage.tsx`, `src/data/explore.ts`, or `src/index.css`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
  - US1 can start immediately after Foundation
  - US2 can start after Foundation, but benefits from US1 state semantics
  - US3 can start after Foundation and remains independently testable
- **Polish (Final Phase)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories; this is the MVP foundation
- **User Story 2 (P2)**: Uses the same selection/focus state as US1 but can be implemented and tested independently
- **User Story 3 (P3)**: Uses the same selection/focus state as US1 and US2 but can be implemented and tested independently

### Parallel Opportunities

- T003 can run in parallel with T001/T002 because it only reviews data separation
- T005 and T006 can run in parallel because they touch different files/concerns
- T010 and T011 can overlap with other US1 work once the shared state model is in place
- T014 and T016 can be developed in parallel because one covers component markup and the other covers CSS states
- T019 and T021 can be worked on in parallel because one is UI markup and the other is structured data

---

## Parallel Example: User Story 1

```bash
# Update hover and click behavior separately:
Task: "T008 [US1] Update province SVG event handling in src/components/ExplorePage.tsx so hover only sets temporary preview state and never triggers focus or pan"
Task: "T010 [P] [US1] Remove any automatic pre-selected province or default highlight behavior from src/components/ExplorePage.tsx and related data in src/data/explore.ts"

# Then finalize visual distinction:
Task: "T011 [US1] Add visible selected-versus-hovered rendering rules in src/index.css and src/components/ExplorePage.tsx so the clicked province remains identifiable when another province is hovered"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate hover, click, and initial idle behavior using `specs/002-map-interaction-navigation/quickstart.md`
5. Stop and review before adding directional navigation or filtering

### Incremental Delivery

1. Deliver explicit hover/click selection and focus behavior first
2. Add directional controls second, reusing the same selected province state
3. Add destination filtering last, reusing the same selection/focus flow
4. Finish with lint, build, accessibility, responsive, and quickstart validation

### Parallel Team Strategy

With multiple developers:

1. One developer can refine shared data and CSS hooks while another updates ExplorePage state handling
2. After Foundation, US1 can be implemented while US2 control scaffolding and US3 filter scaffolding are prepared in parallel
3. Final validation can be shared across the team after each story is complete

---

## Notes

- [P] tasks can run in parallel when they touch different files and do not depend on incomplete work
- Each user story phase is independently testable through the behaviors described in `spec.md` and `quickstart.md`
- All tasks follow the required checklist format with checkbox, task ID, labels, and file paths
