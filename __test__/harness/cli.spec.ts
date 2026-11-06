// @vitest-environment node

import { spawnSync } from 'node:child_process'
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

let fixture: string

beforeEach(() => {
  fixture = mkdtempSync(join(tmpdir(), 'ray-harness-'))
  mkdirSync(join(fixture, 'harness/context'), { recursive: true })
  mkdirSync(join(fixture, 'docs'))
  mkdirSync(join(fixture, '__test__/demo'), { recursive: true })
  copyFileSync(
    new URL('../../harness/run.mjs', import.meta.url),
    join(fixture, 'harness/run.mjs'),
  )

  for (const path of [
    'AGENTS.md',
    'docs/architecture.md',
    'docs/docs-handoff.md',
    'harness/README.md',
    'harness/plan.md',
  ]) {
    writeFileSync(join(fixture, path), '# Fixture\n')
  }

  writeFileSync(join(fixture, 'llms.txt'), '[Demo](harness/context/demo.md)\n')
  writeFileSync(
    join(fixture, 'harness/context/demo.md'),
    '# Demo\n\nRead [architecture](../../docs/architecture.md#fixture)。\n',
  )
  writeScope({ tests: ['__test__/demo/'] })
  writeScripts({ 'env:check': 'node -e "process.exit(23)"' })
})

afterEach(() => {
  rmSync(fixture, { recursive: true, force: true })
})

function run(...args: string[]) {
  return spawnSync(process.execPath, ['harness/run.mjs', ...args], {
    cwd: fixture,
    encoding: 'utf8',
  })
}

function writeScope(targets: { tests?: string[]; checks?: string[] }) {
  writeFileSync(
    join(fixture, 'harness/scopes.json'),
    JSON.stringify({ demo: { description: 'Demo', ...targets } }),
  )
}

function writeScripts(scripts: Record<string, string>) {
  writeFileSync(join(fixture, 'package.json'), JSON.stringify({ scripts }))
}

function readReport() {
  const runs = join(fixture, '.harness-local/runs')
  const [runDirectory] = readdirSync(runs)

  return JSON.parse(
    readFileSync(join(runs, runDirectory, 'report.json'), 'utf8'),
  )
}

it('rejects directories without regression tests', () => {
  const result = run('check')

  expect(result.status).toBe(1)
  expect(result.stderr).toContain(
    'regression test path contains no tests: __test__/demo/',
  )
})

it('reports the source and broken link when an indexed implementation moves', () => {
  writeFileSync(join(fixture, '__test__/demo/example.spec.ts'), '')
  expect(run('check').status).toBe(0)

  rmSync(join(fixture, 'docs/architecture.md'))
  const result = run('check')

  expect(result.status).toBe(1)
  expect(result.stderr).toContain(
    'harness/context/demo.md: invalid relative link: ../../docs/architecture.md#fixture',
  )
})

it('rejects registered topics missing from the static entry point', () => {
  writeFileSync(join(fixture, '__test__/demo/example.spec.ts'), '')
  writeFileSync(join(fixture, 'llms.txt'), '# Empty index\n')
  const result = run('check')

  expect(result.status).toBe(1)
  expect(result.stderr).toContain('llms.txt is missing a valid topic link')
})

it('shows context and runs project checks for scopes without Vitest', () => {
  writeScope({ checks: ['docs:check'] })
  writeScripts({
    'env:check': 'node --version',
    'docs:check': 'node -e "console.log(process.cwd())"',
  })

  expect(run('check').status).toBe(0)
  const context = run('context', 'demo')

  expect(context.status).toBe(0)
  expect(context.stdout).toContain(
    'Read [architecture](../../docs/architecture.md#fixture)',
  )
  expect(context.stdout).toContain('pnpm docs:check')

  expect(run('verify', 'demo').status).toBe(0)
  expect(readReport()).toMatchObject({
    scope: 'demo',
    status: 'passed',
    steps: [
      { command: 'pnpm env:check', exitCode: 0 },
      { command: 'pnpm docs:check', exitCode: 0 },
    ],
  })
})

it('rejects registering full checks as targeted checks to prevent recursion', () => {
  writeScope({ checks: ['check'] })
  writeScripts({ check: 'node harness/run.mjs check' })

  const result = run('verify', 'demo')

  expect(result.status).toBe(1)
  expect(result.stderr).toContain('demo: unregistered check command: check')
})

it('stops subsequent checks and records failure when a child command fails', () => {
  writeFileSync(join(fixture, '__test__/demo/example.spec.ts'), '')

  const result = run('verify', 'demo')

  expect(result.status).toBe(23)
  expect(readReport()).toMatchObject({
    scope: 'demo',
    status: 'failed',
    steps: [{ command: 'pnpm env:check', exitCode: 23 }],
  })
})

it('runs only registered tests without appending full checks', () => {
  writeFileSync(join(fixture, '__test__/demo/example.spec.ts'), '')
  writeScripts({
    'env:check': 'node --version',
    'test:run': 'node -e "process.exit(0)"',
    check: 'node -e "process.exit(97)"',
  })

  expect(run('verify', 'demo').status).toBe(0)
  expect(readReport()).toMatchObject({
    scope: 'demo',
    status: 'passed',
    steps: [
      { command: 'pnpm env:check', exitCode: 0 },
      { command: 'pnpm test:run __test__/demo/', exitCode: 0 },
    ],
  })
})

it.each(['api:check', 'icons:check'])(
  'stops regressions and records failure when targeted %s finds stale artifacts',
  (script) => {
    writeFileSync(join(fixture, '__test__/demo/example.spec.ts'), '')
    writeScope({ checks: [script], tests: ['__test__/demo/'] })
    writeScripts({
      'env:check': 'node --version',
      [script]: 'node -e "process.exit(23)"',
      'test:run': 'node -e "process.exit(97)"',
    })

    expect(run('verify', 'demo').status).toBe(23)
    expect(readReport()).toMatchObject({
      scope: 'demo',
      status: 'failed',
      steps: [
        { command: 'pnpm env:check', exitCode: 0 },
        { command: `pnpm ${script}`, exitCode: 23 },
      ],
    })
  },
)

it.each([{ args: [] }, { args: ['all'] }])(
  'preserves pnpm check compatibility for the full-check entry point $args',
  ({ args }) => {
    writeScripts({ check: 'node --version' })

    expect(run('verify', ...args).status).toBe(0)
    expect(readReport()).toMatchObject({
      scope: 'all',
      status: 'passed',
      steps: [{ command: 'pnpm check', exitCode: 0 }],
    })
  },
)
