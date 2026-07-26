# Data Model: map-point-centering

## Entity: Map Point

Represents a selectable point rendered on the Explore page SVG map.

### Fields

- `id`: Unique SVG point identifier matching a province or mapped location.
- `provinceName`: Human-readable province/location name used for labels and accessibility text.
- `regionId`: Identifier of the associated Explore Region.
- `isSelectable`: Whether the point can trigger map focus behavior.
- `position`: The point location within the SVG coordinate space, derived from the rendered SVG point or equivalent static metadata.

### Relationships

- Belongs to one Explore Region.
- Can become the current Selected Point.

### Validation Rules

- A selectable Map Point must resolve to exactly one Explore Region.
- Non-selectable points must not expose active selection behavior.
- Selectable points must have accessible labels that identify the location and region.

## Entity: Explore Region

Existing structured data representing a tourism region and its related tour packages.

### Existing Fields Relevant to This Feature

- `id`: Unique region identifier.
- `label`: Region display name.
- `provinceIds`: SVG/province IDs associated with the region.
- `provinceNames`: Province names associated with the region.
- `mapTransform`: Existing region-level zoom transform.
- `packages`: Tour packages shown after region selection.

### Optional Added Field

- `pointFocusTransform` or equivalent centering metadata: Static value used only if direct SVG point position measurement is insufficient for reliable centering.

### Relationships

- Contains many Map Points through `provinceIds` and `provinceNames`.
- Contains many Explore Packages shown in the right-side content after selection.

## Entity: Selected Point

Represents the active map point currently used for visual focus.

### Fields

- `pointId`: ID of the selected Map Point.
- `regionId`: ID of the selected Explore Region.
- `selectionSource`: One of `hover`, `click`, or `keyboard`.
- `selectedAt`: Moment of selection for reasoning about latest interaction only; no persistence required.

### State Transitions

```text
No selected point
  └── user hovers/clicks/keyboard-activates selectable point → Point selected

Point selected
  ├── user selects different selectable point → New point selected
  ├── user selects same point again → Same point remains selected
  └── user leaves Explore page → Selection discarded
```

### Validation Rules

- Only one Selected Point may be active at a time.
- The Selected Point must drive both active visual styling and map centering.
- Selection must not create a comparison state or retain multiple active points.

## Entity: Explore Map View

Represents the visible map panel and transform state.

### Fields

- `activeTransform`: Current zoom/pan transform applied to the map view.
- `leftPanelBounds`: Current visible bounds of the left map panel.
- `targetCenter`: Center point of the visible left panel.
- `transitionState`: Whether the map is idle or transitioning.

### Validation Rules

- When a Selected Point exists, the active transform must position it as close as possible to `targetCenter` within map bounds.
- Transform changes should preserve usability near map edges.
- Responsive layout changes must still use the current left panel bounds for centering.
