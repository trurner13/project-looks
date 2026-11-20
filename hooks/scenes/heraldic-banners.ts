// Heraldic banners, from the game auto-battler: its "inked heraldry" look. Two tall swallowtail banners hang in
// the side bands, gold with its umber bar on the left and violet with its
// lilac bar on the right, each in one heavy ink line and bearing its army's
// crest (the game's own keep and watchtower art). They sway slowly, and a
// few counters at their feet face each other across the plain middle.
// No `path{...}` rule here: the game's art sets its fills on each shape.

import { away, gutter, H, Ink, openRoot, sheet, W } from '../ink.js'
import { KEEP, KNIGHTS, piece, SPEARMEN, violet, WATCHTOWER } from './battle-art.js'

const INK = '#211A14'
const VELLUM = '#EFE4CC'

type Team = { x: number; field: string; bar: string; crest: string; delay: number }
const TEAMS: Team[] = [
  { x: 150, field: '#F2B01E', bar: '#5C3A08', crest: KEEP, delay: 0 },
  { x: 1300, field: '#6A3FB5', bar: '#F3EDFF', crest: violet(WATCHTOWER), delay: -5 },
]
const WIDTH = 150
const TOP = 210
const LENGTH = 470
const NOTCH = 60

const banner = ({ x, field, bar, crest, delay }: Team): string => {
  const mid = x + WIDTH / 2
  const outline = `M${x} ${TOP}H${x + WIDTH}V${TOP + LENGTH}L${mid} ${TOP + LENGTH - NOTCH}L${x} ${TOP + LENGTH}Z`
  const barPath = `M${mid - 14} ${TOP}H${mid + 14}V${TOP + LENGTH - NOTCH * 0.53}L${mid} ${TOP + LENGTH - NOTCH}L${mid - 14} ${TOP + LENGTH - NOTCH * 0.53}Z`
  const crestSize = 84
  const crestY = TOP + 110
  return `<g class="sway" style="transform-origin:${mid}px ${TOP - 6}px;animation-delay:${delay}s">
<path d="${outline}" fill="${field}"/>
<path d="${barPath}" fill="${bar}"/>
<circle cx="${mid}" cy="${crestY + crestSize / 2}" r="${crestSize * 0.68}" fill="${VELLUM}" stroke="${INK}" stroke-width="5"/>
${piece(crest, mid - crestSize / 2, crestY, crestSize)}
<path d="${outline}" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
</g>
<path d="M${x - 24} ${TOP - 6}H${x + WIDTH + 24}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
<path d="M${x - 24} ${TOP - 6}H${x + WIDTH + 24}" stroke="#7a5a34" stroke-width="4" stroke-linecap="round"/>
<circle cx="${x - 30}" cy="${TOP - 6}" r="9" fill="#c99f45" stroke="${INK}" stroke-width="3"/>
<circle cx="${x + WIDTH + 30}" cy="${TOP - 6}" r="9" fill="#c99f45" stroke="${INK}" stroke-width="3"/>`
}

// Counters at the banners' feet, facing the enemy across the middle, stepping
// forward and back in turn. Front is the top of each drawing.
const COUNTERS = [
  { art: SPEARMEN, x: 120, y: 760, turn: 90, delay: 0 },
  { art: SPEARMEN, x: 200, y: 830, turn: 90, delay: -1.5 },
  { art: violet(KNIGHTS), x: 1340, y: 760, turn: -90, delay: -0.75 },
  { art: violet(KNIGHTS), x: 1420, y: 830, turn: -90, delay: -2.25 },
]
const counter = (c: (typeof COUNTERS)[number]): string =>
  `<g class="step" style="animation-delay:${c.delay}s;--dir:${c.turn > 0 ? 1 : -1}">${piece(c.art, c.x, c.y, 64, c.turn)}</g>`

// Each army (its banner and its counters) is kept whole in its own gutter.
// On a narrow window the violet army moves to the top-right corner and the
// gold one steps out, so the corner holds one.
const army = (team: Team, side: 'left' | 'right'): string =>
  `<g class="banners">${banner(team)}</g><g class="army">${COUNTERS.filter(c => (c.x < W / 2) === (side === 'left')).map(counter).join('')}</g>`
const [GOLD, VIOLET] = TEAMS as [Team, Team]
const LEFT = gutter('gold', 'left', { x: GOLD.x - 44, y: TOP - 20, w: WIDTH + 88, h: 900 - TOP }, army(GOLD, 'left'), 1.1, { tall: 0.8, lift: 0, narrow: 'hide' })
const RIGHT = gutter('violet', 'right', { x: VIOLET.x - 44, y: TOP - 20, w: WIDTH + 88, h: 900 - TOP }, army(VIOLET, 'right'), 1.1, { tall: 0.8, lift: 0, cornerTall: 0.5, cornerWide: 0.28 })

// Faint vellum flecks in the side bands, fading out before the middle.
const flecks = new Ink()
for (let y = 30; y < H; y += 34) for (let x = 17; x < W; x += 34) flecks.add(x + ((y / 34) % 2) * 17, y, 1.4 * away(x))

export const HERALDIC_BANNERS_SVG = `${openRoot()}
<style>
.bg{fill:#17131b}
.fl path{fill:none;stroke:#3a3140;stroke-linecap:round}
.banners{opacity:.8}
.sway{animation:sway 14s steps(56) infinite alternate}
@keyframes sway{from{transform:rotate(-1.6deg)}to{transform:rotate(1.6deg)}}
.army{opacity:.62}
.step{animation:step 6s steps(1) infinite}
@keyframes step{0%{transform:translateX(0)}50%{transform:translateX(calc(var(--dir) * 10px))}}
${LEFT.css}
${RIGHT.css}
</style>
<rect class="bg" width="100%" height="100%"/>
${sheet(`<g class="fl">${flecks.print()}</g>`)}
${LEFT.svg}
${RIGHT.svg}
</svg>`
