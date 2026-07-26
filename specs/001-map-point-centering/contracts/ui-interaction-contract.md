# UI Interaction Contract: map-point-centering

## Scope

This contract defines the user-visible behavior for Explore page map point selection. It is a UI contract, not an external API contract.

## Selectable Map Point Contract

### Inputs

A selectable map point accepts these user actions:

- Pointer hover over the point
- Pointer click/tap on the point
- Keyboard activation while the point has focus using Enter or Space

### Required Outcome

For each input, the Explore page must:

1. Mark that point as the active Selected Point.
2. Associate the active Explore Region with the point.
3. Smoothly zoom and pan the map so the selected point appears centered in the left map panel as closely as available map bounds allow.
4. Preserve selected focus until a different point is selected or the user leaves the Explore page.
5. Avoid creating a multi-point comparison state.

## Visual State Contract

- Selectable points must visually indicate that they are interactive.
- The active Selected Point must be distinguishable from inactive selectable points.
- Non-selectable points must not appear interactive.
- Re-selecting the same point must not produce duplicate active states or disorienting jumps.

## Accessibility Contract

- Selectable points must remain keyboard reachable.
- Keyboard users must be able to trigger the same selection outcome available to pointer users.
- Selectable points must expose meaningful labels that identify the point and associated region.
- Focus indicators must remain visible.

## Responsive Contract

- The left map panel is the centering reference area.
- On desktop, tablet, and mobile-responsive layouts, the selected point should be centered within the visible map panel as closely as possible.
- If layout dimensions change after a point is selected, the map should continue to keep the active point visually focused.

## Out of Scope

- Comparing multiple selected points.
- Persisting selection across page changes or sessions.
- Adding external map services.
- Changing tour package content or booking/contact flows.
