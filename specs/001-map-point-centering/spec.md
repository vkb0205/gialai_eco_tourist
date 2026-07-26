# Feature Specification: map-point-centering

**Feature Branch**: `[001-map-point-centering]`

**Created**: 2026-07-27

**Status**: Draft

**Input**: User description: "In the interactive map in the explore page, I want when I hover/click a point on the map, it will automatically zoom in a way that that point will be in the center of the left panel."

## Clarifications

### Session 2026-07-27

- Q: Should the feature support comparing map points as a user goal? → A: No comparison behavior is in scope.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Center selected map point (Priority: P1)

As a visitor exploring destinations, I want a point on the map to automatically become the visual focus when I hover or click it, so that I can inspect the selected location without losing context.

**Why this priority**: This is the core interaction requested and directly improves discoverability of locations on the explore page.

**Independent Test**: Can be tested by hovering or clicking any interactive map point and confirming the map recenters and zooms so the selected point appears centered in the left panel.

**Acceptance Scenarios**:

1. **Given** the explore page is open and the map shows multiple points, **When** the user hovers over a point, **Then** the map smoothly zooms and recenters so that point is positioned in the center of the left panel.
2. **Given** the explore page is open and the user clicks a point, **Then** the same recentering and zoom behavior occurs and the selected point remains the focus until another point is selected.

---

### User Story 2 - Support repeated point selection (Priority: P2)

As a visitor exploring destinations, I want to move focus from one point to another without manual map repositioning, so that I can review several locations quickly.

**Why this priority**: This supports efficient exploration after the primary centering behavior works.

**Independent Test**: Can be tested by selecting two different points in sequence and confirming each one becomes the centered focus.

**Acceptance Scenarios**:

1. **Given** one point is already centered, **When** the user hovers or clicks another point, **Then** focus shifts to the new point and the map recenters accordingly.

---

### Edge Cases

- Hovering over a point while already centered on another point should switch focus predictably without requiring a page refresh.
- Clicking the same point repeatedly should not create disorienting jumps or duplicate focus states.
- If a point is near the edge of the visible area, the map should still center that point as closely as possible while remaining usable.
- If the user moves the pointer away after hovering, the page should preserve the selected focus until another interaction changes it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The explore page MUST visually center the selected map point within the left panel when the user hovers over or clicks that point.
- **FR-002**: The map MUST zoom in automatically when a point is selected, using a smooth transition that helps the user follow the change in focus.
- **FR-003**: The centering behavior MUST work for repeated selections of different points without requiring manual panning or zoom controls.
- **FR-004**: The selected point MUST remain the active focus until the user selects a different point or leaves the explore page.
- **FR-005**: The interaction MUST remain understandable and usable on responsive layouts where the left panel size changes across screen sizes.
- **FR-006**: The feature MUST preserve keyboard-accessible navigation and not block non-pointer users from using the explore page.

### Key Entities *(include if feature involves data)*

- **Map Point**: A location marker shown on the explore map, representing a destination or place of interest.
- **Selected Point**: The currently focused map point that triggers centering and zoom behavior.
- **Explore Map View**: The visible map area and left panel layout that present the selected point and surrounding context.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of test users can center a chosen point on the first attempt by hovering or clicking a point on the explore map.
- **SC-002**: At least 85% of test users report that the zoom-and-center transition makes the selected point clearly identifiable without extra map adjustments.
- **SC-003**: Users can switch focus between two different points in under 5 seconds without losing orientation.
- **SC-004**: In usability testing, fewer than 10% of users report confusion about which point is currently selected after the map recenters.

## Assumptions

- The feature applies only to the explore page map interaction and does not change other pages.
- Hover and click both trigger the same selection focus behavior unless a device cannot support hover.
- The left panel is the reference area for centering, and the selected point should be brought into the middle of that visible panel as much as the available map bounds allow.
- Existing destination points already appear on the map and are available for selection.
