// Applications board: an amber LED departure board
// beside the chat column (top-right on narrow windows) of a dark hall, listing made-up roles and where each
// application stands. Every letter is lit LEDs on a 5 by 7 grid over a field
// of unlit ones, and the statuses flip now and then (NEW to APPLIED, SCREEN
// to INTERVIEW...), each row on its own rhythm. Roles are generic on purpose:
// no company names on a screen that shows in every session.

import { away, gutter, Ink, openRoot, sheet, W } from '../ink.js'

const AMBER = '#ffb000'

// A 5 by 7 LED font: seven rows of five, 1 lit.
const FONT: Record<string, string> = {
  A: '01110 10001 10001 11111 10001 10001 10001',
  B: '11110 10001 10001 11110 10001 10001 11110',
  C: '01110 10001 10000 10000 10000 10001 01110',
  D: '11110 10001 10001 10001 10001 10001 11110',
  E: '11111 10000 10000 11110 10000 10000 11111',
  F: '11111 10000 10000 11110 10000 10000 10000',
  G: '01110 10001 10000 10111 10001 10001 01111',
  H: '10001 10001 10001 11111 10001 10001 10001',
  I: '01110 00100 00100 00100 00100 00100 01110',
  J: '00111 00010 00010 00010 00010 10010 01100',
  K: '10001 10010 10100 11000 10100 10010 10001',
  L: '10000 10000 10000 10000 10000 10000 11111',
  M: '10001 11011 10101 10101 10001 10001 10001',
  N: '10001 10001 11001 10101 10011 10001 10001',
  O: '01110 10001 10001 10001 10001 10001 01110',
  P: '11110 10001 10001 11110 10000 10000 10000',
  Q: '01110 10001 10001 10001 10101 10010 01101',
  R: '11110 10001 10001 11110 10100 10010 10001',
  S: '01111 10000 10000 01110 00001 00001 11110',
  T: '11111 00100 00100 00100 00100 00100 00100',
  U: '10001 10001 10001 10001 10001 10001 01110',
  V: '10001 10001 10001 10001 10001 01010 00100',
  W: '10001 10001 10001 10101 10101 10101 01010',
  X: '10001 10001 01010 00100 01010 10001 10001',
  Y: '10001 10001 01010 00100 00100 00100 00100',
  Z: '11111 00001 00010 00100 01000 10000 11111',
  '-': '00000 00000 00000 11111 00000 00000 00000',
  ' ': '00000 00000 00000 00000 00000 00000 00000',
}

// The board's geometry: LED pitch, character cell, columns and rows.
// Small and dim on purpose: the board sits behind the conversation, so it
// must never compete with the words over it.
const PITCH = 3
const CELL = 6 * PITCH
const COLUMNS = 21
const STATUS_AT = 12
const LINE = 8 * PITCH + 10
const BOARD = { x: 1180, y: 380 }
const BOARD_W = COLUMNS * CELL
const DOT = 1.4

// Lights a line of text, starting at a column, into an ink.
const write = (ink: Ink, text: string, row: number, column: number): void => {
  ;[...text.toUpperCase()].forEach((char, i) => {
    const rows = (FONT[char] ?? FONT[' '] ?? '').split(' ')
    rows.forEach((bits, ry) => {
      ;[...bits].forEach((bit, rx) => {
        if (bit === '1') ink.add(BOARD.x + (column + i) * CELL + rx * PITCH, BOARD.y + row * LINE + ry * PITCH, DOT)
      })
    })
  })
}

type Row = { role: string; statuses: string[]; seconds: number; offset: number }

const ROWS: Row[] = [
  { role: 'AI ENGINEER', statuses: ['NEW', 'APPLIED'], seconds: 14, offset: 0 },
  { role: 'FDE LEAD', statuses: ['APPLIED', 'SCREEN'], seconds: 18, offset: 5 },
  { role: 'STAFF SWE', statuses: ['SCREEN', 'INTERVIEW'], seconds: 22, offset: 9 },
  { role: 'CONTRACT', statuses: ['ACTIVE'], seconds: 0, offset: 0 },
  { role: 'AI TRAINER', statuses: ['INTERVIEW', 'OFFER'], seconds: 26, offset: 13 },
  { role: 'PLATFORM', statuses: ['NEW', 'APPLIED'], seconds: 30, offset: 3 },
]

const header = new Ink()
write(header, 'ROLE', 0, 0)
write(header, 'STATUS', 0, STATUS_AT)

const roles = new Ink()
const rowSvg = ROWS.map((row, i) => {
  const line = i + 1
  write(roles, row.role, line, 0)
  if (row.statuses.length === 1) {
    const ink = new Ink()
    write(ink, row.statuses[0] ?? '', line, STATUS_AT)
    return `<g class="on">${ink.print()}</g>`
  }
  // Two statuses that take turns, with a moment of blank board between them.
  return row.statuses
    .map((status, k) => {
      const ink = new Ink()
      write(ink, status, line, STATUS_AT)
      const delay = -(row.offset + (k * row.seconds) / 2)
      return `<g class="flip" style="animation-duration:${row.seconds}s;animation-delay:${delay}s">${ink.print()}</g>`
    })
    .join('')
}).join('')

const ROWS_TOTAL = ROWS.length + 1
const BOARD_H = ROWS_TOTAL * LINE

// The housing: a dark frame with four bolts.
const bolts = new Ink()
for (const [x, y] of [
  [BOARD.x - 26, BOARD.y - 26],
  [BOARD.x + BOARD_W + 14, BOARD.y - 26],
  [BOARD.x - 26, BOARD.y + BOARD_H + 2],
  [BOARD.x + BOARD_W + 14, BOARD.y + BOARD_H + 2],
] as const)
  bolts.add(x, y, 4)

// A faint row of ceiling lights across the hall.
const lights = new Ink()
for (let x = 40; x < W; x += 160) for (let k = 0; k < 6; k++) lights.add(x + k * 9, 24, 2.2 * away(x))

// The board in its housing, kept whole beside the chat column (or in the top-right corner).
const ART = gutter('art', 'right', { x: BOARD.x - 44, y: BOARD.y - 44, w: BOARD_W + 74, h: BOARD_H + 64 }, `
<rect class="housing" x="${BOARD.x - 40}" y="${BOARD.y - 40}" width="${BOARD_W + 66}" height="${BOARD_H + 56}" rx="10"/>
<rect x="${BOARD.x - PITCH / 2}" y="${BOARD.y - PITCH / 2}" width="${BOARD_W - PITCH}" height="${BOARD_H - 14}" fill="url(#led)"/>
<g class="bl">${bolts.print()}</g>
<g class="hd">${header.print()}</g>
<g class="rl">${roles.print()}</g>
${rowSvg}
`, 1.3)

export const APPLICATIONS_BOARD_SVG = `${openRoot()}
<defs><pattern id="led" width="${PITCH}" height="${PITCH}" patternUnits="userSpaceOnUse" x="${BOARD.x - PITCH / 2}" y="${BOARD.y - PITCH / 2}"><circle cx="${PITCH / 2}" cy="${PITCH / 2}" r="0.9" fill="#1e1607"/></pattern></defs>
<style>
path{fill:none;stroke-linecap:round}
.bg{fill:#0e0d0c}
.lt path{stroke:#3a342a}
.housing{fill:#11100e;stroke:#24211c;stroke-width:2}
.bl path{stroke:#4a443a}
.hd path{stroke:${AMBER};opacity:.3}
.rl path{stroke:${AMBER};opacity:.5}
.on path{stroke:${AMBER};opacity:.55}
.on{animation:pulse 6s steps(2) infinite}
@keyframes pulse{0%{opacity:1}50%{opacity:.75}}
.flip path{stroke:${AMBER};opacity:.55}
.flip{opacity:0;animation-name:flip;animation-timing-function:steps(1);animation-iteration-count:infinite}
@keyframes flip{0%{opacity:1}48%{opacity:0}}
${ART.css}
</style>
<rect class="bg" width="100%" height="100%"/>
${sheet(`<g class="lt">${lights.print()}</g>`)}
${ART.svg}
</svg>`
