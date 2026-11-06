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
const allowedChecks = new Set([
  'api:check',
  'docs:check',
  'icons:check',
  'packages:check',
  'typecheck',
])
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
      problems.push(`Invalid scope: ${name}`)
    }

    if (typeof description !== 'string' || !description.trim()) {
      problems.push(`${name} requires a task description`)
    }

    if (!Array.isArray(tests) || !Array.isArray(checks)) {
      problems.push(`${name}: tests and checks must be arrays`)
      continue
    }

    if (tests.length === 0 && checks.length === 0) {
      problems.push(
        `${name} requires at least one regression test path or check command`,
      )
    }

    for (const script of checks) {
      if (!allowedChecks.has(script) || typeof scripts?.[script] !== 'string') {
        problems.push(`${name}: unregistered check command: ${script}`)
      }
    }

    for (const path of tests) {
      if (
        typeof path !== 'string' ||
        !testPattern.test(path) ||
        !existsSync(join(root, path))
      ) {
        problems.push(`${name}: invalid regression test path: ${path}`)
        continue
      }

      const stat = statSync(join(root, path))
      const hasTests = path.endsWith('/')
        ? stat.isDirectory() &&
          globSync('**/*.spec.{ts,tsx}', { cwd: join(root, path) }).length > 0
        : stat.isFile()

      if (!hasTests) {
        problems.push(
          `${name}: regression test path contains no tests: ${path}`,
        )
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
      problems.push(`Index document does not exist: ${path}`)
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
        problems.push(`${path}: invalid relative link: ${href}`)
      } else if (path === 'llms.txt') {
        entryLinks.add(destination)
      }
    }
  }

  for (const path of cards) {
    if (!entryLinks.has(join(root, path))) {
      problems.push(`llms.txt is missing a valid topic link: ${path}`)
    }
  }

  for (const file of globSync('harness/context/*.md', { cwd: root })) {
    if (!cards.includes(file.split(sep).join('/'))) {
      problems.push(`Unregistered topic index: ${file}`)
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

  console.log(`Entry point: ${path} (body links are relative to this file)\n`)
  console.log(readFileSync(join(root, path), 'utf8').trimEnd())
  console.log(`\npnpm harness verify ${name} runs:`)

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
          `${command} failed (${result.signal ?? exitCode})`,
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
  console.log(`\nVerification report: ${relative(root, reportPath)}`)
  process.exitCode = exitCode
}

try {
  const knownScope =
    scope &&
    scope !== 'all' &&
    scopePattern.test(scope) &&
    Object.hasOwn(scopes, scope)

  if (action === '--help' && !scope) {
    console.log(`pnpm harness context [scope]    Show task context
pnpm harness verify <scope>     Run targeted commands for everyday changes
pnpm harness verify all         Run full checks (omitting scope still runs all)
pnpm harness check              Validate topic indexes, relative links, and targets
These commands do not launch a browser. Verify UI/UX separately by impact; see harness/README.md.`)
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
    console.log(
      '✓ Harness indexes, relative links, and verification targets are valid',
    )
  } else {
    throw new Error(
      'Invalid command or scope. Use pnpm harness --help or pnpm harness context.',
    )
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
