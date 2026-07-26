# Research: Interactive Map Navigation

## 1) Map focus must only occur on explicit selection

- **Decision**: Keep hover as preview-only and move all focus/pan/zoom changes behind click or keyboard activation.
- **Rationale**: The spec explicitly rejects accidental movement on hover and requires predictable selection behavior.
- **Alternatives considered**:
  - Focus on hover for faster exploration — rejected because it violates FR-002 and creates confusing movement.
  - Auto-focus on initial load — rejected because it violates FR-001 unless there is an explicit prior selection.

## 2) Preserve the existing SVG-driven map interaction model

- **Decision**: Reuse the current SVG province/path map and interaction state rather than introducing a map library.
- **Rationale**: The repository already ships with a raw SVG map and typed explore data, so the feature can stay lightweight and dependency-free.
- **Alternatives considered**:
  - Add a dedicated map visualization library — rejected because it adds cost and is unnecessary for province-level selection.
  - Rebuild the map as canvas/WebGL — rejected because it increases complexity without improving the required UI behavior.

## 3) Directional navigation should operate from the selected province context

- **Decision**: Model up/down/left/right controls as map movement relative to the currently focused province, with disabled/inactive states until a province is selected.
- **Rationale**: The spec states the controls are available only after the main province is focused and should move the visible map area by a consistent amount.
- **Alternatives considered**:
  - Make arrows cycle through provinces — rejected because the requirement is map navigation, not province switching by default.
  - Always enable arrows — rejected because it obscures the dependency on a selected focus target.

## 4) Destination filtering should use structured searchable data

- **Decision**: Store provinces, aliases, and destination records in structured data and search them with normalized matching (trim, case fold, accent-insensitive where practical).
- **Rationale**: The feature must avoid duplicated copy in presentation markup and support reasonable matching for misspellings/casing/spacing.
- **Alternatives considered**:
  - Hardcode filter options in the component — rejected because it duplicates content and scales poorly.
  - Use a backend search service — rejected because the feature scope is client-side discovery only.

## 5) Validate through existing repo scripts and manual interaction checks

- **Decision**: Use `npm run lint` and `npm run build` plus manual browser validation for hover, click, keyboard, filter, and scroll scenarios.
- **Rationale**: The constitution requires TypeScript validation and the feature is UI-heavy, so end-to-end interaction checks are essential.
- **Alternatives considered**:
  - Add a new automated E2E stack during planning — rejected because no new dependencies are needed for the design phase.