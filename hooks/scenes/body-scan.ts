// Body scan: a standing figure drawn as a wireframe of dotted
// rings, like a 3D body-scan model, beside the chat column on a dark grid. The
// head is a solid teal halftone dot, like the dot on an "i".
// A bright measuring band scans slowly down the body, ring by ring, and the
// chest, waist, hip and inside-leg readings light up as it passes them.
// Teal #1bbc9b.

import { away, gutter, H, Ink, openRoot, sheet, sphere, W } from '../ink.js'

const TEAL = '#1bbc9b'
const PALE = '#9fe8d4'
const GREY = '#8a8a8f'

// The figure's origin (top of the head) and the scan's timing.
const AT = { x: 1300, y: 60 }
const SCAN_SECONDS = 12
const SWEEP = 0.6

type Point = [number, number]

// Half-width of the torso at a height, by straight lines between these points.
const TORSO: Point[] = [
  [112, 20],
  [128, 26],
  [140, 100],
  [190, 92],
  [260, 76],
  [330, 70],
  [400, 88],
  [430, 92],
  [470, 84],
]
const along = (points: Point[], y: number): number => {
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    if (a !== undefined && b !== undefined && y <= b[0]) return a[1] + ((b[1] - a[1]) * (y - a[0])) / (b[0] - a[0])
  }
  return points[points.length - 1]?.[1] ?? 0
}

type Ring = { cx: number; cy: number; hw: number }
const rings: Ring[] = []
for (let y = 112; y <= 470; y += 16) rings.push({ cx: 0, cy: y, hw: along(TORSO, y) })
// Legs: from the hips to the ankles, each tapering.
for (let y = 486; y <= 800; y += 16) {
  const t = (y - 470) / 330
  const hw = 44 - 22 * t
  const cx = 44 - 8 * t
  rings.push({ cx: -cx, cy: y, hw }, { cx, cy: y, hw })
}
// Arms: hanging a little away from the body.
for (let y = 150; y <= 480; y += 18) {
  const t = (y - 150) / 330
  const hw = 22 - 8 * t
  const cx = 116 + 26 * t
  rings.push({ cx: -cx, cy: y, hw }, { cx, cy: y, hw })
}

// Each ring: its back half dim, its front half brighter; and a bright copy the
// scan lights, delayed by its height so the band travels down the body.
const back = new Ink()
const front = new Ink()
const scanRings: string[] = []
for (const ring of rings) {
  const ry = ring.hw * 0.3
  const n = Math.max(10, Math.round((Math.PI * 2 * ring.hw) / 9))
  const lit = new Ink()
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const x = AT.x + ring.cx + Math.cos(a) * ring.hw
    const y = AT.y + ring.cy + Math.sin(a) * ry
    if (Math.sin(a) > 0) {
      front.add(x, y, 1.7)
      lit.add(x, y, 3)
    } else {
      back.add(x, y, 1.1)
    }
  }
  const delay = -SCAN_SECONDS + (ring.cy / 800) * SCAN_SECONDS * SWEEP
  scanRings.push(`<g class="sr" style="animation-delay:${delay.toFixed(2)}s">${lit.print()}</g>`)
}

// Lengthwise lines down the torso and legs, so it reads as a wireframe.
const meridians = new Ink()
for (const a of [0.35, 0.9, 1.57, 2.24, 2.79]) {
  for (let y = 120; y <= 470; y += 10) {
    const hw = along(TORSO, y)
    meridians.add(AT.x + Math.cos(a) * hw, AT.y + y + Math.sin(a) * hw * 0.3, 1.1)
  }
  for (const side of [-1, 1]) {
    for (let y = 480; y <= 800; y += 10) {
      const t = (y - 470) / 330
      const hw = 44 - 22 * t
      meridians.add(AT.x + side * (44 - 8 * t) + Math.cos(a) * hw, AT.y + y + Math.sin(a) * hw * 0.3, 1.1)
    }
  }
}

// The head: the teal dot of the logo's "i".
const head = new Ink()
sphere(head, AT.x, AT.y + 52, 46, 7, 4.6)
const neck = new Ink()
for (let y = 96; y <= 112; y += 8) for (let a = 0; a < Math.PI; a += 0.5) neck.add(AT.x + Math.cos(a) * 20, AT.y + y + Math.sin(a) * 6, 1.4)

// Readings, with a dotted leader to the body, lit as the scan passes.
const READINGS: { label: string; y: number }[] = [
  { label: 'CHEST  96 cm', y: 190 },
  { label: 'WAIST  78 cm', y: 330 },
  { label: 'HIPS  101 cm', y: 430 },
  { label: 'INSIDE LEG  81 cm', y: 640 },
]
const readings = READINGS.map(({ label, y }) => {
  const reach = y > 470 ? 80 : along(TORSO, y) + 8
  const x0 = AT.x - 300
  const leader = new Ink()
  for (let x = x0 + 150; x < AT.x - reach; x += 9) leader.add(x, AT.y + y, 1)
  const delay = -SCAN_SECONDS + (y / 800) * SCAN_SECONDS * SWEEP
  return `<g class="rd" style="animation-delay:${delay.toFixed(2)}s"><text x="${x0}" y="${AT.y + y + 5}">${label}</text><g class="ld">${leader.print()}</g></g>`
}).join('')

// A faint measuring grid over the whole sheet.
const grid = new Ink()
for (let y = 0; y <= H; y += 40) for (let x = 0; x <= W; x += 40) grid.add(x, y, 1.2 * away(x))

// The figure and its readings, kept whole beside the chat column (or in the top-right corner).
const ART = gutter('art', 'right', { x: AT.x - 304, y: AT.y - 4, w: 480, h: 816 }, `
<g class="bk">${back.print()}</g>
<g class="mr">${meridians.print()}</g>
<g class="fr">${front.print()}</g>
<g class="nk">${neck.print()}</g>
<g class="hd">${head.print()}</g>
${scanRings.join('')}
${readings}
`, 0.95, { tall: 0.8, lift: 0, cornerTall: 0.5, cornerWide: 0.28 })

export const BODY_SCAN_SVG = `${openRoot()}
<style>
path{fill:none;stroke-linecap:round}
.bg{fill:#101516}
.gr path{stroke:#1f2a2b}
.bk path{stroke:${TEAL};opacity:.25}
.fr path{stroke:${TEAL};opacity:.7}
.mr path{stroke:${TEAL};opacity:.35}
.hd path{stroke:${TEAL}}
.nk path{stroke:${TEAL};opacity:.6}
.sr path{stroke:${PALE}}
.sr{opacity:0;animation:scan ${SCAN_SECONDS}s steps(1) infinite}
@keyframes scan{0%{opacity:0}1%{opacity:1}4%{opacity:.4}7%{opacity:0}}
text{font-family:ui-monospace,Consolas,monospace;font-size:15px;letter-spacing:1px;fill:${GREY}}
.ld path{stroke:${GREY}}
.rd{opacity:.45;animation:read ${SCAN_SECONDS}s steps(1) infinite}
.rd text{fill:${PALE}}
@keyframes read{0%{opacity:1}30%{opacity:.45}}
${ART.css}
</style>
<rect class="bg" width="100%" height="100%"/>
${sheet(`<g class="gr">${grid.print()}</g>`)}
${ART.svg}
</svg>`
