// Alien aurora: night on another world. Curtains of green and blue light,
// printed as columns of dots, sway slowly across the top of the sky and
// brighten and fade in turn. Two moons hang in the top-right corner, and a
// dark ridge with tall rock spires lines the foot, low under the words and
// rising at the sides.

import { away, H, Ink, place, seeded, sphere, starfield, TWINKLE_CSS, W } from '../ink.js'

const rand = seeded(67)

const sky = starfield(rand, 200, { x: 0, y: 0, w: W, h: 700 })

// One curtain: columns of dots hanging from a wavy top edge, brightest at the
// top and thinning downward, with the column length rippling along it.
const curtain = (top: (x: number) => number, length: (x: number) => number, from: number, to: number, size: number): string => {
  const ink = new Ink()
  for (let x = from; x <= to; x += 13) {
    const y0 = top(x)
    const len = length(x)
    for (let k = 0; k * 10 < len; k++) {
      const fade = 1 - (k * 10) / len
      ink.add(x, y0 + k * 10, size * (0.25 + 0.75 * fade * fade) * (0.12 + 0.88 * away(x)))
    }
  }
  return ink.print()
}

const CURTAINS = [
  curtain(
    x => 210 + 50 * Math.sin(x / 210) + 18 * Math.sin(x / 67),
    x => 160 + 90 * Math.sin(x / 140 + 1) ** 2,
    -60,
    W + 60,
    3.6,
  ),
  curtain(
    x => 290 + 40 * Math.sin(x / 260 + 2) + 14 * Math.sin(x / 51),
    x => 110 + 70 * Math.sin(x / 110 + 3) ** 2,
    -60,
    W + 60,
    2.8,
  ),
  curtain(
    x => 180 + 30 * Math.sin(x / 180 + 4),
    x => 90 + 60 * Math.sin(x / 90) ** 2,
    700,
    W + 60,
    2.4,
  ),
]

// The moons, pinned to the top-right corner.
const bigMoon = new Ink()
sphere(bigMoon, 1380, 400, 74, 8, 4.4)
const smallMoon = new Ink()
sphere(smallMoon, 1215, 330, 28, 6, 3.2, 4)

// The ridge: low in the middle, rising at the two sides, with spires.
const ridgeY = (x: number): number => {
  const side = Math.max(1 - x / 420, (x - 1150) / 450, 0)
  return 960 - 230 * side ** 1.4 - 14 * Math.sin(x / 70) - 8 * Math.sin(x / 23)
}
let ridge = `M0 ${H}`
for (let x = 0; x <= W; x += 20) ridge += `L${x} ${ridgeY(x).toFixed(0)}`
ridge += `L${W} ${H}Z`
const SPIRES: [number, number, number][] = [
  [90, 340, 22],
  [170, 250, 16],
  [1440, 300, 20],
  [1530, 220, 14],
]
for (const [x, height, half] of SPIRES) {
  const base = ridgeY(x) + 20
  ridge += `M${x - half} ${base.toFixed(0)}L${x - 3} ${(base - height).toFixed(0)}L${x + 4} ${(base - height + 8).toFixed(0)}L${x + half} ${base.toFixed(0)}Z`
}
// Aurora light catching the crest: a line of green dots along the ridge top.
const rim = new Ink()
for (let x = 0; x <= W; x += 11) {
  const side = Math.max(1 - x / 420, (x - 1150) / 450, 0)
  rim.add(x, ridgeY(x) + 4, 1 + 1.6 * side)
}

export const ALIEN_AURORA_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<style>
path{fill:none;stroke-linecap:round}
.bg{fill:#050d12}
.st path{stroke:#e8f3ee}
${TWINKLE_CSS}
.a0 path{stroke:#45d6a4}
.a1 path{stroke:#6fa8ff}
.a2 path{stroke:#b4f2c8}
.a0{animation:sway 46s steps(276) infinite alternate,glow 18s steps(6) infinite alternate}
.a1{animation:sway 58s steps(348) infinite alternate-reverse,glow 22s steps(6) infinite alternate -7s}
.a2{animation:sway 38s steps(228) infinite alternate -12s,glow 15s steps(6) infinite alternate -4s}
@keyframes sway{from{transform:translateX(-40px)}to{transform:translateX(40px)}}
@keyframes glow{from{opacity:.35}to{opacity:.95}}
.bm path{stroke:#dfe6e0}
.sm path{stroke:#e09a6a}
.rd{fill:#081419}
.rm path{stroke:#45d6a4;opacity:.7}
</style>
<rect class="bg" width="${W}" height="${H}"/>
<g class="st">${sky.dust}${sky.bright.map((b, i) => `<g class="t${i}">${b}</g>`).join('')}</g>
${CURTAINS.map((c, i) => `<g class="a${i}">${c}</g>`).join('')}
${place(`
<g class="bm">${bigMoon.print()}</g>
<g class="sm">${smallMoon.print()}</g>
`, { x: 0, y: 0 }, { x: 0, y: 0 }, 1)}
<path class="rd" d="${ridge}"/>
<g class="rm">${rim.print()}</g>
</svg>`
