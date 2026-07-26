# Implementation Plan: map-point-centering

**Branch**: `[001-map-point-centering]` | **Date**: 2026-07-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-map-point-centering/spec.md`

## Summary

Update the Explore page map interaction so selecting a map point by hover, click, or keyboard focus makes that point the active visual focus and zooms/recenters the map so the point appears centered in the left panel. The plan uses the existing Explore page, existing SVG map point elements, and existing structured region data; no comparison behavior, external services, storage, or new dependencies are in scope.

## Technical Context

**Language/Version**: TypeScript ~5.8.2 with React 19.0.1

**Primary Dependencies**: React, React DOM, lucide-react, existing raw SVG import via Vite; no new runtime dependencies planned

**Storage**: N/A — existing in-memory structured explore data only

**Testing**: Repository validation via `npm run lint` and `npm run build`; manual responsive, keyboard, hover, and click validation on the Explore page

**Target Platform**: Browser-based Vite web application across desktop, tablet, and mobile-responsive layouts

**Project Type**: Single frontend web application

**Performance Goals**: Point selection transition should feel immediate and smooth, avoid layout shift, and preserve responsive rendering without introducing additional assets or heavy computations

**Constraints**: Must preserve keyboard accessibility, visible focus behavior, TypeScript validation, existing visual design system, and current Vite + React + TypeScript stack

**Scale/Scope**: One Explore page map interaction; existing map points and region data; no multi-point comparison and no changes to other pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Eco-tourism experience**: PASS — the feature improves traveler discovery by making selected map destinations easier to inspect and keeps the Explore journey focused on destination exploration.
- **Content/data separation**: PASS — existing destination and region information remains in `src/data/explore.ts`; only interaction metadata needed for focus behavior should be added there if static values are required.
- **Type safety and accessibility**: PASS — interaction changes must remain typed, preserve keyboard selection, keep button semantics for selectable map points, and retain visible focus states.
- **Performance and responsive delivery**: PASS — implementation should use lightweight transform-based map movement/zoom, avoid new images and new dependencies, and verify left-panel centering across responsive layouts.
- **Incremental validation**: PASS — P1 centering behavior and P2 repeated selection can be validated independently, followed by `npm run lint` and `npm run build`.
- **Dependency discipline**: PASS — no new dependencies are required; existing React, SVG, and CSS capabilities are sufficient.

## Project Structure

### Documentation (this feature)

```text
specs/001-map-point-centering/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-interaction-contract.md
└── tasks.md
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

**Structure Decision**: Use the existing single frontend application structure. The feature is localized to `src/components/ExplorePage.tsx` for interaction behavior and may use `src/data/explore.ts` if static map-centering values need to remain separated from presentation code.

## Complexity Tracking

No constitution violations or additional complexity are required.

## Phase 0 Research Summary

Research completed in [research.md](./research.md). Key decisions: use existing SVG point elements as the interaction source, make hover/click/keyboard selection share one active point/region behavior, calculate or store a point-aware map transform so the selected point centers in the left panel, and avoid new dependencies.

## Phase 1 Design Summary

Design artifacts completed:

- [data-model.md](./data-model.md)
- [contracts/ui-interaction-contract.md](./contracts/ui-interaction-contract.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- **Eco-tourism experience**: PASS — user journeys remain destination-discovery focused with no comparison flow added.
- **Content/data separation**: PASS — region data remains structured; any added centering metadata belongs with existing explore region/map data.
- **Type safety and accessibility**: PASS — contracts require click, hover, and keyboard selection with explicit active/focus behavior.
- **Performance and responsive delivery**: PASS — design specifies transform-oriented movement and responsive validation, with no additional assets.
- **Incremental validation**: PASS — quickstart defines isolated validation scenarios and required lint/build gates.
- **Dependency discipline**: PASS — no new dependencies are introduced.
