// Unit art from the game auto-battler, each a
// 48 by 48 drawing in team one's gold. `violet` recolours one for team two the
// the game's art direction says: #F2B01E to #6A3FB5, #5C3A08 to #F3EDFF.

export const KEEP = `<g stroke="#211A14" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"> <path d="M7 11 H41 V43 H7 Z" fill="#A9AEB0"/> <path d="M16 13 V2 H32 V13 Z" fill="#6E7478"/> <path d="M20 2 H28 V9 H20 Z" fill="#211A14"/> <circle cx="8" cy="12" r="6.5" fill="#6E7478"/> <circle cx="40" cy="12" r="6.5" fill="#6E7478"/> <circle cx="8" cy="41" r="6.5" fill="#6E7478"/> <circle cx="40" cy="41" r="6.5" fill="#6E7478"/> <path d="M15 17 H33 V38 H15 Z" fill="#F2B01E"/> <path d="M21 18 H27 V37 H21 Z" fill="#5C3A08" stroke="none"/> </g>`
export const WATCHTOWER = `<g stroke="#211A14" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"> <path d="M16 11 L18 2 H30 L32 11 Z" fill="#A9AEB0"/> <path d="M24 3 V9" stroke-width="3"/> <circle cx="24" cy="27" r="19" fill="#A9AEB0"/> <path d="M24 8 V12 M24 42 V46 M5 27 H9 M39 27 H43 M10.6 13.6 L13.4 16.4 M34.6 37.6 L37.4 40.4 M37.4 13.6 L34.6 16.4 M13.4 37.6 L10.6 40.4" stroke-width="3"/> <circle cx="24" cy="27" r="11.5" fill="#F2B01E"/> <path d="M21 17 H27 V37 H21 Z" fill="#5C3A08" stroke="none"/> </g>`
export const SPEARMEN = `<g stroke="#211A14" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"> <path d="M9 26 L33 26 L30 45 L21 41 L12 45 Z" fill="#F2B01E"/> <path d="M18 28 H24 V41 H18 Z" fill="#5C3A08" stroke="none"/> <ellipse cx="21" cy="26" rx="14" ry="6" fill="#EFE4CC"/> <circle cx="21" cy="25" r="6" fill="#A9AEB0"/> <path d="M36 40 L36 12" stroke-width="4"/> <path d="M36 1 L42 13 L36 18 L30 13 Z" fill="#EFE4CC"/> </g>`
export const KNIGHTS = `<g stroke="#211A14" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"> <path d="M21 42 Q24 45 20 47" fill="none" stroke-width="4"/> <ellipse cx="21" cy="29" rx="11" ry="16" fill="#F2B01E"/> <path d="M18 24 H24 V43 H18 Z" fill="#5C3A08" stroke="none"/> <path d="M16 12 L13 7 L18 8 Z M26 12 L29 7 L24 8 Z" fill="#6E7478"/> <path d="M15 18 L16 4 H26 L27 18 Z" fill="#A9AEB0"/> <path d="M21 4 V12" stroke-width="2"/> <ellipse cx="21" cy="24" rx="10" ry="5" fill="#A9AEB0"/> <circle cx="21" cy="23" r="4.5" fill="#EFE4CC"/> <path d="M28 27 L41 7" stroke-width="4.5"/> <path d="M44 1 L44 11 L37 7 Z" fill="#EFE4CC"/> </g>`

export const violet = (art: string): string => art.replace(/#F2B01E/gi, '#6A3FB5').replace(/#5C3A08/gi, '#F3EDFF')

// Draws a 48 by 48 piece of art at (x, y), `size` wide, turned by `turn` degrees.
export const piece = (art: string, x: number, y: number, size: number, turn = 0): string =>
  `<g transform="translate(${x} ${y}) rotate(${turn} ${size / 2} ${size / 2}) scale(${size / 48})">${art}</g>`
