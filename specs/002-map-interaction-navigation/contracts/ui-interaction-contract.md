# UI Interaction Contract: Interactive Map Navigation

## Scope

Defines the user-facing contract for province hover, explicit selection/focus, directional navigation, destination filtering, keyboard access, and scroll behavior.

## Interactive elements

### Province region

**Inputs**
- Pointer hover
- Pointer click/tap
- Keyboard focus and activation where a province is keyboard-selectable

**Behavior**
- Hover previews only the current province.
- Hover must not pan, zoom, focus, or select the map.
- Click/tap or keyboard activation selects and focuses that province.
- Clicking non-province space must not create a selection.

**Required states**
- Idle
- Hovered
- Selected/focused
- Keyboard focus-visible

## Directional controls

**Controls**
- Up
- Down
- Left
- Right

**Behavior**
- Controls are disabled or visually inactive when no province is selected.
- Controls become available after explicit province selection or filter-result selection.
- Activating a control moves the visible map area in the requested direction by a consistent amount.
- Reaching a map boundary stops movement gracefully and exposes an understandable inactive/boundary state.
- Navigation does not clear selected province state.

## Destination filter

**Inputs**
- Text typed by the user
- Optional choice from a list of provinces/destinations
- Keyboard navigation through the result list

**Behavior**
- Empty input shows neutral guidance.
- Matching input displays selectable province or destination results.
- Selecting a result applies the same selected/focused map state as clicking the matching province.
- No-match input displays clear feedback and allows revision.

**Matching requirements**
- Matching must tolerate casing differences and extra whitespace.
- Accent-insensitive matching should be supported where practical for Vietnamese destination names.
- Result data must come from structured destination/map data.

## Accessibility contract

- All province selection paths, directional controls, filter inputs, and filter results must be keyboard reachable.
- Focus states must be visible.
- Controls must have meaningful accessible names.
- Hover and selected states must not rely on color alone.
- Disabled and boundary states must be communicated visually and semantically where possible.

## Scroll/navigation contract

- The map may support internal navigation and scrolling/panning within expected boundaries.
- Page scroll must remain possible after map interaction.
- The map must not trap keyboard focus or pointer/touch scrolling indefinitely.

## Acceptance mapping

- FR-001 through FR-006: Province initial, hover, selected, and visual-state behavior.
- FR-007 through FR-009: Directional controls and keyboard accessibility.
- FR-010 through FR-012: Destination filter behavior.
- FR-013 through FR-015: Responsive navigation, page scroll freedom, and structured data requirements.