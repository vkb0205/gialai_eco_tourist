# Quickstart: Interactive Map Navigation

This guide validates the interactive map behavior end-to-end.

## Prerequisites

- Node.js and npm installed
- Repository dependencies installed with `npm install`

## Validation steps

### 1) Type-check and build

```bash
npm run lint
npm run build
```

**Expected outcome**: both commands complete successfully with no TypeScript or production build errors.

### 2) Start the app

```bash
npm run dev
```

Open the local Vite URL shown in the terminal.

### 3) Verify initial map state

- Load the interactive map.
- Confirm no province is highlighted as selected on load.
- Confirm the map does not auto-focus or pan before interaction.

**Expected outcome**: the map is idle, with no automatic selected province.

### 4) Verify hover versus click behavior

- Move the pointer across several provinces.
- Confirm only the currently hovered province gets temporary hover styling.
- Confirm the map view does not shift on hover.
- Click a province.

**Expected outcome**: click applies persistent selection and focus, while hover remains temporary.

### 5) Verify directional controls

- With no province selected, inspect the up/down/left/right controls.
- Select a province.
- Activate each directional control one at a time.

**Expected outcome**: controls are inactive or clearly unavailable until selection, then move the map consistently without clearing selection.

### 6) Verify filter search

- Open the filter bar/button.
- Type part of a province or destination name.
- Select a matching result.
- Try a query with extra spaces or different casing.
- Try a query with no match.

**Expected outcome**: matching results appear, a chosen result selects and focuses the map, and no-match input shows clear feedback.

### 7) Verify keyboard and scrolling behavior

- Tab through the filter, map controls, and selectable map regions.
- Use Enter/Space to activate selection where supported.
- Scroll the page after interacting with the map.

**Expected outcome**: every interactive element is reachable by keyboard, focus is visible, and the page remains scrollable outside the map.

## References

- Data model: [data-model.md](./data-model.md)
- Interaction contract: [contracts/ui-interaction-contract.md](./contracts/ui-interaction-contract.md)