# Research: map-point-centering

## Decision: Use existing Explore page map and SVG point elements

**Rationale**: `src/components/ExplorePage.tsx` already renders the Vietnam SVG map, locates selectable `#label_points circle[id]` elements, and attaches click/keyboard handlers. Extending this path keeps the feature small, preserves current behavior, and avoids introducing new map libraries.

**Alternatives considered**:
- Replace the map with a map library: rejected because the current SVG already supports the needed point selection and a new dependency would violate dependency discipline without clear user value.
- Add separate overlay markers: rejected because duplicating markers risks mismatch with existing SVG points and increases maintenance.

## Decision: Treat hover, click, and keyboard activation as equivalent selection inputs

**Rationale**: The spec requires hover/click behavior and accessibility requires non-pointer users to remain supported. A shared selection outcome keeps behavior predictable: whichever supported input selects a point updates the same active focus state.

**Alternatives considered**:
- Hover-only zoom: rejected because it excludes touch and keyboard users.
- Click-only zoom: rejected because it does not satisfy the hover behavior requested.
- Separate hover preview and click selection states: rejected because comparison behavior is out of scope and separate states would add unnecessary complexity.

## Decision: Center the active point in the visible left panel using point-aware transform behavior

**Rationale**: Existing region-level `mapTransform` values zoom broad regions, but the feature asks for the selected point itself to be centered in the left panel. The design should derive the active point position from the SVG point or use structured point-centering metadata and apply a smooth transform so the selected point lands at the target panel center.

**Alternatives considered**:
- Keep existing region transforms only: rejected because a region transform may not center the exact selected point.
- Manually pan the container after selection: rejected because it is less predictable for responsive panel sizes.
- Add user-controlled zoom controls only: rejected because the requested behavior is automatic.

## Decision: Preserve active focus until another point is selected or the user leaves Explore

**Rationale**: This matches the specification and avoids disorienting changes when the pointer leaves a marker after hover. It also lets touch/click and keyboard users see a stable selected state.

**Alternatives considered**:
- Reset on pointer leave: rejected because it contradicts the selected-focus assumption and can create jumpy interactions.
- Reset after a timeout: rejected because it creates uncertainty and is not user-requested.

## Decision: No new external integrations, storage, or dependencies

**Rationale**: The feature only changes local UI behavior for existing map points. Existing project tools (`npm run lint`, `npm run build`) are enough for validation alongside manual interaction checks.

**Alternatives considered**:
- Store selected point in URL or persistent storage: rejected because persistence across sessions/pages is out of scope.
- Add automated browser tooling as a dependency: deferred to future quality improvements; not required for this planning phase.
