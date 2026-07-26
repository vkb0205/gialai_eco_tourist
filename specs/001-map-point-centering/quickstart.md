# Quickstart: map-point-centering

## Prerequisites

- Install project dependencies with `npm install` if they are not already installed.
- Use the active feature documentation in `specs/001-map-point-centering/`.

## Run Locally

```bash
npm run dev
```

Open the local Vite URL and navigate to the Explore page.

## Validation Scenario 1: Hover centers a point

1. Open the Explore page.
2. Hover over a selectable point on the map.
3. Expected outcome: the map smoothly zooms/recenters and the hovered point appears centered in the left map panel.
4. Expected outcome: the point is visually marked as the active focus.

## Validation Scenario 2: Click centers and preserves focus

1. Open the Explore page.
2. Click a selectable point.
3. Move the pointer away.
4. Expected outcome: the selected point remains the active focus and remains centered as closely as possible.
5. Expected outcome: no comparison or multi-point selected state appears.

## Validation Scenario 3: Repeated selection changes focus

1. Select one map point.
2. Select a different map point.
3. Expected outcome: focus moves to the new point and the map recenters on it.
4. Expected outcome: only one point is active.

## Validation Scenario 4: Keyboard accessibility

1. Navigate to the map points using keyboard controls.
2. Activate a selectable point with Enter or Space.
3. Expected outcome: the same zoom-and-center behavior occurs.
4. Expected outcome: visible focus and active state remain understandable.

## Validation Scenario 5: Responsive behavior

1. Repeat hover/click selection at desktop, tablet, and mobile-sized viewports.
2. Expected outcome: the selected point is centered within the visible map panel as closely as available bounds allow.
3. Expected outcome: primary Explore content remains accessible and no layout shift hides key content.

## Quality Gates

Run before implementation completion:

```bash
npm run lint
npm run build
```

Both commands should complete successfully. If either fails, fix the issue before release or document the blocker, owner, and mitigation.
