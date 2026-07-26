# Gia Lai Eco Tourist

A Vite + React + TypeScript landing page for Gia Lai eco-tour experiences.

## Project structure

```text
src/
  assets/        Static images imported by the app
  data/          Page content and marketing data
  App.tsx        Main landing page component
  index.css      Tailwind theme and global styles
  main.tsx       React app entry point
```

## Requirements

- Node.js 20+
- npm

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Notes

- The `@/*` import alias points to `src/*`.
- App content lives in `src/data/homepage.ts` so marketing copy can be maintained separately from the main component.
- Project governance lives in `.specify/memory/constitution.md`; changes must preserve eco-tourism positioning, accessibility, responsive performance, and validation with `npm run lint` plus `npm run build`.
