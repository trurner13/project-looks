import type { Register, ThemeBackdropGlass, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { ALIEN_AURORA_SVG } from './scenes/alien-aurora.js'
import { APPLICATIONS_BOARD_SVG } from './scenes/applications-board.js'
import { ATOMIC_GOATS_SVG } from './scenes/atomic-goats.js'
import { BLACK_HOLE_SVG } from './scenes/black-hole.js'
import { BODY_SCAN_SVG } from './scenes/body-scan.js'
import { CYANOTYPE_SVG } from './scenes/cyanotype.js'
import { HERALDIC_BANNERS_SVG } from './scenes/heraldic-banners.js'
import { HEX_STATION_SVG } from './scenes/hex-station.js'
import { NIGHT_LAB_SVG } from './scenes/night-lab.js'
import { nightReefSvg } from './scenes/night-reef.js'
import { OBSERVATORY_SVG } from './scenes/observatory.js'

type Roles = { accent: string; danger: string; success: string; warning: string; pro: string }
type Anchors = {
  'surface-0': string
  'surface-1': string
  'surface-2': string
  'surface-3': string
  'text-primary': string
  'text-secondary': string
  'text-muted': string
}

// A look brings its own colors (roles and anchors), or keeps the app's dark
// colors under a glass, as the official scenes do.
type Look = { id: string; title: string; about: string; scene: string; alt: string; roles?: Roles; anchors?: Anchors; glass?: ThemeBackdropGlass }

const LOOKS: Look[] = [
  {
    id: 'night-reef',
    title: 'Night Reef',
    about: "Anthropic's night lagoon: a glowing turtle and a ray swimming the edges",
    scene: nightReefSvg(),
    alt: 'A dark lagoon where a tile-mosaic turtle and manta ray glow teal as they swim along the edges of the window',
    // The official theme's own glass, so it looks as it does there.
    glass: { blur: 14, tint: '#0a1430', opacity: 0.4 },
  },
  {
    id: 'black-hole',
    title: 'Black hole',
    about: 'six halftone planets orbiting a black hole',
    scene: BLACK_HOLE_SVG,
    alt: 'Halftone planets orbiting a black hole with a glowing disk, under twinkling stars',
    roles: { accent: '#ff8a4c', danger: '#ff5a5f', success: '#5fd0a0', warning: '#f7c873', pro: '#9d8cff' },
    anchors: {
      'surface-0': '#0d1020',
      'surface-1': '#13172b',
      'surface-2': '#181d34',
      'surface-3': '#1d223c',
      'text-primary': '#f6efdf',
      'text-secondary': '#d6cdb9',
      'text-muted': '#aaa290',
    },
  },
  {
    id: 'hex-station',
    title: 'Hex station',
    about: 'a honeycomb station wall with a window onto a giant planet',
    scene: HEX_STATION_SVG,
    alt: 'A honeycomb space-station wall whose cells light up in turn, with a hexagonal window onto a banded planet and its moon',
    roles: { accent: '#f7b84a', danger: '#ff5a5f', success: '#5fd0a0', warning: '#ffcf6b', pro: '#9fb4ff' },
    anchors: {
      'surface-0': '#0b0e18',
      'surface-1': '#111522',
      'surface-2': '#161b2b',
      'surface-3': '#1b2033',
      'text-primary': '#f2ede2',
      'text-secondary': '#cfc8b8',
      'text-muted': '#a59e8e',
    },
  },
  {
    id: 'observatory',
    title: 'Observatory',
    about: 'a brass porthole and a telescope, a ringed planet drifting by',
    scene: OBSERVATORY_SVG,
    alt: 'A warm observatory with a brass porthole showing a drifting ringed planet, and a telescope under a star chart',
    roles: { accent: '#5fd0c4', danger: '#ff6b5a', success: '#8fd18a', warning: '#e8b04a', pro: '#b59cff' },
    anchors: {
      'surface-0': '#14100c',
      'surface-1': '#1b1611',
      'surface-2': '#211b15',
      'surface-3': '#272019',
      'text-primary': '#f5ecdc',
      'text-secondary': '#d8cbb4',
      'text-muted': '#ad9f88',
    },
  },
  {
    id: 'atomic-goats',
    title: 'Atomic Goats',
    about: 'the Atomic Goats mark in gold halftone on plum, electrons orbiting',
    scene: ATOMIC_GOATS_SVG,
    alt: 'The Atomic Goats goat-and-orbit mark printed in gold dots on dark plum, with a gold sheen and orbiting electrons',
    // Brand colours: plum surfaces, ivory text, gold and berry accents.
    roles: { accent: '#d9b25a', danger: '#ff6b6b', success: '#7fcf9a', warning: '#e8b04a', pro: '#c46a8e' },
    anchors: {
      'surface-0': '#231d25',
      'surface-1': '#2a232d',
      'surface-2': '#302834',
      'surface-3': '#362e3a',
      'text-primary': '#F5EDE8',
      'text-secondary': '#dccbc0',
      'text-muted': '#b3a196',
    },
  },
  {
    id: 'body-scan',
    title: 'Body scan',
    about: 'a dotted wireframe body, a teal band scanning its measurements',
    scene: BODY_SCAN_SVG,
    alt: 'A wireframe body of dotted rings with a teal head, a bright band scanning down it and chest, waist, hip and leg readings lighting up',
    // Teal on dark teal-grey.
    roles: { accent: '#1bbc9b', danger: '#ff6b6b', success: '#5fd08a', warning: '#f2b45a', pro: '#9fa8ff' },
    anchors: {
      'surface-0': '#101516',
      'surface-1': '#161c1e',
      'surface-2': '#1b2224',
      'surface-3': '#20282a',
      'text-primary': '#eef3f1',
      'text-secondary': '#c9d3d0',
      'text-muted': '#9aa6a3',
    },
  },
  {
    id: 'applications-board',
    title: 'Applications board',
    about: 'an amber LED board flipping roles and where each application stands',
    scene: APPLICATIONS_BOARD_SVG,
    alt: 'An amber LED departure board listing generic roles and statuses that flip from new to applied, screen to interview',
    // Amber on near-black, like a station board.
    roles: { accent: '#ffb000', danger: '#ff6b5a', success: '#7fd37f', warning: '#f2c45a', pro: '#9fb4ff' },
    anchors: {
      'surface-0': '#0e0d0c',
      'surface-1': '#151311',
      'surface-2': '#1a1815',
      'surface-3': '#201d19',
      'text-primary': '#f3ece0',
      'text-secondary': '#cfc6b6',
      'text-muted': '#a39a8a',
    },
  },
  {
    id: 'night-lab',
    title: 'Night lab',
    about: 'a flask bubbling over a flickering Bunsen flame on a lab bench',
    scene: NIGHT_LAB_SVG,
    alt: 'A chemistry bench at night in dots: a conical flask of blue liquid bubbling over a Bunsen flame, steam rising, test tubes in a rack',
    // The virtual lab viewer's slate, blue and cream.
    roles: { accent: '#5b9be0', danger: '#ff6b6b', success: '#5fd08a', warning: '#ffd27d', pro: '#b49cff' },
    anchors: {
      'surface-0': '#121920',
      'surface-1': '#18202a',
      'surface-2': '#1d2631',
      'surface-3': '#222c38',
      'text-primary': '#eef3f8',
      'text-secondary': '#c8d3de',
      'text-muted': '#99a6b4',
    },
  },
  {
    id: 'cyanotype',
    title: 'Cyanotype',
    about: "perigee's blueprint look: an orbit plot with Pe lighting up, and the drop pod drawn in white lines",
    scene: CYANOTYPE_SVG,
    alt: 'A Prussian-blue blueprint: a craft orbiting a planet with Pe lighting at perigee, and a drop pod redrawing itself in white lines',
    // Prussian blues and white lines, from perigee's Cyanotype look.
    roles: { accent: '#8fc1f0', danger: '#ff6b6b', success: '#5fd08a', warning: '#E69F00', pro: '#b49cff' },
    anchors: {
      'surface-0': '#0f2236',
      'surface-1': '#132a42',
      'surface-2': '#17304b',
      'surface-3': '#1b3654',
      'text-primary': '#eef4fa',
      'text-secondary': '#c7d6e6',
      'text-muted': '#97abc1',
    },
  },
  {
    id: 'heraldic-banners',
    title: 'Heraldic banners',
    about: "auto-battler's inked heraldry: gold and violet banners with their crests, armies facing off",
    scene: HERALDIC_BANNERS_SVG,
    alt: 'Two inked swallowtail banners, gold with an umber bar and violet with a lilac bar, bearing a keep and a watchtower, with unit counters facing each other',
    // auto-battler's team gold and violet on dark ink, vellum text.
    roles: { accent: '#F2B01E', danger: '#ff6b5a', success: '#7fcf7f', warning: '#e8b04a', pro: '#9a75e0' },
    anchors: {
      'surface-0': '#17131b',
      'surface-1': '#1d1822',
      'surface-2': '#221c28',
      'surface-3': '#28212e',
      'text-primary': '#f3eddf',
      'text-secondary': '#d6ccbb',
      'text-muted': '#a89e8e',
    },
  },
  {
    id: 'alien-aurora',
    title: 'Alien aurora',
    about: 'swaying green and blue aurora over an alien ridge, two moons',
    scene: ALIEN_AURORA_SVG,
    alt: 'Green and blue aurora curtains made of dots swaying over a dark alien ridge with rock spires and two moons',
    roles: { accent: '#45d6a4', danger: '#ff6b6b', success: '#9be37a', warning: '#f2c45a', pro: '#8fa8ff' },
    anchors: {
      'surface-0': '#050d12',
      'surface-1': '#0a151b',
      'surface-2': '#0e1b22',
      'surface-3': '#122128',
      'text-primary': '#e8f3ee',
      'text-secondary': '#c2d4cc',
      'text-muted': '#93a8a0',
    },
  },
]

const DEFAULT = 'night-reef'
// Built-in picks for folders, used until /project-look sets one there. Empty
// here: add entries such as 'c:/code/my-repo': 'night-lab' to give your own
// repos a look from their first session. Keys are folders as projectOf writes
// them: forward slashes, lower case.
const REPO_LOOKS: Readonly<Record<string, string>> = {}
// A new key, so an older pick (or "off") gives way to the new default once.
const STORE_KEY = 'look-v2'
const COMMAND = 'project-look'

// Built once per load: each look's colors, and the line that would stop
// Desktop painting it, if any.
// Each scene's own background colour. The app's panels (the message box's
// footer, the sidebar) are frosted with a glass tinted to it, as Anthropic's
// scenes do. With no glass, the panels stay solid and the footer shows as a
// flat bar across the bottom of the scene.
const GROUNDS: Readonly<Record<string, string>> = {
  'black-hole': '#0b0d1a',
  'hex-station': '#070912',
  observatory: '#14100c',
  'alien-aurora': '#050d12',
  'atomic-goats': '#231d25',
  'body-scan': '#101516',
  'applications-board': '#0e0d0c',
  'night-lab': '#121920',
  cyanotype: '#10243a',
  'heraldic-banners': '#17131b',
}
const glassFor = (look: Look): ThemeBackdropGlass | false => {
  if (look.glass !== undefined) return look.glass
  const tint = GROUNDS[look.id]
  return tint === undefined ? false : { blur: 14, tint, opacity: 0.45 }
}

const BUILT = new Map(
  LOOKS.map(look => {
    if (look.roles === undefined || look.anchors === undefined) {
      const args: ThemeSetArgs = { backdrop: { scene: look.id, glass: glassFor(look) }, overrideColorScheme: 'dark' }
      return [look.id, { look, args, unpainted: undefined }] as const
    }
    const { theme, problems } = makeColors({ label: look.title, only: 'dark', roles: look.roles, dark: { gray: { anchors: look.anchors } } })
    const args: ThemeSetArgs = { colors: theme, backdrop: { scene: look.id, glass: glassFor(look) } }
    return [look.id, { look, args, unpainted: problems.find(line => line.startsWith("Desktop won't paint")) }] as const
  }),
)

const find = (words: string): Look | undefined => {
  const key = words.trim().toLowerCase().replace(/\s+/g, '-')
  if (key === '') return undefined
  const byNumber = Number(key)
  if (Number.isInteger(byNumber) && byNumber >= 1 && byNumber <= LOOKS.length) return LOOKS[byNumber - 1]
  return LOOKS.find(look => look.id === key || look.id.startsWith(key))
}

// Picks are kept per project (the session's folder) and as a default for
// projects with none. A worktree under a repo's .claude/worktrees counts as
// that repo. Folder names are compared without regard to case or slashes.
const projectOf = (cwd: string): string =>
  cwd
    .replace(/\\/g, '/')
    .replace(/\/\.claude\/worktrees\/[^/]+.*$/, '')
    .replace(/\/+$/, '')
    .toLowerCase()
const projectKey = (cwd: string): string => `project:${projectOf(cwd)}`

type Picks = { project: string | undefined; fallback: string }

const picks = async ($: { store: { get: (key: string) => Promise<unknown> }; session: { cwd: () => Promise<string> } }): Promise<Picks & { key: string }> => {
  const key = projectKey(await $.session.cwd())
  const project = await $.store.get(key)
  const fallback = await $.store.get(STORE_KEY)
  const builtIn = REPO_LOOKS[key.slice('project:'.length)]
  return {
    key,
    project: typeof project === 'string' ? project : builtIn,
    fallback: typeof fallback === 'string' ? fallback : DEFAULT,
  }
}

const name = (id: string): string => (id === 'off' ? 'off' : (BUILT.get(id)?.look.title ?? id))

const list = ({ project, fallback }: Picks): string => {
  const here = project ?? fallback
  return (
    LOOKS.map((look, i) => `${i + 1}. ${look.id}${look.id === here ? ' (in use here)' : ''}: ${look.about}`).join('\n') +
    `\n\nThis project: ${project === undefined ? `follows the default (${name(fallback)})` : name(project)}. Default everywhere else: ${name(fallback)}.` +
    `\n/${COMMAND} <name> sets this project, /${COMMAND} <name> everywhere sets the default,` +
    `\n/${COMMAND} off turns it off here (so /custom-theme can show), /${COMMAND} reset makes this project follow the default.`
  )
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    try {
      await $.command.register({
        name: COMMAND,
        description: 'Your backdrop for this project: night-reef, atomic-goats, body-scan, applications-board, night-lab, cyanotype, heraldic-banners, black-hole, hex-station, observatory, alien-aurora; add "everywhere" for the default; "off", "reset", or no name to list',
      })
    } catch (error) {
      $.ui.toast(`project-looks: /${COMMAND} is not available (${String(error)})`)
    }

    const { project, fallback } = await picks($)
    const built = BUILT.get(project ?? fallback)

    if (built !== undefined) {
      if (built.unpainted !== undefined) $.ui.toast(built.unpainted)
      const set = await $.theme.set(built.args)
      if (!set.isDrawn) $.ui.status(set.reason)
    }

    return next(e)
  })

  on('command.run', { command: COMMAND }, async ($, e) => {
    const state = await picks($)
    const parts = e.args.trim().split(/\s+/).filter(word => word !== '')
    const everywhere = parts[parts.length - 1]?.toLowerCase() === 'everywhere'
    const words = (everywhere ? parts.slice(0, -1) : parts).join(' ').toLowerCase()

    if (words === '' || words === 'list') return { text: list(state) }

    // What this session should show after the change.
    const apply = async (id: string): Promise<string> => {
      const built = BUILT.get(id)
      if (built === undefined) {
        await $.theme.clear()
        return ''
      }
      const set = await $.theme.set(built.args)
      return set.isDrawn ? '' : ` This window doesn't draw backdrops: ${set.reason}`
    }

    if (words === 'reset') {
      await $.store.delete(state.key)
      return { text: `This project now follows the default (${name(state.fallback)}).${await apply(state.fallback)}` }
    }

    const look = words === 'off' ? undefined : find(words)
    const id = words === 'off' ? 'off' : look?.id

    if (id === undefined) return { text: `No look called "${words}".\n\n${list(state)}` }

    if (everywhere) {
      await $.store.set(STORE_KEY, id)
      const showsHere = state.project === undefined
      const note = showsHere ? await apply(id) : ''
      return {
        text: `Default set to ${name(id)} for every project without a pick of its own.${showsHere ? '' : ` This project keeps ${name(state.project ?? id)}; /${COMMAND} reset makes it follow the default.`}${note}`,
      }
    }

    await $.store.set(state.key, id)
    const note = await apply(id)
    return {
      text:
        id === 'off'
          ? `Backdrop off for this project; /custom-theme can show here now.${note}`
          : `This project now uses ${name(id)}: ${look?.about ?? ''}.${note}`,
    }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.plugin !== 'project-looks') {
      return next(e)
    }
    const built = BUILT.get(e.props.scene)

    if (built === undefined) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={built.look.scene} alt={built.look.alt} isInteractive />
  })
}
