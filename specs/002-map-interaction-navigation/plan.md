# Implementation Plan: Interactive Map Navigation

**Branch**: `002-map-interaction-navigation` | **Date**: 2026-07-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-map-interaction-navigation/spec.md`

## Summary

Refine the existing Gia Lai interactive map so hover only previews a province, click explicitly selects and focuses it, directional controls move the focused map, and destination filtering lets travelers find provinces without manual map scanning. The design keeps destination data structured in `src/data/` and uses the current Vite + React + TypeScript stack with no new runtime dependencies.

## Technical Context

**Language/Version**: TypeScript ~5.8.2 with React 19.0.1

**Primary Dependencies**: React, React DOM, lucide-react, existing Vite SVG/raw asset pipeline; no new runtime dependencies planned

**Storage**: N/A — interaction state is client-side only; destination/province metadata remains in structured source data

**Testing**: Repository validation via `npm run lint` and `npm run build`; manual responsive, keyboard, hover, click, scrolling, and filter validation on the interactive map

**Target Platform**: Browser-based Vite web application across desktop, tablet, and mobile-responsive layouts

**Project Type**: Single frontend web application

**Performance Goals**: Hover and click interactions should feel immediate, preserve smooth map motion, and avoid layout shift or blocked scrolling

**Constraints**: Must preserve keyboard accessibility, visible focus behavior, TypeScript validation, responsive behavior, structured content/data separation, and the current Vite + React + TypeScript stack

**Scale/Scope**: One interactive destination map, province selection and focus, directional map controls, and filter-driven destination lookup

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Eco-tourism experience**: PASS — the map stays focused on destination discovery and avoids accidental focus shifts that would interrupt travel exploration.
- **Content/data separation**: PASS — province, destination, and search metadata belong in structured data modules rather than inline presentation markup.
- **Type safety and accessibility**: PASS — the plan preserves typed interaction state, keyboard access, and visible focus states for map, controls, and filter results.
- **Performance and responsive delivery**: PASS — the design stays lightweight, reuses existing rendering, and must remain usable across mobile, tablet, and desktop sizes without trapping page scrolling.
- **Incremental validation**: PASS — hover/select behavior, directional navigation, and filter flows can be validated independently before running lint/build gates.
- **Dependency discipline**: PASS — no new dependencies are required; existing React, TypeScript, and browser capabilities are sufficient.

## Project Structure

### Documentation (this feature)

```text
specs/002-map-interaction-navigation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── ui-interaction-contract.md
```

### Source Code (repository root)

```text
src/
├── components/
│   └── ExplorePage.tsx
├── data/
│   └── explore.ts
├── assets/
│   └── vn.svg
├── App.tsx
├── main.tsx
└── index.css
```

**Structure Decision**: Use the existing single frontend application structure. Feature work is localized to the Explore map page and structured data modules so the interaction model stays maintainable and easy to validate.

## Complexity Tracking

No constitution violations or additional complexity are required.

## Phase 0 Research Summary

Research completed in [research.md](./research.md). Key decisions: reuse the existing SVG province map and selection model, separate hover preview from click selection/focus, derive directional navigation from the current selected province/map state, and implement filter/search using structured destination data rather than duplicated UI copy.

## Phase 1 Design Summary

Design artifacts completed:

- [data-model.md](./data-model.md)
- [contracts/ui-interaction-contract.md](./contracts/ui-interaction-contract.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- **Eco-tourism experience**: PASS — the interaction model improves destination discovery and avoids confusing automatic highlights.
- **Content/data separation**: PASS — provinces, destinations, aliases, and navigation metadata are modeled as data, not repeated in view markup.
- **Type safety and accessibility**: PASS — the contract requires keyboard operability, visible states, and explicit focus management.
- **Performance and responsive delivery**: PASS — design favors lightweight interaction state and responsive controls without new assets.
- **Incremental validation**: PASS — quickstart defines isolated validation flows plus lint/build checks.
- **Dependency discipline**: PASS — no new dependencies are introduced.