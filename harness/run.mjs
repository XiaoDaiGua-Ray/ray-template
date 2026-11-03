import { spawnSync } from 'node:child_process'
import {
  existsSync,
  globSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const scopes = JSON.parse(
  readFileSync(join(root, 'harness/scopes.json'), 'utf8'),
)
const [action = '--help', scope, ...extra] = process.argv.slice(2)
const testPattern = /^__test__\/(?:[\w-]+\/)+(?:[\w.-]+\.spec\.tsx?)?$/

function checkScopes() {
  const problems = []

  for (const [name, { paths, tests }] of Object.entries(scopes)) {
    for (const path of paths) {
      if (!existsSync(join(root, path))) {
        problems.push(`${name} 的上下文路径不存在：${path}`)
      }
    }

    if (tests.length === 0) {
      problems.push(`${name} 需要至少一个回归测试路径`)
    }

    for (const path of tests) {
      if (!testPattern.test(path) || !existsSync(join(root, path))) {
        problems.push(`${name} 的回归测试路径无效：${path}`)
        continue
      }

      const stat = statSync(join(root, path))
      const hasTests = path.endsWith('/')
        ? stat.isDirectory() &&
          globSync('**/*.spec.{ts,tsx}', { cwd: join(root, path) }).length > 0
        : stat.isFile()

      if (!hasTests) {
        problems.push(`${name} 的回归测试路径没有用例：${path}`)
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(problems.join('\n'))
  }
}

function showContext(name) {
  if (!name) {
    for (const [id, { description }] of Object.entries(scopes)) {
      console.log(`${id}  ${description}`)
    }

    return
  }

  const { description, paths, tests } = scopes[name]

  console.log(`${name}  ${description}`)
  console.log(paths.map((path) => `  ${path}`).join('\n'))
  console.log(`定向验证：pnpm harness verify ${name}`)
  console.log(`回归用例：pnpm test:run ${tests.join(' ')}`)
}

function verify(name) {
  if (name !== 'all') {
    checkScopes()
  }

  const commands =
    name === 'all'
      ? [['check']]
      : [['env:check'], ['test:run', ...scopes[name].tests]]
  const reports = join(root, '.harness-local', 'runs')
  const startedAt = new Date().toISOString()
  const steps = []
  let exitCode = 0

  mkdirSync(reports, { recursive: true })

  const reportPath = join(mkdtempSync(join(reports, `${name}-`)), 'report.json')

  for (const args of commands) {
    const command = `pnpm ${args.join(' ')}`
    const started = performance.now()

    console.log(`\n> ${command}`)

    // Windows 需要 shell 启动 pnpm.cmd，参数来自固定命令与已校验的测试路径。
    const options = { cwd: root, stdio: 'inherit' }
    const result =
      process.platform === 'win32'
        ? spawnSync(command, { ...options, shell: true })
        : spawnSync('pnpm', args, options)

    steps.push({
      command,
      exitCode: result.status,
      signal: result.signal,
      errorCode: result.error?.code ?? null,
      durationMs: Math.round(performance.now() - started),
    })

    if (result.status !== 0) {
      exitCode = result.status ?? 1
      console.error(
        result.error?.message ??
          `${command} 失败（${result.signal ?? exitCode}）`,
      )
      break
    }
  }

  const report = {
    schemaVersion: 1,
    scope: name,
    startedAt,
    finishedAt: new Date().toISOString(),
    node: process.versions.node,
    platform: process.platform,
    status: exitCode === 0 ? 'passed' : 'failed',
    steps,
  }

  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`\n验收报告：${relative(root, reportPath)}`)
  process.exitCode = exitCode
}

try {
  const knownScope = scope && Object.hasOwn(scopes, scope)

  if (action === '--help' && !scope) {
    console.log(`pnpm harness context [scope]    查看任务上下文
pnpm harness verify [scope]     定向验证，省略 scope 时执行全量检查
pnpm harness check              检查上下文与回归路径`)
  } else if (
    action === 'context' &&
    extra.length === 0 &&
    (!scope || knownScope)
  ) {
    showContext(scope)
  } else if (
    action === 'verify' &&
    extra.length === 0 &&
    (!scope || scope === 'all' || knownScope)
  ) {
    verify(scope ?? 'all')
  } else if (action === 'check' && !scope) {
    checkScopes()
    console.log('✓ Harness 上下文与回归路径有效')
  } else {
    throw new Error(
      '无效命令或任务域。使用 pnpm harness --help 或 pnpm harness context。',
    )
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
