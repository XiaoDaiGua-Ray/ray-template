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
  mkdirSync(join(fixture, 'harness'))
  mkdirSync(join(fixture, '__test__/demo'), { recursive: true })
  copyFileSync(
    new URL('../../harness/run.mjs', import.meta.url),
    join(fixture, 'harness/run.mjs'),
  )
  writeFileSync(
    join(fixture, 'harness/scopes.json'),
    JSON.stringify({
      demo: {
        description: 'Demo',
        paths: ['harness'],
        tests: ['__test__/demo/'],
      },
    }),
  )
  writeFileSync(
    join(fixture, 'package.json'),
    JSON.stringify({ scripts: { 'env:check': 'node -e "process.exit(23)"' } }),
  )
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

it('拒绝没有回归用例的目录', () => {
  const result = run('check')

  expect(result.status).toBe(1)
  expect(result.stderr).toContain('回归测试路径没有用例：__test__/demo/')
})

it('子命令失败时停止后续验证，并记录失败状态', () => {
  writeFileSync(join(fixture, '__test__/demo/example.spec.ts'), '')

  const result = run('verify', 'demo')
  const runs = join(fixture, '.harness-local/runs')
  const [runDirectory] = readdirSync(runs)
  const report = JSON.parse(
    readFileSync(join(runs, runDirectory, 'report.json'), 'utf8'),
  )

  expect(result.status).toBe(23)
  expect(report).toMatchObject({
    scope: 'demo',
    status: 'failed',
    steps: [{ command: 'pnpm env:check', exitCode: 23 }],
  })
})
