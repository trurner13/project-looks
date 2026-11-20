// Hex station: the inside of a space station whose wall is a honeycomb of
// panels. Up in the top-right corner the panels open into a hexagonal window
// onto a banded giant and its moon. Wall cells light up one after another,
// a moon creeps round the giant and a shuttle crosses the window now and then.
// The whole sheet is anchored to its top-right corner, so the window stays in
// view on any screen shape.

import { H, Ink, seeded, sphere, starfield, TWINKLE_CSS, W } from '../ink.js'

const rand = seeded(23)

// Pointy-top hexagons.
const R = 44
const COL = Math.sqrt(3) * R
const ROW = 1.5 * R
// Kept small and tucked into the corner, away from the words.
const WINDOW = { x: 1400, y: 470, r: 240 }
const GIANT = { x: 1440, y: 500, r: 150 }

const hex = (cx: number, cy: number, r: number): string => {
  let d = ''
  for (let k = 0; k < 6; k++) {
    const a = (Math.PI / 3) * k + Math.PI / 6
    d += `${k === 0 ? 'M' : 'L'}${(cx + r * Math.cos(a)).toFixed(0)} ${(cy + r * Math.sin(a)).toFixed(0)}`
  }
  return `${d}Z`
}

// Wall cells cover everything outside the window; window cells are only struts.
let wall = ''
let struts = ''
const lit: string[] = ['', '', '', '', '', '']
let litCount = 0
for (let row = -1; row * ROW < H + R; row++) {
  for (let col = -1; col * COL < W + COL; col++) {
    const x = col * COL + (row % 2 === 0 ? 0 : COL / 2)
    const y = row * ROW
    const inWindow = Math.hypot(x - WINDOW.x, (y - WINDOW.y) * 1.1) < WINDOW.r
    if (inWindow) {
      struts += hex(x, y, R)
      continue
    }
    wall += hex(x, y, R - 3)
    // Lights are thin outlines that glow inside a cell's edge, so words over
    // them stay readable; and only at the edges, never behind the middle column.
    const atEdge = x < 330 || x > 1180
    if (atEdge && rand() > 0.72) {
      const phase = litCount % 6
      lit[phase] = `${lit[phase] ?? ''}${hex(x, y, R - 9)}`
      litCount++
    }
  }
}

// The view: stars, the banded giant, its moon and a passing shuttle.
const sky = starfield(rand, 120, { x: WINDOW.x - WINDOW.r, y: WINDOW.y - WINDOW.r, w: WINDOW.r * 2, h: WINDOW.r * 2 })
const giant = new Ink()
sphere(giant, 0, 0, GIANT.r, 11, 4.2, 9)
const moon = new Ink()
sphere(moon, 0, 0, 34, 7, 3.3)
const shuttle = new Ink()
for (const [x, y, r] of [[0, 0, 4], [9, 0, 3.4], [17, 0, 3], [24, 0, 2.4], [-7, 0, 2.6], [-12, 0, 1.6], [9, -6, 2], [9, 6, 2]] as const) shuttle.add(x, y, r)

export const HEX_STATION_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<style>
path{fill:none;stroke-linecap:round}
.bg{fill:#070912}
.st path{stroke:#f3ead6}
${TWINKLE_CSS}
.gi path{stroke:#b8603a}
.mo path{stroke:#b9b2a3}
.orb{animation:orb 150s steps(1800) infinite}
@keyframes orb{to{transform:rotate(360deg)}}
.sh path{stroke:#9fe8ff}
.sh{animation:fly 40s steps(480) infinite}
@keyframes fly{0%,60%{transform:translate(1180px,680px);opacity:0}61%{opacity:1}85%{transform:translate(1650px,320px);opacity:1}86%,100%{opacity:0}}
.wall{fill:#10131f;stroke:#1f2436;stroke-width:3;stroke-linejoin:round}
.strut{fill:none;stroke:#8a6a2e;stroke-width:5;stroke-linejoin:round}
.rim{fill:none;stroke:#c9a052;stroke-width:1.2;opacity:.35}
.lt{fill:none;stroke:#f7b84a;stroke-width:2.5;stroke-linejoin:round;opacity:0}
.l0{animation:lit 12s steps(1) infinite}
.l1{animation:lit 12s steps(1) infinite -2s}
.l2{animation:lit 12s steps(1) infinite -4s}
.l3{animation:lit 12s steps(1) infinite -6s}
.l4{animation:lit 12s steps(1) infinite -8s}
.l5{animation:lit 12s steps(1) infinite -10s}
@keyframes lit{0%{opacity:0}8%{opacity:.7}14%{opacity:.35}24%{opacity:0}}
</style>
<rect class="bg" width="${W}" height="${H}"/>
<g class="st">${sky.dust}${sky.bright.map((b, i) => `<g class="t${i}">${b}</g>`).join('')}</g>
<g class="gi" transform="translate(${GIANT.x} ${GIANT.y})">${giant.print()}</g>
<g transform="translate(${GIANT.x} ${GIANT.y})"><g class="orb"><g class="mo" transform="translate(-230 50)">${moon.print()}</g></g></g>
<g class="sh">${shuttle.print()}</g>
<path class="wall" d="${wall}"/>
<path class="strut" d="${struts}"/>
<path class="rim" d="${struts}"/>
${lit.map((d, i) => `<path class="lt l${i}" d="${d}"/>`).join('')}
</svg>`
