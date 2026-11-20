// Cyanotype, from the game perigee:
// the world as a blueprint in Prussian blues and white lines. In the right
// band, an orbit plot: a planet at one focus of a dotted orbit, a craft going
// round it, and "Pe" lighting up each time the craft passes perigee. In the
// left band, the drop pod as a white-line technical drawing with dimension
// lines, slowly redrawing itself. The middle stays plain blueprint paper.

import { away, gutter, H, Ink, openRoot, sheet, sphere, W } from '../ink.js'

const PAPER = '#10243a'
const GRID = '#24507A'
const LINE = '#e8f1fa'
const SOFT = '#8fb3d9'
const PLANET = '#3f78b5'

// A faint blueprint grid: crosses at every intersection, only in the side bands.
const grid = new Ink()
for (let y = 20; y <= H; y += 50) {
  for (let x = 20; x <= W; x += 50) {
    const k = away(x)
    if (k < 0.05) continue
    grid.add(x, y, 1.6 * k)
    for (const d of [-8, 8]) {
      grid.add(x + d, y, 0.9 * k)
      grid.add(x, y + d, 0.9 * k)
    }
  }
}

// The orbit plot. An ellipse centred on ORBIT, the planet at its left focus,
// so perigee is the orbit's left end and apogee its right.
const ORBIT = { x: 1420, y: 500, rx: 170, ry: 120 }
const PLANET_R = 34
const FOCUS = Math.sqrt(ORBIT.rx ** 2 - ORBIT.ry ** 2)
const PLANET_AT = { x: ORBIT.x - FOCUS, y: ORBIT.y }
const PERIOD = 40
// The orbit must clear the planet: perigee's distance from the focus is rx - FOCUS.
const CLEARANCE = ORBIT.rx - FOCUS - PLANET_R
if (CLEARANCE < 10) throw new Error(`cyanotype: the orbit passes within ${CLEARANCE} of the planet's surface`)

const planet = new Ink()
sphere(planet, PLANET_AT.x, PLANET_AT.y, PLANET_R, 6, 3.2)
const orbitDots = new Ink()
for (let i = 0; i < 90; i++) {
  const a = (i / 90) * Math.PI * 2
  orbitDots.add(ORBIT.x + Math.cos(a) * ORBIT.rx, ORBIT.y + Math.sin(a) * ORBIT.ry, 1.4)
}
const apsides = new Ink()
for (let x = ORBIT.x - ORBIT.rx - 14; x <= ORBIT.x + ORBIT.rx + 14; x += 7) apsides.add(x, ORBIT.y, 0.8)

const craft = new Ink()
for (const [x, y, r] of [[0, 0, 3.4], [6, 0, 2.6], [-6, 0, 2.6], [0, -6, 2], [0, 6, 2]] as const) craft.add(x, y, r)

const squash = ORBIT.ry / ORBIT.rx
const stretch = (1 / squash).toFixed(3)
const steps = PERIOD * 12
// The craft starts at apogee (the right end) and passes perigee halfway round.
const craftSvg = `<g transform="translate(${ORBIT.x} ${ORBIT.y}) scale(1 ${squash.toFixed(3)})"><g class="orb"><g transform="translate(${ORBIT.rx} 0)"><g class="cnt"><g class="cr">${craft.print()}</g></g></g></g></g>`

// The drop pod, drawn from the game's look-test render, as white lines.
const SHIP: string[] = [
  'M130 0V90',
  'M90 90h80v20H90z',
  'M95 110h70v50H95z',
  'M106 135a9 9 0 1 0 18 0a9 9 0 1 0 -18 0',
  'M138 95h12v8h-12zM154 95h12v8h-12z',
  'M80 165H180',
  'M70 170h120v130H70z',
  'M40 175h30v30H40zM40 255h30v30H40zM190 175h30v30h-30zM190 255h30v30h-30z',
  'M48 205v50M212 205v50',
  'M198 170V360M214 170V360',
  'M105 300L95 345H165L155 300',
  'M80 300L60 370M180 300L200 370M50 370h20M190 370h20',
]
let rungs = ''
for (let y = 182; y < 360; y += 14) rungs += `M198 ${y}h16`
const shipPaths = [...SHIP, rungs].map((d, i) => `<path pathLength="100" style="animation-delay:${(-i * 0.5).toFixed(1)}s" d="${d}"/>`).join('')

const dimensions = `<g class="dm">
<path d="M40 395H220M40 389v12M220 389v12M250 0V370M244 0h12M244 370h12"/>
<text x="112" y="414">4.2 m</text>
<text x="262" y="190">7.8 m</text>
</g>`

const shipSvg = `<g class="sp">${shipPaths}</g>${dimensions}`

// The orbit plot in the right-hand gutter, the drop pod in the left, each kept whole.
const PLOT = gutter('plot', 'right', { x: 1196, y: 366, w: 420, h: 268 }, `<g class="ap">${apsides.print()}</g>
<g class="od">${orbitDots.print()}</g>
<g class="pl">${planet.print()}</g>
${craftSvg}
<g class="pe"><text x="${ORBIT.x - ORBIT.rx - 44}" y="${ORBIT.y + 5}">Pe</text></g>
<text x="${ORBIT.x + ORBIT.rx - 34}" y="${ORBIT.y - 12}" opacity=".5">Ap</text>`, 1.4)
const POD = gutter('pod', 'left', { x: -4, y: -8, w: 320, h: 432 }, shipSvg, 1.4, { narrow: 'hide' })

export const CYANOTYPE_SVG = `${openRoot()}
<style>
path{fill:none;stroke-linecap:round}
.bg{fill:${PAPER}}
.gr path{stroke:${GRID}}
.pl path{stroke:${PLANET}}
.od path{stroke:${LINE};opacity:.55}
.ap path{stroke:${SOFT};opacity:.4}
.cr path{stroke:#fff}
.orb{animation:orb ${PERIOD}s steps(${steps}) infinite}
.cnt{transform:scale(1,${stretch});animation:cnt ${PERIOD}s steps(${steps}) infinite}
@keyframes orb{to{transform:rotate(360deg)}}
@keyframes cnt{from{transform:rotate(0deg) scale(1,${stretch})}to{transform:rotate(-360deg) scale(1,${stretch})}}
text{font-family:ui-monospace,Consolas,monospace;font-size:15px;fill:${SOFT}}
.pe{opacity:.35;animation:pe ${PERIOD}s steps(1) infinite}
@keyframes pe{0%{opacity:.35}46%{opacity:1}56%{opacity:.35}}
.pe text{fill:#fff}
.sp path{stroke:${LINE};stroke-width:2;stroke-linejoin:round;stroke-dasharray:100;opacity:.6;animation:draw 16s steps(64) infinite}
@keyframes draw{0%{stroke-dashoffset:100}35%{stroke-dashoffset:0}100%{stroke-dashoffset:0}}
.dm path{stroke:${SOFT};stroke-width:1.2;opacity:.6}
.dm text{opacity:.7}
${PLOT.css}
${POD.css}
</style>
<rect class="bg" width="100%" height="100%"/>
${sheet(`<g class="gr">${grid.print()}</g>`)}
${PLOT.svg}
${POD.svg}
</svg>`
