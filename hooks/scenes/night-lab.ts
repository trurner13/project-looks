// Night lab bench: a school chemistry bench after
// hours, printed in dots, in the right-hand gutter, whole at any window size. A conical flask of blue
// liquid sits on a tripod and gauze over a Bunsen burner whose flame
// flickers; bubbles rise through the liquid and wisps of steam drift from the
// neck. A rack of test tubes stands beside it against a tiled wall.
// Colours: slate, lab blue,
// steel grey and warm cream.

import { away, gutter, Ink, openRoot, sheet, W } from '../ink.js'

const SLATE = '#1c2530'
const BLUE = '#1f6fb5'
const LIGHT_BLUE = '#5b9be0'
const GLASS = '#9fc4e8'
const STEEL = '#8a97a6'
const CREAM = '#fff3d6'

const BENCH_Y = 620

// Dots evenly along a straight line.
const line = (ink: Ink, x1: number, y1: number, x2: number, y2: number, step: number, r: number): void => {
  const n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / step))
  for (let i = 0; i <= n; i++) ink.add(x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n, r)
}

// The tiled wall behind the bench: a faint dot at every tile corner.
const wall = new Ink()
for (let y = 20; y < BENCH_Y; y += 46) for (let x = 0; x <= W; x += 46) wall.add(x, y, 1.3 * away(x))

// The bench: a top edge catching the light and a dotted front.
const benchTop = new Ink()
line(benchTop, 960, BENCH_Y, 1460, BENCH_Y, 7, 2)
const benchFront = new Ink()
for (let y = BENCH_Y + 14; y < BENCH_Y + 90; y += 12) for (let x = 960 + ((y / 12) % 2) * 6; x <= 1460; x += 12) benchFront.add(x, y, 1.2)

// The Bunsen burner: a base, a tube shaded like metal, and its collar.
const BURNER = { x: 1310 }
const burner = new Ink()
for (let y = BENCH_Y - 18; y <= BENCH_Y - 2; y += 6)
  for (let x = BURNER.x - 46; x <= BURNER.x + 46; x += 6) burner.add(x, y, 1.6 + 1.2 * (1 - Math.abs(x - BURNER.x) / 46))
for (let y = BENCH_Y - 130; y < BENCH_Y - 18; y += 6)
  for (let x = BURNER.x - 12; x <= BURNER.x + 12; x += 6) burner.add(x, y, 1.2 + 1.6 * Math.max(0, 1 - Math.abs(x - BURNER.x + 4) / 12))
line(burner, BURNER.x - 16, BENCH_Y - 70, BURNER.x + 16, BENCH_Y - 70, 5, 2.2)

// The flame: three shapes that take turns, so it flickers.
const FLAME_BASE = BENCH_Y - 136
const flame = (height: number, lean: number): { outer: string; inner: string } => {
  const outer = new Ink()
  const inner = new Ink()
  for (let y = 0; y < height; y += 6) {
    const t = y / height
    const half = 16 * Math.sin(Math.PI * Math.min(1, (1 - t) * 1.1)) * (1 - t * 0.4)
    const cx = BURNER.x + lean * t * t
    for (let x = -half; x <= half; x += 6) outer.add(cx + x, FLAME_BASE - y, 2.2 * (1 - t * 0.5))
    if (t < 0.45) for (let x = -half * 0.4; x <= half * 0.4; x += 5) inner.add(cx + x, FLAME_BASE - y, 2)
  }
  return { outer: outer.print(), inner: inner.print() }
}
const FLAMES = [flame(78, -4), flame(70, 6), flame(84, 2)]

// The tripod and its gauze.
const GAUZE_Y = BENCH_Y - 230
const tripod = new Ink()
line(tripod, BURNER.x - 120, BENCH_Y, BURNER.x - 92, GAUZE_Y, 8, 2)
line(tripod, BURNER.x + 120, BENCH_Y, BURNER.x + 92, GAUZE_Y, 8, 2)
line(tripod, BURNER.x - 20, BENCH_Y - 10, BURNER.x - 8, GAUZE_Y, 8, 1.6)
const gauze = new Ink()
for (let x = BURNER.x - 110; x <= BURNER.x + 110; x += 6) {
  gauze.add(x, GAUZE_Y, 2.2)
  gauze.add(x + 3, GAUZE_Y + 5, 1.2)
}

// The conical flask on the gauze: glass outline, a sheen, and liquid.
const FLASK = { base: GAUZE_Y - 4, halfBase: 92, shoulder: GAUZE_Y - 170, halfNeck: 22, top: GAUZE_Y - 230 }
const halfAt = (y: number): number =>
  y <= FLASK.shoulder ? FLASK.halfNeck : FLASK.halfNeck + ((FLASK.halfBase - FLASK.halfNeck) * (y - FLASK.shoulder)) / (FLASK.base - FLASK.shoulder)
const glass = new Ink()
line(glass, BURNER.x - FLASK.halfBase, FLASK.base, BURNER.x + FLASK.halfBase, FLASK.base, 7, 1.8)
for (const side of [-1, 1]) {
  line(glass, BURNER.x + side * FLASK.halfBase, FLASK.base, BURNER.x + side * FLASK.halfNeck, FLASK.shoulder, 7, 1.8)
  line(glass, BURNER.x + side * FLASK.halfNeck, FLASK.shoulder, BURNER.x + side * FLASK.halfNeck, FLASK.top, 7, 1.8)
}
line(glass, BURNER.x - FLASK.halfNeck - 6, FLASK.top, BURNER.x + FLASK.halfNeck + 6, FLASK.top, 6, 2)
const sheen = new Ink()
line(sheen, BURNER.x - FLASK.halfBase + 26, FLASK.base - 18, BURNER.x - FLASK.halfNeck + 6, FLASK.shoulder + 20, 9, 2.4)

const LIQUID_TOP = FLASK.base - 96
const liquid = new Ink()
for (let y = LIQUID_TOP; y < FLASK.base - 4; y += 7) {
  const half = halfAt(y) - 8
  const depth = (y - LIQUID_TOP) / (FLASK.base - LIQUID_TOP)
  for (let x = -half; x <= half; x += 7) liquid.add(BURNER.x + x, y, 1.6 + 1.6 * depth)
}
const surface = new Ink()
line(surface, BURNER.x - halfAt(LIQUID_TOP) + 8, LIQUID_TOP, BURNER.x + halfAt(LIQUID_TOP) - 8, LIQUID_TOP, 6, 2.2)

// Bubbles: small clusters that rise through the liquid, each on its own clock.
const bubble = (dx: number, size: number): string => {
  const ink = new Ink()
  ink.add(BURNER.x + dx, FLASK.base - 12, size)
  return ink.print()
}
const BUBBLES = [
  { dx: -30, size: 4, seconds: 3.2, delay: 0 },
  { dx: 12, size: 3, seconds: 2.6, delay: -1.1 },
  { dx: 40, size: 3.6, seconds: 3.8, delay: -2.3 },
  { dx: -6, size: 2.6, seconds: 2.2, delay: -0.6 },
  { dx: 26, size: 4.4, seconds: 4.2, delay: -3 },
]
const RISE = FLASK.base - 12 - LIQUID_TOP

// Steam drifting up from the neck.
const steam = (dx: number): string => {
  const ink = new Ink()
  for (let k = 0; k < 4; k++) ink.add(BURNER.x + dx + Math.sin(k) * 6, FLASK.top - 10 - k * 14, 3.2 - k * 0.6)
  return ink.print()
}

// A rack of test tubes to the left.
const RACK = { x: 1010, y: BENCH_Y }
const rack = new Ink()
line(rack, RACK.x - 20, RACK.y - 4, RACK.x + 200, RACK.y - 4, 6, 2)
line(rack, RACK.x - 20, RACK.y - 60, RACK.x + 200, RACK.y - 60, 6, 2)
line(rack, RACK.x - 20, RACK.y - 60, RACK.x - 20, RACK.y - 4, 6, 2)
line(rack, RACK.x + 200, RACK.y - 60, RACK.x + 200, RACK.y - 4, 6, 2)
const TUBES = ['#ff6b8a', CREAM, '#45d6a4', LIGHT_BLUE]
const tubeGlass = new Ink()
const tubeLiquids = TUBES.map(() => new Ink())
TUBES.forEach((_, i) => {
  const x = RACK.x + 20 + i * 50
  line(tubeGlass, x - 11, RACK.y - 170, x - 11, RACK.y - 20, 7, 1.5)
  line(tubeGlass, x + 11, RACK.y - 170, x + 11, RACK.y - 20, 7, 1.5)
  for (let a = 0; a <= Math.PI; a += 0.4) tubeGlass.add(x + Math.cos(a) * 11, RACK.y - 20 + Math.sin(a) * 10, 1.5)
  const fill = RACK.y - 70 - i * 14
  for (let y = fill; y < RACK.y - 14; y += 6) for (let dx = -6; dx <= 6; dx += 6) tubeLiquids[i]?.add(x + dx, y, 2)
})

// The bench, rack, burner and flask, kept whole in the right-hand gutter.
const ART = gutter('art', 'right', { x: 960, y: 40, w: 500, h: 660 }, `<g class="bf">${benchFront.print()}</g>
<g class="bt">${benchTop.print()}</g>
<g class="rk">${rack.print()}</g>
${tubeLiquids.map((ink, i) => `<g class="t${i}">${ink.print()}</g>`).join('')}
<g class="tg">${tubeGlass.print()}</g>
<g class="tp">${tripod.print()}</g>
<g class="bn">${burner.print()}</g>
${FLAMES.map((f, i) => `<g class="fl f${i}"><g class="fo">${f.outer}</g><g class="fi">${f.inner}</g></g>`).join('')}
<g class="gz">${gauze.print()}</g>
<g class="lq">${liquid.print()}</g>
<g class="sf">${surface.print()}</g>
${BUBBLES.map(b => `<g class="bb" style="animation-duration:${b.seconds}s;animation-delay:${b.delay}s">${bubble(b.dx, b.size)}</g>`).join('')}
<g class="gl">${glass.print()}</g>
<g class="sh">${sheen.print()}</g>
<g class="sm">${steam(-6)}</g>
<g class="sm" style="animation-delay:-3s">${steam(8)}</g>
`, 1.15)

export const NIGHT_LAB_SVG = `${openRoot()}
<style>
path{fill:none;stroke-linecap:round}
.bg{fill:#121920}
.wl path{stroke:#1f2934}
.bt path{stroke:#51606f}
.bf path{stroke:${SLATE}}
.bn path{stroke:${STEEL}}
.fo path{stroke:#4f9cff}
.fi path{stroke:#cfe6ff}
.fl{opacity:0;animation:flick .9s steps(1) infinite}
.f1{animation-delay:-.3s}.f2{animation-delay:-.6s}
@keyframes flick{0%{opacity:1}33%{opacity:0}}
.tp path{stroke:#51606f}
.gz path{stroke:${STEEL}}
.gl path{stroke:${GLASS};opacity:.85}
.sh path{stroke:#e8f0f8;opacity:.5}
.lq path{stroke:${BLUE}}
.sf path{stroke:${LIGHT_BLUE}}
.bb path{stroke:#cfe3f5}
.bb{animation-name:rise;animation-timing-function:steps(24);animation-iteration-count:infinite}
@keyframes rise{from{transform:translateY(0);opacity:1}90%{opacity:1}to{transform:translateY(-${RISE}px);opacity:0}}
.sm path{stroke:${GLASS}}
.sm{animation:steam 6s steps(36) infinite}
@keyframes steam{from{transform:translateY(0);opacity:.6}to{transform:translateY(-60px);opacity:0}}
.rk path{stroke:#51606f}
.tg path{stroke:${GLASS};opacity:.7}
${TUBES.map((c, i) => `.t${i} path{stroke:${c}}`).join('')}
${ART.css}
</style>
<rect class="bg" width="100%" height="100%"/>
${sheet(`<g class="wl">${wall.print()}</g>`)}
${ART.svg}
</svg>`
