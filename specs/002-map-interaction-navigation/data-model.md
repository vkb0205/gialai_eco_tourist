# Data Model: Interactive Map Navigation

## Province

Represents a selectable geographic area on the map.

**Fields**
- `id`: stable province/map region identifier
- `name`: display name shown to travelers
- `regionId`: grouping or map-region identity
- `aliases[]`: alternate spellings or labels used by search
- `neighbors[]`: optional directional adjacency references
- `isHovered`: transient UI state
- `isSelected`: persistent selection state
- `isFocused`: map focus state tied to explicit selection

**Validation rules**
- `id` and `name` are required and must be non-empty.
- `aliases` must not duplicate the canonical `name`.
- `isSelected` and `isFocused` should move together when selection is explicit.

## Destination

Represents a tourism place or province-level search target exposed through filtering.

**Fields**
- `id`: stable destination identifier
- `name`: primary searchable label
- `provinceId`: owning province reference
- `aliases[]`: alternate search labels, categories, or friendly names
- `summary`: short visitor-facing description
- `isSelectable`: whether the destination should appear in filter results

**Validation rules**
- `name` is required.
- `provinceId` must reference an existing `Province`.
- At least one searchable label must exist across `name` and `aliases`.

## MapSelectionState

Represents the current interaction context of the map.

**Fields**
- `selectedProvinceId`: currently selected province, if any
- `focusedProvinceId`: province controlling map focus, if any
- `hoveredProvinceId`: transient hover target, if any
- `directionalNavigationEnabled`: derived boolean
- `mapTransform`: current visual pan/zoom transform

**Rules / transitions**
- Hovering a province updates only `hoveredProvinceId` and visual hover state.
- Clicking or keyboard-activating a province sets `selectedProvinceId`, `focusedProvinceId`, and a focused map transform.
- Clearing selection resets the focus transform and disables directional controls.
- Directional controls update `mapTransform` without clearing the selected province.

## FilterQuery

Represents a typed or chosen destination search intent.

**Fields**
- `inputText`: raw user text
- `normalizedText`: trimmed/case-folded search term used for matching
- `matches[]`: ordered list of candidate destinations/provinces
- `noResults`: boolean indicating empty match state
- `selectedResultId`: chosen destination or province from the results list

**Validation rules**
- Empty input should not create false matches.
- Matching should tolerate casing and extra whitespace.
- Search results must always remain selectable by keyboard.

## Relationships

- A `Province` can contain zero or more `Destination` records.
- `MapSelectionState.selectedProvinceId` points to one `Province` at a time.
- A filter result selection updates the same map selection/focus state used by manual province clicks.

## State summary

- **Idle**: no selected province, no focused map region.
- **Hovered**: one province has temporary preview styling only.
- **Selected/Focused**: one province is the persistent active target and directional controls are available.
- **Filtered selection**: a search result becomes the selected/focused province or destination and reuses the same active state.