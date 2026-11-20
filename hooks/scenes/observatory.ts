// Observatory window: a dark, warm observatory room. A round brass porthole
// in the top-right corner looks out on a starfield where a ringed planet
// drifts slowly across and a shooting star falls now and then. On the left a
// brass telescope on its tripod points at the window, under a dotted star
// chart pinned to the wall. Each part is pinned to its own corner, so nothing
// slides behind the words on a narrow or wide window.

import { flatRing, H, Ink, place, seeded, sphere, starfield, TWINKLE_CSS, W } from '../ink.js'

const rand = seeded(41)

const WIN = { x: 1150, y: 300, r: 230 }

// The view through the porthole.
const sky = starfield(rand, 150, { x: WIN.x - WIN.r, y: WIN.y - WIN.r, w: WIN.r * 2, h: WIN.r * 2 })
const planet = new Ink()
sphere(planet, 0, 0, 70, 9, 4.6, 8)
const ringBack = new Ink()
const ringFront = new Ink()
flatRing(ringBack, 0, 0, 100, 26, 30, false)
flatRing(ringFront, 0, 0, 100, 26, 30, true)
const farMoon = new Ink()
sphere(farMoon, WIN.x + 120, WIN.y + 120, 26, 6, 3)
const meteor = new Ink()
meteor.add(0, 0, 3.4)
for (let i = 1; i < 14; i++) meteor.add(-i * 9, -i * 5, 3 * (1 - i / 14))

// The brass frame: rings of dots, and rivets.
const frame = new Ink()
for (let ring = 0; ring < 4; ring++) {
  const rr = WIN.r + 6 + ring * 9
  const n = Math.round((Math.PI * 2 * rr) / 9)
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    // Lit from the top left: the upper-left arc is brighter.
    const light = 0.5 + 0.5 * Math.cos(a + Math.PI * 0.75)
    frame.add(WIN.x + Math.cos(a) * rr, WIN.y + Math.sin(a) * rr, (ring === 1 || ring === 2 ? 3.6 : 2.4) * (0.45 + 0.55 * light))
  }
}
const rivets = new Ink()
for (let i = 0; i < 12; i++) {
  const a = (i / 12) * Math.PI * 2
  rivets.add(WIN.x + Math.cos(a) * (WIN.r + 46), WIN.y + Math.sin(a) * (WIN.r + 46), 5)
}

// The telescope, drawn upright, then tilted toward the window.
const tube = new Ink()
const TUBE = { len: 340, wide: 54 }
for (let along = 0; along < TUBE.len; along += 9) {
  const taper = TUBE.wide * (0.72 + (0.28 * along) / TUBE.len)
  for (let across = -taper / 2; across <= taper / 2; across += 9) {
    // A cylinder: bright down its upper side, dark underneath.
    const t = (across + taper / 2) / taper
    const light = Math.max(0, Math.sin(t * Math.PI) * (1.2 - t))
    tube.add(along, across, 1 + 3.6 * light)
  }
}
const bands = new Ink()
for (const at of [40, 150, 330]) for (let across = -34; across <= 34; across += 6) bands.add(at, across, 3)
const tripod = new Ink()
for (const [dx, dy] of [[-120, 300], [10, 320], [120, 290]] as const) {
  for (let i = 0; i <= 30; i++) tripod.add((dx * i) / 30, (dy * i) / 30, 2.6)
}

// A star chart on the wall: a few constellations, dot and dash.
const chart = new Ink()
const chartLines = new Ink()
const CONSTELLATIONS: [number, number][][] = [
  [[0, 0], [60, 30], [120, 20], [170, 70], [150, 130]],
  [[40, 170], [90, 200], [80, 260], [30, 240]],
  [[200, 180], [250, 150], [300, 190], [280, 250]],
]
for (const shape of CONSTELLATIONS) {
  shape.forEach(([x, y], i) => {
    chart.add(x, y, 4.5)
    const next = shape[i + 1]
    if (next === undefined) return
    const steps = Math.round(Math.hypot(next[0] - x, next[1] - y) / 10)
    for (let s = 1; s < steps; s++) chartLines.add(x + ((next[0] - x) * s) / steps, y + ((next[1] - y) * s) / steps, 1.2)
  })
}

// The wall: a faint printed texture.
const wall = new Ink()
for (let y = 0; y < H; y += 26) for (let x = (y / 26) % 2 === 0 ? 0 : 13; x < W; x += 26) wall.add(x, y, 1.1)

export const OBSERVATORY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<style>
path{fill:none;stroke-linecap:round}
.bg{fill:#14100c}
.wl path{stroke:#3a2d22}
.sk{fill:#070a16}
.st path{stroke:#f3ead6}
${TWINKLE_CSS}
.pl path{stroke:#5fd0c4}
.rg path{stroke:#f2d29b}
.fm path{stroke:#9fb4e8}
.dr{animation:drift 160s steps(1920) infinite}
@keyframes drift{from{transform:translate(${WIN.x - WIN.r - 160}px,${WIN.y - 60}px)}to{transform:translate(${WIN.x + WIN.r + 160}px,${WIN.y + 40}px)}}
.me path{stroke:#fff8e6}
.me{animation:fall 23s steps(276) infinite}
@keyframes fall{0%,70%{transform:translate(${WIN.x + 140}px,${WIN.y - 200}px);opacity:0}71%{opacity:1}80%{transform:translate(${WIN.x - 120}px,${WIN.y - 50}px);opacity:1}81%,100%{opacity:0}}
.br path{stroke:#c9a46a}
.rv path{stroke:#ead2a0}
.ch path{stroke:#e9dcc0;opacity:.55}
.tb path{stroke:#c9a46a}
.bd path{stroke:#7a5a34}
.tp path{stroke:#6b5236}
</style>
<rect class="bg" width="${W}" height="${H}"/>
<g class="wl">${wall.print()}</g>
${place(`
<defs><clipPath id="pane"><circle cx="${WIN.x}" cy="${WIN.y}" r="${WIN.r}"/></clipPath></defs>
<g clip-path="url(#pane)">
<circle class="sk" cx="${WIN.x}" cy="${WIN.y}" r="${WIN.r}"/>
<g class="st">${sky.dust}${sky.bright.map((b, i) => `<g class="t${i}">${b}</g>`).join('')}</g>
<g class="fm">${farMoon.print()}</g>
<g class="dr"><g class="rg">${ringBack.print()}</g><g class="pl">${planet.print()}</g><g class="rg">${ringFront.print()}</g></g>
<g class="me">${meteor.print()}</g>
</g>
<g class="br">${frame.print()}</g>
<g class="rv">${rivets.print()}</g>
`, { x: WIN.x, y: WIN.y }, { x: 1400, y: 480 }, 0.62)}
${place(`
<g class="ch" transform="translate(190 80)">${chart.print()}${chartLines.print()}</g>
<g transform="translate(360 520)">
<g class="tp">${tripod.print()}</g>
<g transform="rotate(-32)"><g class="tb" transform="translate(-110 0)">${tube.print()}</g><g class="bd" transform="translate(-110 0)">${bands.print()}</g></g>
</g>
`, { x: 190, y: 80 }, { x: 40, y: 250 }, 0.65)}
</svg>`
