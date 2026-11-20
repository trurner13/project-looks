// Shared drawing helpers for the scenes. Every scene follows the same rules,
// learned from the backdrop stuttering and freezing:
// - Dots of one size share one path (`M x y h0` with a round cap), so a scene
//   is a few hundred elements at most, not thousands of circles.
// - Motion is slow and stepped (`steps()`), a few to a dozen moves a second.
// - CSS animation only: no SVG animation tags, no shape-rendering,
//   no blur or filters. @media is allowed for layout only (see gutter()).

export const W = 1600
export const H = 1000

// A seeded random, so a scene looks the same every session.
export const seeded = (start: number): (() => number) => {
  let seed = start
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

// Gathers dots by diameter and prints one round-capped path per diameter.
export class Ink {
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

// A lit sphere centred on (cx, cy): dot radius follows a light from the top
// left, with optional horizontal bands for a gas giant.
export const sphere = (ink: Ink, cx: number, cy: number, r: number, step: number, max: number, bands = 0): void => {
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
      ink.add(cx + x, cy + y, max * (0.2 + 0.8 * light))
    }
  }
}

// A flat ring of dots around (cx, cy); `front` picks the half nearer us.
export const flatRing = (ink: Ink, cx: number, cy: number, rx: number, ry: number, width: number, front: boolean): void => {
  for (let a = 0; a < Math.PI * 2; a += 0.12) {
    if (Math.sin(a) > 0 !== front) continue
    for (let w = 0; w < width; w += 8) {
      const fade = 1 - Math.abs(w - width / 2) / (width / 2)
      ink.add(cx + Math.cos(a) * (rx + w), cy + Math.sin(a) * (ry + w * (ry / rx)), 0.6 + 1.8 * fade)
    }
  }
}

// A field of star dust plus three groups of bright stars that blink in turn.
export const starfield = (rand: () => number, count: number, box = { x: 0, y: 0, w: W, h: H }): { dust: string; bright: string[] } => {
  const dust = new Ink()
  const bright = [new Ink(), new Ink(), new Ink()]
  for (let i = 0; i < count; i++) {
    const big = rand() > 0.9
    const x = box.x + rand() * box.w
    const y = box.y + rand() * box.h
    const r = big ? 2 + rand() * 1.4 : 0.7 + rand() * 1.1
    const ink = big ? bright[i % 3] ?? dust : dust
    ink.add(x, y, r)
  }
  return { dust: dust.print(), bright: bright.map(ink => ink.print()) }
}

// The CSS for blinking stars, classes t0 to t2.
export const TWINKLE_CSS = `.t0{animation:tw 7s steps(1) infinite}
.t1{animation:tw 9s steps(1) infinite -3s}
.t2{animation:tw 11s steps(1) infinite -6s}
@keyframes tw{0%{opacity:1}40%{opacity:.35}55%{opacity:1}}`

// The reading column. Like Anthropic's official scenes, every scene keeps the
// middle of the 1600-wide sheet (about x 520 to 1080) plain, puts its art in
// the outer bands, and is laid out with xMidYMid slice: on a narrower window
// the bands are trimmed away and the art leaves, instead of sliding under the
// words. Never pin art to a corner with a nested viewport: on a small window
// that scales the art up into the text.
export const COLUMN = { from: 520, to: 1080 }

const smooth = (from: number, to: number, value: number): number => {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)))
  return t * t * (3 - 2 * t)
}

// 0 under the reading column, 1 out in the side bands, eased between.
export const away = (x: number): number => Math.max(1 - smooth(300, COLUMN.from, x), smooth(COLUMN.to, 1260, x))

// Moves and scales a drawing so the point `from` lands on `to`.
export const place = (svg: string, from: { x: number; y: number }, to: { x: number; y: number }, scale: number): string =>
  `<g transform="translate(${(to.x - from.x * scale).toFixed(1)} ${(to.y - from.y * scale).toFixed(1)}) scale(${scale})">${svg}</g>`

// Art that must stay whole at any window width. The scene's root has no
// viewBox, so its units are the window's own pixels. @media rules (they read
// the scene's own box) sense the window's size in cells of widths and heights,
// and each cell picks one of two places for the art, scaled for that cell's
// smallest window so it never grows past its room:
// - beside the chat column, centred in the free space out to the window's edge;
// - when that space gets too small, up in the top-right corner, small, where
//   it may cover the top of the text a little (a deliberate choice: you want to see
//   at a glance which project a window is, at any width). Art with
//   `narrow: 'hide'` leaves instead, so two pieces never share the corner.
export const COLUMN_HALF = 400
const GAP = 28
const EDGE = 20
const TOP = 16

type Box = { x: number; y: number; w: number; h: number }

export const gutter = (
  cls: string,
  side: 'left' | 'right',
  box: Box,
  inner: string,
  max: number,
  { tall = 0.6, lift = 0.05, narrow = 'corner' as 'corner' | 'hide', cornerWide = 0.36, cornerTall = 0.3 } = {},
): { css: string; svg: string } => {
  const besideFor = (width: number, height: number): number => {
    const room = width / 2 - COLUMN_HALF - GAP - EDGE
    return room <= 0 ? 0 : Math.min(max, room / box.w, (tall * height) / box.h)
  }
  const cornerFor = (width: number, height: number): number =>
    Math.min(max * 0.7, (cornerWide * width) / box.w, (cornerTall * height) / box.h)
  const corner = `${cls}-c`
  const rule = (width: number, height: number): string => {
    const beside = besideFor(width, height)
    const up = cornerFor(width, height)
    if (narrow === 'corner' && up > beside * 1.2) {
      return `.${cls}{display:none}.${corner}{display:inline;transform:translate(-${EDGE}px,${TOP}px) scale(${up.toFixed(3)})}`
    }
    if (beside * box.w < 90) return `.${cls}{display:none}.${corner}{display:none}`
    const fromCentre = (COLUMN_HALF + GAP + width / 2 - EDGE) / 2
    const x = side === 'right' ? fromCentre : -fromCentre
    return `.${cls}{display:inline;transform:translate(${x.toFixed(0)}px,${(-lift * height).toFixed(0)}px) scale(${beside.toFixed(3)})}.${corner}{display:none}`
  }
  const widths: number[] = []
  for (let w = 400; w <= 3200; w += 100) widths.push(w)
  const heights: number[] = []
  for (let h = 300; h <= 1500; h += 200) heights.push(h)
  let css = `.${cls},.${corner}{display:none}`
  widths.forEach((w, i) => {
    const wNext = widths[i + 1]
    heights.forEach((h, j) => {
      const hNext = heights[j + 1]
      const q = [`(min-width:${w}px)`, wNext === undefined ? '' : `(max-width:${wNext - 0.02}px)`, `(min-height:${h}px)`, hNext === undefined ? '' : `(max-height:${hNext - 0.02}px)`]
        .filter(part => part !== '')
        .join(' and ')
      css += `
@media ${q}{${rule(w, h)}}`
    })
  })
  const cx = box.x + box.w / 2
  const cy = box.y + box.h / 2
  // The art is written once and drawn by reference in each place, so a
  // corner copy costs a few bytes, not the whole drawing again.
  const art = `${cls}-art`
  const besideSvg = `<svg x="50%" y="50%" overflow="visible"><g class="${cls}"><use href="#${art}" transform="translate(${-cx} ${-cy})"/></g></svg>`
  // Anchored at the window's top-right corner; the art's own top-right corner sits on it.
  const cornerSvg =
    narrow === 'corner'
      ? `<svg x="100%" y="0" overflow="visible"><g class="${corner}"><use href="#${art}" transform="translate(${-(box.x + box.w)} ${-box.y})"/></g></svg>`
      : ''
  const defs = `<defs><g id="${art}">${inner}</g></defs>`
  return { css, svg: defs + besideSvg + cornerSvg }
}

// The scene's root for gutter art: window pixels, and the sheet (W by H,
// sliced) for textures that may be trimmed.
export const openRoot = (): string => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">`
export const sheet = (inner: string): string =>
  `<svg width="100%" height="100%" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${inner}</svg>`
