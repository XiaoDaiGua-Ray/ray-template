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
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const scopes = JSON.parse(
  readFileSync(join(root, 'harness/scopes.json'), 'utf8'),
)
const [action = '--help', scope, ...extra] = process.argv.slice(2)
const testPattern = /^__test__\/(?:[\w-]+\/)+(?:[\w.-]+\.spec\.tsx?)?$/
const scopePattern = /^[a-z][a-z\d]*(?:-[a-z\d]+)*$/
const allowedChecks = new Set(['docs:check', 'packages:check', 'typecheck'])
const indexFiles = [
  'AGENTS.md',
  'llms.txt',
  'docs/architecture.md',
  'docs/docs-handoff.md',
  'harness/README.md',
  'harness/plan.md',
]

function contextPath(name) {
  return `harness/context/${name}.md`
}

function checkScopes() {
  const problems = []
  const { scripts } = JSON.parse(
    readFileSync(join(root, 'package.json'), 'utf8'),
  )

  for (const [name, { description, tests = [], checks = [] }] of Object.entries(
    scopes,
  )) {
    if (!scopePattern.test(name) || name === 'all') {
      problems.push(`无效任务域：${name}`)
    }

    if (typeof description !== 'string' || !description.trim()) {
      problems.push(`${name} 需要任务描述`)
    }

    if (!Array.isArray(tests) || !Array.isArray(checks)) {
      problems.push(`${name} 的 tests 和 checks 必须为数组`)
      continue
    }

    if (tests.length === 0 && checks.length === 0) {
      problems.push(`${name} 需要至少一个回归测试路径或检查命令`)
    }

    for (const script of checks) {
      if (!allowedChecks.has(script) || typeof scripts?.[script] !== 'string') {
        problems.push(`${name} 的检查命令未注册：${script}`)
      }
    }

    for (const path of tests) {
      if (
        typeof path !== 'string' ||
        !testPattern.test(path) ||
        !existsSync(join(root, path))
      ) {
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

function checkIndexes() {
  const problems = []
  const cards = Object.keys(scopes).map(contextPath)
  const entryLinks = new Set()

  for (const path of [...indexFiles, ...cards]) {
    const file = join(root, path)

    if (!existsSync(file) || !statSync(file).isFile()) {
      problems.push(`索引文档不存在：${path}`)
      continue
    }

    // 索引统一使用行内相对链接；只检查文件目标，不请求外链或解析标题。
    const markdown = readFileSync(file, 'utf8')

    for (const [, href] of markdown.matchAll(/\[[^\]\n]+\]\(([^)\s]+)\)/g)) {
      const [target] = href.split('#', 1)

      if (!target || /^(?:[\w+.-]+:|\/\/)/.test(target)) continue

      const destination = resolve(dirname(file), target)
      const fromRoot = relative(root, destination)

      if (
        isAbsolute(target) ||
        isAbsolute(fromRoot) ||
        fromRoot === '..' ||
        fromRoot.startsWith(`..${sep}`) ||
        !existsSync(destination)
      ) {
        problems.push(`${path} 的相对链接无效：${href}`)
      } else if (path === 'llms.txt') {
        entryLinks.add(destination)
      }
    }
  }

  for (const path of cards) {
    if (!entryLinks.has(join(root, path))) {
      problems.push(`llms.txt 缺少可用的主题链接：${path}`)
    }
  }

  for (const file of globSync('harness/context/*.md', { cwd: root })) {
    if (!cards.includes(file.split(sep).join('/'))) {
      problems.push(`主题索引尚未注册：${file}`)
    }
  }

  if (problems.length > 0) {
    throw new Error(problems.join('\n'))
  }
}

function scopeCommands(name) {
  const { tests = [], checks = [] } = scopes[name]

  return [
    ['env:check'],
    ...checks.map((script) => [script]),
    ...(tests.length ? [['test:run', ...tests]] : []),
  ]
}

function showContext(name) {
  if (!name) {
    for (const [id, { description }] of Object.entries(scopes)) {
      console.log(`${id}  ${description}`)
    }

    return
  }

  const path = contextPath(name)

  console.log(`阅读入口：${path}（正文链接相对此文件）\n`)
  console.log(readFileSync(join(root, path), 'utf8').trimEnd())
  console.log(`\npnpm harness verify ${name} 执行：`)

  for (const args of scopeCommands(name)) {
    console.log(`  pnpm ${args.join(' ')}`)
  }
}

function verify(name) {
  if (name !== 'all') {
    checkScopes()
  }

  const commands = name === 'all' ? [['check']] : scopeCommands(name)
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

    // Windows 需要 shell 启动 pnpm.cmd，只传入允许的脚本名与已校验的测试路径。
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
  const knownScope =
    scope &&
    scope !== 'all' &&
    scopePattern.test(scope) &&
    Object.hasOwn(scopes, scope)

  if (action === '--help' && !scope) {
    console.log(`pnpm harness context [scope]    查看任务上下文
pnpm harness verify [scope]     定向验证，省略 scope 时执行全量检查
pnpm harness check              检查主题索引、相对链接和验证目标`)
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
    checkIndexes()
    console.log('✓ Harness 索引、相对链接和验证目标有效')
  } else {
    throw new Error(
      '无效命令或任务域。使用 pnpm harness --help 或 pnpm harness context。',
    )
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
