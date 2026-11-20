// Atomic Goats, gold on plum: the company's goat-and-orbit mark printed in
// gold halftone dots beside the chat column (top-right on narrow windows), on the brand's dark plum. A
// gold sheen sweeps slowly across the mark, two larger orbit rings in berry
// and taupe circle it with ivory electrons, and a few ivory stars blink.
// Atomic Goats brand colours.

import { gutter, Ink, openRoot, seeded, sheet, starfield, TWINKLE_CSS } from '../ink.js'
import { MARK, MARK_DOTS } from './goat-mark.js'

const rand = seeded(5)

const PLUM = '#231d25'
const BERRY = '#A34D6F'
const TAUPE = '#C9AFA0'
const IVORY = '#F5EDE8'
// The gold logo's gradient, dark to light.
const GOLDS = ['#9c7a2c', '#c99f45', '#e6c475', '#f6e2ad']

// Where the mark sits, in the corner's own frame.
const AT = { x: 1030, y: 70 }
const CENTRE = { x: AT.x + MARK.width / 2, y: AT.y + MARK.height / 2 }

// The mark in four golds by a diagonal sheen, and six sweep bands that brighten in turn.
const SWEEPS = 6
const golds = GOLDS.map(() => new Ink())
const sweeps = Array.from({ length: SWEEPS }, () => new Ink())
for (const { x, y, cover } of MARK_DOTS) {
  const diagonal = (x + (MARK.height - y)) / (MARK.width + MARK.height)
  const tone = Math.min(GOLDS.length - 1, Math.floor((0.05 + 0.8 * Math.sin(diagonal * Math.PI) ** 2) * GOLDS.length))
  const r = 3.6 * Math.sqrt(cover)
  golds[tone]?.add(AT.x + x, AT.y + y, r)
  const band = Math.min(SWEEPS - 1, Math.floor(((x + y) / (MARK.width + MARK.height)) * SWEEPS))
  sweeps[band]?.add(AT.x + x, AT.y + y, r * 0.7)
}

// A tilted orbit ring of dots, drawn flat and squashed by its group's transform.
const RINGS = [
  { rx: 330, ry: 86, tilt: -24, colour: BERRY, period: 26, electrons: 2 },
  { rx: 290, ry: 70, tilt: 32, colour: TAUPE, period: 38, electrons: 1 },
]
const ring = (rx: number): string => {
  const ink = new Ink()
  const n = Math.round((Math.PI * 2 * rx) / 13)
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    ink.add(Math.cos(a) * rx, Math.sin(a) * rx, 2)
  }
  return ink.print()
}

const electron = new Ink()
electron.add(0, 0, 5)

const ringSvg = RINGS.map((r, i) => {
  const squash = r.ry / r.rx
  const stretch = (1 / squash).toFixed(3)
  const steps = r.period * 12
  const electrons = Array.from({ length: r.electrons }, (_, k) => {
    const delay = (-(k / r.electrons) * r.period).toFixed(1)
    return `<g style="animation:orb ${r.period}s steps(${steps}) infinite ${delay}s"><g transform="translate(${r.rx} 0)"><g style="transform:scale(1,${stretch});animation:cnt${i} ${r.period}s steps(${steps}) infinite ${delay}s"><g class="el">${electron.print()}</g></g></g></g>`
  }).join('')
  return `<g transform="translate(${CENTRE.x} ${CENTRE.y}) rotate(${r.tilt}) scale(1 ${squash.toFixed(3)})"><g class="rg${i}">${ring(r.rx)}</g>${electrons}</g>`
}).join('')

const ringCss = RINGS.map((r, i) => {
  const stretch = (r.rx / r.ry).toFixed(3)
  return `.rg${i} path{stroke:${r.colour};opacity:.85}@keyframes cnt${i}{from{transform:rotate(0deg) scale(1,${stretch})}to{transform:rotate(-360deg) scale(1,${stretch})}}`
}).join('\n')

const sky = starfield(rand, 90)

// The mark and its rings, kept whole beside the chat column (or in the top-right corner).
const REACH = { x: 340, y: Math.max(MARK.height / 2, 190) }
const ART = gutter('art', 'right', { x: CENTRE.x - REACH.x, y: CENTRE.y - REACH.y, w: REACH.x * 2, h: REACH.y * 2 }, `
${golds.map((ink, i) => `<g class="g${i}">${ink.print()}</g>`).join('')}
<g class="sw">${sweeps.map((ink, i) => `<g class="s${i}">${ink.print()}</g>`).join('')}</g>
${ringSvg}
`, 0.85)

export const ATOMIC_GOATS_SVG = `${openRoot()}
<style>
path{fill:none;stroke-linecap:round}
.bg{fill:${PLUM}}
.st path{stroke:${IVORY};opacity:.8}
${TWINKLE_CSS}
${GOLDS.map((g, i) => `.g${i} path{stroke:${g}}`).join('')}
.sw path{stroke:#fff6dc}
.sw g{opacity:0;animation:sheen 9s steps(1) infinite}
${Array.from({ length: SWEEPS }, (_, i) => `.s${i}{animation-delay:${(-9 + i * 0.35).toFixed(2)}s!important}`).join('')}
@keyframes sheen{0%{opacity:0}2%{opacity:.55}6%{opacity:0}}
@keyframes orb{to{transform:rotate(360deg)}}
${ringCss}
.el path{stroke:${IVORY}}
${ART.css}
</style>
<rect class="bg" width="100%" height="100%"/>
${sheet(`<g class="st">${sky.dust}${sky.bright.map((b, i) => `<g class="t${i}">${b}</g>`).join('')}</g>`)}
${ART.svg}
</svg>`
