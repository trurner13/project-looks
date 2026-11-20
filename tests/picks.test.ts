import { expect, mock, test } from 'claude-code/testing'

// Each hook below stands for the engine. The store is kept in memory; the
// session's folder and the scenes the plugin sets are recorded here.
const setUp = (on: Parameters<Parameters<typeof test>[1]>[1], folder: { cwd: string }, scenes: string[]) => {
  mock.store(on)
  on('command.register', () => ({ value: { command: 'project-look' } }))
  on('session.cwd', () => ({ value: folder.cwd }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('theme.set', (_, e) => {
    const backdrop = (e as { backdrop?: { scene?: string } }).backdrop
    scenes.push(backdrop?.scene ?? 'none')
    return { value: { isDrawn: true, requestId: 'r' } }
  })
  on('theme.clear', () => {
    scenes.push('cleared')
    return { value: undefined }
  })
}

test('each project keeps its own pick, and others follow the default', async ($, on) => {
  const folder = { cwd: 'C:\\repos\\alpha' }
  const scenes: string[] = []
  setUp(on, folder, scenes)

  await $.session.start({ cwd: folder.cwd, surface: 'desktop', isInteractive: true })
  expect(scenes.at(-1)).toBe('night-reef')

  await $.command.run({ command: 'project-look', args: 'hex-station' })
  expect(scenes.at(-1)).toBe('hex-station')

  // Another repo has no pick: it follows the default.
  folder.cwd = 'C:\\repos\\beta'
  await $.session.start({ cwd: folder.cwd, surface: 'desktop', isInteractive: true })
  expect(scenes.at(-1)).toBe('night-reef')

  // The first repo, in another case and through a worktree, keeps its pick.
  folder.cwd = 'c:/Repos/Alpha/.claude/worktrees/feature-x'
  await $.session.start({ cwd: folder.cwd, surface: 'desktop', isInteractive: true })
  expect(scenes.at(-1)).toBe('hex-station')
})

test('the default changes where no project picked, and reset follows it', async ($, on) => {
  const folder = { cwd: 'C:\\repos\\alpha' }
  const scenes: string[] = []
  setUp(on, folder, scenes)

  await $.session.start({ cwd: folder.cwd, surface: 'desktop', isInteractive: true })
  await $.command.run({ command: 'project-look', args: 'observatory' })
  const answer = await $.command.run({ command: 'project-look', args: 'alien-aurora everywhere' })
  expect(answer.text ?? '').toContain('This project keeps Observatory')

  folder.cwd = 'C:\\repos\\gamma'
  await $.session.start({ cwd: folder.cwd, surface: 'desktop', isInteractive: true })
  expect(scenes.at(-1)).toBe('alien-aurora')

  folder.cwd = 'C:\\repos\\alpha'
  await $.command.run({ command: 'project-look', args: 'reset' })
  expect(scenes.at(-1)).toBe('alien-aurora')
})

test('off in one project leaves it bare so /custom-theme can show', async ($, on) => {
  const folder = { cwd: 'C:\\repos\\alpha' }
  const scenes: string[] = []
  setUp(on, folder, scenes)

  await $.session.start({ cwd: folder.cwd, surface: 'desktop', isInteractive: true })
  await $.command.run({ command: 'project-look', args: 'off' })
  expect(scenes.at(-1)).toBe('cleared')

  const before = scenes.length
  await $.session.start({ cwd: folder.cwd, surface: 'desktop', isInteractive: true })
  expect(scenes.length).toBe(before)
})

test('a folder with no pick starts on the default look', async ($, on) => {
  const folder = { cwd: String.raw`D:\code\some-repo` }
  const scenes: string[] = []
  setUp(on, folder, scenes)

  await $.session.start({ cwd: folder.cwd, surface: 'desktop', isInteractive: true })
  expect(scenes.at(-1)).toBe('night-reef')
})

test('every look frosts the app panels, so the footer shows no bar', async ($, on) => {
  const folder = { cwd: String.raw`D:\code\somewhere` }
  const glasses: unknown[] = []
  mock.store(on)
  on('command.register', () => ({ value: { command: 'project-look' } }))
  on('session.cwd', () => ({ value: folder.cwd }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('theme.set', (_, e) => {
    glasses.push((e as { backdrop?: { glass?: unknown } }).backdrop?.glass)
    return { value: { isDrawn: true, requestId: 'r' } }
  })
  await $.session.start({ cwd: folder.cwd, surface: 'desktop', isInteractive: true })
  for (const name of ['night-reef', 'atomic-goats', 'body-scan', 'applications-board', 'night-lab', 'cyanotype', 'heraldic-banners', 'black-hole', 'hex-station', 'observatory', 'alien-aurora']) {
    await $.command.run({ command: 'project-look', args: name })
  }
  expect(glasses.length).toBe(12)
  for (const glass of glasses) expect(glass === false || glass === undefined).toBe(false)
})
