/**
 * Hero landscape painted in code: a Gia Lai highland at golden hour. A soft
 * sky with drifting cloud, the volcanic cone of Hàm Rồng lit by the low sun,
 * layered blue ridges dissolving into mist, terraced tea hills with curved
 * planting rows, and a foreground that darkens toward the bottom
 * so the white captions stay readable. Everything is vector, so it stays
 * sharp at any size; the only motion is a slow mist drift (off when the
 * visitor prefers reduced motion).
 */

type Point = [number, number]

const W = 1440
const H = 900

function seeded(seed: number) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return value / 2147483647
  }
}

/** Gentle, smooth ridge line: a few random control points, then interpolated. */
function ridge(
  seed: number,
  baseY: number,
  amplitude: number,
  count = 9,
  peak?: { x: number; height: number; width: number },
): Point[] {
  const random = seeded(seed)
  const raw = Array.from({ length: count + 1 }, () => (random() - 0.5) * amplitude)
  const points: Point[] = []
  const samples = 160
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * count
    const k = Math.min(count - 1, Math.floor(t))
    const f = t - k
    const s = f * f * (3 - 2 * f) // smoothstep between control points
    const x = (i / samples) * W
    let y = baseY + raw[k] * (1 - s) + raw[k + 1] * s
    // fine natural jitter so edges are not CG-smooth
    y += (random() - 0.5) * amplitude * 0.05
    if (peak) {
      const d = (x - peak.x) / peak.width
      y -= peak.height * Math.exp(-d * d)
    }
    points.push([x, y])
  }
  return points
}

function line(points: Point[]) {
  return points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")
}

function area(points: Point[], bottom = H + 20) {
  return `M-40 ${bottom} L-40 ${points[0][1].toFixed(1)} ${line(points).replace("M", "L")} L${W + 40} ${points[points.length - 1][1].toFixed(1)} L${W + 40} ${bottom} Z`
}

function shift(points: Point[], dy: number): Point[] {
  return points.map(([x, y]) => [x, y + dy] as Point)
}

/** Hàm Rồng: a broad volcanic cone with a flat, slightly dished crater rim. */
const cone: Point[] = (() => {
  const base = ridge(5, 600, 22, 8)
  return base.map(([x, y]) => {
    const d = (x - 1010) / 290
    const body = 270 * Math.exp(-Math.pow(Math.abs(d), 1.55))
    const crater = 16 * Math.exp(-Math.pow((x - 1010) / 46, 2))
    return [x, y - body + crater] as Point
  })
})()

const farRidge = ridge(11, 520, 70, 7)
const blueRidge = ridge(23, 585, 56, 8)
const midRidge = ridge(37, 640, 46, 8)
const teaHill = ridge(51, 690, 40, 6, { x: 360, height: 40, width: 260 })
const teaHill2 = ridge(71, 745, 34, 6, { x: 1120, height: 34, width: 300 })
const fore = ridge(83, 830, 24, 6)

const teaRows = (hill: Point[], count: number, gap: number) =>
  Array.from({ length: count }, (_, i) => line(shift(hill, 10 + i * gap)))

export default function HeroBackdrop() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 -z-10 h-full w-full"
    >
      <defs>
        <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fb8e6" />
          <stop offset="0.38" stopColor="#bfdcee" />
          <stop offset="0.62" stopColor="#f3ebd2" />
          <stop offset="0.8" stopColor="#fbd9a2" />
          <stop offset="1" stopColor="#f6c585" />
        </linearGradient>
        <radialGradient id="hs-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffbe6" stopOpacity="1" />
          <stop offset="0.2" stopColor="#ffeab0" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hs-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9c6da" />
          <stop offset="1" stopColor="#d8e6ea" />
        </linearGradient>
        <linearGradient id="hs-cone" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#5f8499" />
          <stop offset="0.55" stopColor="#7fa2ad" />
          <stop offset="1" stopColor="#d9b88a" />
        </linearGradient>
        <linearGradient id="hs-lit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffe2a0" stopOpacity="0" />
          <stop offset="1" stopColor="#ffd48a" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="hs-blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ea39f" />
          <stop offset="1" stopColor="#b9cdc0" />
        </linearGradient>
        <linearGradient id="hs-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f8a6a" />
          <stop offset="1" stopColor="#8fb383" />
        </linearGradient>
        <linearGradient id="hs-tea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fb35a" />
          <stop offset="1" stopColor="#3f8447" />
        </linearGradient>
        <linearGradient id="hs-tea2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c9150" />
          <stop offset="1" stopColor="#235a35" />
        </linearGradient>
        <linearGradient id="hs-fore" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f5535" />
          <stop offset="1" stopColor="#0f2e1d" />
        </linearGradient>
        <radialGradient id="hs-mist" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6dd" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff6dd" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hs-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.7" stopColor="#0b2616" stopOpacity="0" />
          <stop offset="1" stopColor="#0b2616" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="hs-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="hs-cloud-mask">
          <rect width={W} height="460" fill="url(#hs-fade)" />
        </mask>
        <filter id="hs-clouds" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0032 0.012" numOctaves="5" seed="14" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.4 -0.95" />
        </filter>
        <filter id="hs-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 -0.35" />
        </filter>
        <clipPath id="hs-clip-tea">
          <path d={area(teaHill)} />
        </clipPath>
        <clipPath id="hs-clip-tea2">
          <path d={area(teaHill2)} />
        </clipPath>
        <clipPath id="hs-clip-cone">
          <path d={area(cone)} />
        </clipPath>
      </defs>

      {/* Sky, sun glow, cloud */}
      <rect width={W} height={H} fill="url(#hs-sky)" />
      <circle cx="1040" cy="400" r="460" fill="url(#hs-sun)" />
      <g mask="url(#hs-cloud-mask)">
        <rect width={W} height="460" filter="url(#hs-clouds)" opacity="0.8" />
      </g>

      {/* Distant ridge and the volcanic cone, lit from the sun side */}
      <path d={area(farRidge)} fill="url(#hs-far)" />
      <path d={area(cone)} fill="url(#hs-cone)" />
      <g clipPath="url(#hs-clip-cone)">
        <rect x="900" y="260" width="560" height="360" fill="url(#hs-lit)" />
      </g>
      <ellipse
        cx="1040"
        cy="590"
        rx="700"
        ry="60"
        fill="url(#hs-mist)"
        className="motion-safe:animate-[hero-drift_44s_ease-in-out_infinite_alternate]"
      />
      <path d={area(blueRidge)} fill="url(#hs-blue)" />
      <path d={area(midRidge)} fill="url(#hs-mid)" />
      <ellipse
        cx="560"
        cy="660"
        rx="640"
        ry="50"
        fill="url(#hs-mist)"
        opacity="0.8"
        className="motion-safe:animate-[hero-drift_56s_ease-in-out_infinite_alternate-reverse]"
      />

      {/* Terraced tea hills with curved planting rows */}
      <path d={area(teaHill)} fill="url(#hs-tea)" />
      <g clipPath="url(#hs-clip-tea)" fill="none" stroke="#2f6e3d" strokeOpacity="0.35" strokeWidth="2.4">
        {teaRows(teaHill, 12, 13).map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g clipPath="url(#hs-clip-tea)" fill="none" stroke="#d8efa0" strokeOpacity="0.22" strokeWidth="1.2">
        {teaRows(teaHill, 12, 13).map((d, i) => (
          <path key={i} d={d} transform="translate(0 5)" />
        ))}
      </g>

      <path d={area(teaHill2)} fill="url(#hs-tea2)" />
      <g clipPath="url(#hs-clip-tea2)" fill="none" stroke="#173f27" strokeOpacity="0.35" strokeWidth="2.6">
        {teaRows(teaHill2, 9, 15).map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g clipPath="url(#hs-clip-tea2)" fill="none" stroke="#b9e08a" strokeOpacity="0.2" strokeWidth="1.2">
        {teaRows(teaHill2, 9, 15).map((d, i) => (
          <path key={i} d={d} transform="translate(0 6)" />
        ))}
      </g>

      {/* Foreground, darkening toward the captions */}
      <path d={area(fore)} fill="url(#hs-fore)" />
      <rect width={W} height={H} fill="url(#hs-shade)" />

      {/* Film grain ties the layers together */}
      <rect width={W} height={H} filter="url(#hs-grain)" opacity="0.14" style={{ mixBlendMode: "multiply" }} />
    </svg>
  )
}
