/**
 * Illustrated page-header backdrop drawn in code: pale sky, sun, clouds and
 * layered Highland hills. No photograph is needed, so it is always bright,
 * loads instantly and stays sharp at any width.
 */
export default function PageBackdrop() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 -z-10 h-full w-full"
    >
      <rect width="1440" height="420" fill="#e1f2f8" />

      {/* Sun with a soft halo */}
      <circle cx="1190" cy="150" r="120" fill="#fff3b8" />
      <circle cx="1190" cy="150" r="74" fill="#fed24f" />

      {/* Clouds */}
      <g fill="#ffffff">
        <ellipse cx="260" cy="120" rx="90" ry="26" />
        <ellipse cx="320" cy="100" rx="60" ry="30" />
        <ellipse cx="780" cy="80" rx="110" ry="24" />
        <ellipse cx="850" cy="62" rx="64" ry="28" />
        <ellipse cx="1370" cy="250" rx="80" ry="20" />
      </g>

      {/* Far, middle and near hills */}
      <path
        d="M0 300 C120 250 220 240 340 275 C470 312 560 230 700 225 C850 220 940 290 1080 270 C1220 250 1330 215 1440 250 L1440 420 L0 420 Z"
        fill="#d2edc4"
      />
      <path
        d="M0 340 C150 300 260 320 390 335 C540 352 640 290 790 300 C940 310 1040 350 1190 335 C1300 324 1380 300 1440 310 L1440 420 L0 420 Z"
        fill="#a6dc97"
      />
      <path
        d="M0 385 C180 360 330 372 500 382 C700 394 820 356 1010 366 C1180 375 1320 392 1440 372 L1440 420 L0 420 Z"
        fill="#79c46c"
      />
    </svg>
  )
}
