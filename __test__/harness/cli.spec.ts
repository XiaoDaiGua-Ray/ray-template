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
    '# Demo\n\n先读 [架构](../../docs/architecture.md#fixture)。\n',
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

it('拒绝没有回归用例的目录', () => {
  const result = run('check')

  expect(result.status).toBe(1)
  expect(result.stderr).toContain('回归测试路径没有用例：__test__/demo/')
})

it('移动索引引用的实现后，检查会报告来源与断链', () => {
  writeFileSync(join(fixture, '__test__/demo/example.spec.ts'), '')
  expect(run('check').status).toBe(0)

  rmSync(join(fixture, 'docs/architecture.md'))
  const result = run('check')

  expect(result.status).toBe(1)
  expect(result.stderr).toContain(
    'harness/context/demo.md 的相对链接无效：../../docs/architecture.md#fixture',
  )
})

it('拒绝未从静态入口链接的已注册主题', () => {
  writeFileSync(join(fixture, '__test__/demo/example.spec.ts'), '')
  writeFileSync(join(fixture, 'llms.txt'), '# 空入口\n')
  const result = run('check')

  expect(result.status).toBe(1)
  expect(result.stderr).toContain('llms.txt 缺少可用的主题链接')
})

it('无 Vitest 的任务域能展示索引并执行现有项目检查', () => {
  writeScope({ checks: ['docs:check'] })
  writeScripts({
    'env:check': 'node --version',
    'docs:check': 'node -e "console.log(process.cwd())"',
  })

  expect(run('check').status).toBe(0)
  const context = run('context', 'demo')

  expect(context.status).toBe(0)
  expect(context.stdout).toContain(
    '先读 [架构](../../docs/architecture.md#fixture)',
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

it('拒绝把全量检查登记为定向检查，避免递归调用', () => {
  writeScope({ checks: ['check'] })
  writeScripts({ check: 'node harness/run.mjs check' })

  const result = run('verify', 'demo')

  expect(result.status).toBe(1)
  expect(result.stderr).toContain('demo 的检查命令未注册：check')
})

it('子命令失败时停止后续验证，并记录失败状态', () => {
  writeFileSync(join(fixture, '__test__/demo/example.spec.ts'), '')

  const result = run('verify', 'demo')

  expect(result.status).toBe(23)
  expect(readReport()).toMatchObject({
    scope: 'demo',
    status: 'failed',
    steps: [{ command: 'pnpm env:check', exitCode: 23 }],
  })
})
