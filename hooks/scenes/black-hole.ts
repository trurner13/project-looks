// The halftone scene: a solar system of dot-printed planets orbiting a black
// hole, built once as an SVG string. Dot size carries the light, like a
// printed comic.
//
// Built for the app's backdrop, which repaints the whole window whenever
// anything moves:
// - Dots of one size share one path (`M x y h0` with a round cap), so the
//   scene is a few dozen elements, not thousands of circles.
// - Motion is stepped: each orbit advances about 12 times a second and the
//   orbits are slow, so each step is a shift of a pixel or two.
// - CSS animation only: no SVG animation tags, no @media, no shape-rendering
//   (they froze the backdrop in earlier attempts).

import { place } from '../ink.js'

let seed = 11
const rand = (): number => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

const W = 1600
const H = 1000
// How many times a second an orbit moves on.
const STEPS_PER_SECOND = 12

// Gathers dots by diameter and prints one round-capped path per diameter.
class Ink {
  private readonly groups = new Map<number, string>()

  add(x: number, y: number, r: number): void {
    if (r < 0.5) return
    const width = Math.round(r * 4) / 2
    this.groups.set(width, `${this.groups.get(width) ?? ''}M${x.toFixed(0)} ${y.toFixed(0)}h0`)
  }

  print(): string {
    let out = ''
    for (const [width, d] of this.groups) out += `<path stroke-width="${width}" d="${d}"/>`
    return out
  }
}

// A lit sphere centred on (0, 0): dot radius follows a light from the top
// left, with optional bands for a gas giant.
const sphere = (ink: Ink, r: number, step: number, max: number, bands = 0): void => {
  for (let y = -r; y <= r; y += step) {
    const row = Math.round(y / step)
    const off = row % 2 === 0 ? 0 : step / 2
    for (let x = -r + off; x <= r; x += step) {
      const nx = x / r
      const ny = y / r
      const d2 = nx * nx + ny * ny
      if (d2 > 1) continue
      const nz = Math.sqrt(1 - d2)
      let light = Math.max(0, -0.55 * nx - 0.6 * ny + 0.58 * nz)
      if (bands > 0) light *= 0.7 + 0.3 * Math.sin(ny * bands + Math.sin(nx * 3) * 0.6)
      ink.add(x, y, max * (0.2 + 0.8 * light))
    }
  }
}

// A flat ring of dots around (0, 0); `front` picks the half nearer us.
const flatRing = (ink: Ink, rx: number, ry: number, width: number, front: boolean): void => {
  for (let a = 0; a < Math.PI * 2; a += 0.14) {
    if (Math.sin(a) > 0 !== front) continue
    for (let w = 0; w < width; w += 8) {
      const fade = 1 - Math.abs(w - width / 2) / (width / 2)
      ink.add(Math.cos(a) * (rx + w), Math.sin(a) * (ry + w * (ry / rx)), 0.6 + 1.8 * fade)
    }
  }
}

// The black hole, upper right, pinned to that corner on any screen shape.
const BH = { x: 1060, y: 300 }
// How flat the orbital plane looks: 1 is face on, 0 edge on.
const TILT = 0.36

// The accretion disk: hot white near the hole, orange, then red at the edge.
const disk = (front: boolean): string => {
  const inks = [new Ink(), new Ink(), new Ink()]
  for (let rr = 78; rr < 230; rr += 11) {
    const t = (rr - 78) / 152
    const ink = inks[t < 0.25 ? 0 : t < 0.6 ? 1 : 2]
    if (ink === undefined) continue
    for (let a = 0; a < Math.PI * 2; a += 12 / rr) {
      if (Math.sin(a) > 0 !== front) continue
      const r = (4 - 2.7 * t) * (0.55 + 0.45 * Math.abs(Math.cos(a * 3 + rr * 0.07)))
      ink.add(Math.cos(a) * rr, Math.sin(a) * rr * 0.26, r)
    }
  }
  return inks.map((ink, i) => `<g class="d${i}">${ink.print()}</g>`).join('')
}

// Light bent over the top of the hole: the far side of the disk, lensed.
const lens = (): string => {
  const ink = new Ink()
  for (let rr = 70; rr < 120; rr += 10) {
    for (let a = Math.PI * 1.05; a < Math.PI * 1.95; a += 9 / rr) {
      ink.add(Math.cos(a) * rr * 1.05, Math.sin(a) * rr * 0.95, 2.4 - (rr - 70) / 30)
    }
  }
  return ink.print()
}

// The thin bright photon ring hugging the horizon.
const photon = (): string => {
  const ink = new Ink()
  for (let a = 0; a < Math.PI * 2; a += 0.11) ink.add(Math.cos(a) * 62, Math.sin(a) * 62, 1.6)
  return ink.print()
}

type Planet = { name: string; orbit: number; period: number; start: number; r: number; step: number; max: number; bands?: number; ring?: boolean }

// Slow orbits: the inner world laps in a minute, the outer in nearly seven.
const PLANETS: Planet[] = [
  { name: 'p1', orbit: 215, period: 60, start: 0.1, r: 15, step: 6, max: 2.9 },
  { name: 'p2', orbit: 285, period: 90, start: 0.55, r: 22, step: 7, max: 3.5 },
  { name: 'p3', orbit: 360, period: 130, start: 0.85, r: 28, step: 8, max: 3.9 },
  { name: 'p4', orbit: 430, period: 190, start: 0.3, r: 21, step: 7, max: 3.4 },
  { name: 'p5', orbit: 500, period: 280, start: 0.68, r: 44, step: 9, max: 4.6, bands: 10, ring: true },
  { name: 'p6', orbit: 570, period: 400, start: 0.15, r: 32, step: 8, max: 4, bands: 6 },
]

// The plane is squashed by TILT, so each planet's own group turns back and
// stretches by 1 / TILT, which keeps it round as it travels.
const STRETCH = (1 / TILT).toFixed(3)

const planetCss = PLANETS.map(p => {
  const d = (-p.start * p.period).toFixed(1)
  const steps = Math.round(p.period * STEPS_PER_SECOND)
  const timing = `${p.period}s steps(${steps}) infinite ${d}s`
  return `.${p.name} .o{animation:orb ${timing}}.${p.name} .c{animation:cnt ${timing}}`
}).join('')

const planetSvg = PLANETS.map(p => {
  const body = new Ink()
  sphere(body, p.r, p.step, p.max, p.bands ?? 0)
  let back = ''
  let front = ''
  if (p.ring === true) {
    const b = new Ink()
    const f = new Ink()
    flatRing(b, p.r * 1.45, p.r * 0.38, 18, false)
    flatRing(f, p.r * 1.45, p.r * 0.38, 18, true)
    back = `<g class="rg">${b.print()}</g>`
    front = `<g class="rg">${f.print()}</g>`
  }
  return `<g class="${p.name}"><g class="o"><g transform="translate(${p.orbit} 0)"><g class="c">${back}<g class="pl">${body.print()}</g>${front}</g></g></g></g>`
}).join('')

// Faint dotted orbit lines, drawn in the scene's own coordinates.
const orbitLines = (): string => {
  const ink = new Ink()
  for (const p of PLANETS) {
    const n = Math.round(p.orbit / 11)
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      ink.add(BH.x + Math.cos(a) * p.orbit, BH.y + Math.sin(a) * p.orbit * TILT, 1.2)
    }
  }
  return ink.print()
}

// Star dust, still; a handful of bright stars blink in three rhythms.
const stars = (): string => {
  const dust = new Ink()
  const bright = [new Ink(), new Ink(), new Ink()]
  for (let i = 0; i < 170; i++) {
    const big = rand() > 0.9
    const x = rand() * W
    const y = rand() * H
    const r = big ? 2 + rand() * 1.6 : 0.7 + rand() * 1.1
    const ink = big ? bright[i % 3] ?? dust : dust
    ink.add(x, y, r)
  }
  return dust.print() + bright.map((ink, i) => `<g class="t${i}">${ink.print()}</g>`).join('')
}

const comet = (): string => {
  const ink = new Ink()
  ink.add(0, 0, 5)
  for (let i = 1; i < 22; i++) ink.add(i * 11, -i * 6.2 + (i % 2) * 3, 4.2 * (1 - i / 22))
  return ink.print()
}

const BACK_DISK = disk(false)
const FRONT_DISK = disk(true)

export const BLACK_HOLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<style>
path{fill:none;stroke-linecap:round}
.bg{fill:#0b0d1a}
.st{stroke:#f3ead6}
.t0{animation:tw 7s steps(1) infinite}
.t1{animation:tw 9s steps(1) infinite -3s}
.t2{animation:tw 11s steps(1) infinite -6s}
@keyframes tw{0%{opacity:1}40%{opacity:.35}55%{opacity:1}}
.ol{stroke:#f3ead6;opacity:.4}
.d0{stroke:#fff3cf}.d1{stroke:#ffa94d}.d2{stroke:#ff5e3a}
.ln{stroke:#ffc27a;opacity:.85}
.ph{stroke:#fff8e6}
.hz{fill:#000}
@keyframes orb{to{transform:rotate(360deg)}}
@keyframes cnt{from{transform:rotate(0deg) scale(1,${STRETCH})}to{transform:rotate(-360deg) scale(1,${STRETCH})}}
${planetCss}
.p1 .pl{stroke:#c9c2b4}.p2 .pl{stroke:#f2d29b}.p3 .pl{stroke:#5fd0c4}.p4 .pl{stroke:#ff6b5a}.p5 .pl{stroke:#ff8a4c}.p6 .pl{stroke:#7fa8ff}
.rg{stroke:#f7c873}
.cm{stroke:#f3ead6;animation:cm 30s steps(360) infinite}
@keyframes cm{0%{transform:translate(1620px,220px);opacity:0}4%{opacity:1}20%{transform:translate(1330px,460px);opacity:1}24%,100%{transform:translate(1290px,500px);opacity:0}}
</style>
<rect class="bg" width="${W}" height="${H}"/>
<g class="st">${stars()}</g>
<g class="cm">${comet()}</g>
${place(`
<g class="ol">${orbitLines()}</g>
<g transform="translate(${BH.x} ${BH.y})">
${BACK_DISK}
<g class="ln">${lens()}</g>
<circle class="hz" r="60"/>
<g class="ph">${photon()}</g>
${FRONT_DISK}
</g>
<g transform="translate(${BH.x} ${BH.y}) scale(1 ${TILT})">${planetSvg}</g>
`, { x: BH.x, y: BH.y }, { x: 1370, y: 500 }, 0.45)}
</svg>`
