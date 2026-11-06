import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  chmodSync,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { format, resolveConfig } from 'prettier'
import { parse, parseAllDocuments, stringify } from 'yaml'

const repository = fileURLToPath(new URL('../', import.meta.url))
const generator = 'ray-template/distributions'
const dependencyFields = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
]
const lockDependencyFields = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'configDependencies',
  'packageManagerDependencies',
]
const rootFiles = new Set([
  'AGENTS.md',
  'CHANGELOG.md',
  'CODE_OF_CONDUCT.md',
  'LICENSE',
  'README.md',
  'README.zh-CN.md',
  'README.commit.md',
  'TODO.md',
  'llms.txt',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  '.nvmrc',
  '.npmrc',
  '.gitignore',
  '.gitattributes',
  '.editorconfig',
  '.prettierignore',
  '.prettierrc.cjs',
  '.dockerignore',
  '.npmignore',
  'Dockerfile',
  'docker-compose.yml',
])
const sourceDirectories = [
  'scripts',
  'harness',
  'docs',
  '__test__',
  'vite-helper',
  'unplugin',
  '.github',
  '.husky',
]
const fullstackPaths = [
  'apps/server',
  'scripts/fullstack.mjs',
  'scripts/sync-frontend.sh',
  'deploy',
  'harness/context/server.md',
  '.github/workflows/distributions.yaml',
]
const excludedDirectories = new Set([
  'node_modules',
  'dist',
  'dist-ssr',
  'dist-test',
  'coverage',
  'logs',
  'playground-dist',
])
const publicEnvironments = new Set([
  'apps/admin/.env.development',
  'apps/admin/.env.production',
  'apps/admin/.env.test',
])
const fullstackScript = (name) =>
  /^(?:server:|fullstack:)/.test(name) ||
  ['setup', 'dev:full', 'dist:fullstack'].includes(name)
const json = (value) => `${JSON.stringify(value, null, 2)}\n`
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'))
const portable = (path) => path.split(sep).join('/')

function within(path, directory) {
  return path === directory || path.startsWith(`${directory}/`)
}

function workspaceProjects(root) {
  const projects = new Map()

  for (const group of ['apps', 'packages']) {
    for (const entry of readdirSync(join(root, group), {
      withFileTypes: true,
    })) {
      const directory = `${group}/${entry.name}`
      const file = join(root, directory, 'package.json')

      if (!entry.isDirectory() || !existsSync(file)) continue

      const manifest = readJson(file)

      if (!manifest.name || projects.has(manifest.name)) {
        throw new Error(`Missing or duplicate workspace name: ${directory}`)
      }

      projects.set(manifest.name, { directory, manifest })
    }
  }

  return projects
}

function selectProjects(root, edition, manifest) {
  const projects = workspaceProjects(root)
  const selected = new Map()
  const visit = (name) => {
    if (selected.has(name)) return

    const project = projects.get(name)

    if (!project) throw new Error(`Workspace dependency is missing: ${name}`)

    if (edition === 'frontend' && within(project.directory, 'apps/server')) {
      throw new Error(`Frontend dependency reaches the server: ${name}`)
    }

    selected.set(name, project)
    visitDependencies(project.manifest)
  }
  const visitDependencies = (source) => {
    for (const field of dependencyFields) {
      for (const [name, version] of Object.entries(source[field] ?? {})) {
        if (String(version).startsWith('workspace:')) visit(name)
      }
    }
  }

  visit('@ray-template/admin')
  visit('@ray-template/docs')

  if (edition === 'fullstack') visit('@ray-template/server')

  visitDependencies(manifest)

  return selected
}

function peerReferences(key) {
  const references = []
  let depth = 0
  let start = 0

  for (let index = 0; index < key.length; index++) {
    if (key[index] === '(') {
      if (depth === 0) start = index + 1

      depth++
    } else if (key[index] === ')') {
      depth--

      if (depth === 0) references.push(key.slice(start, index))
    }
  }

  return references
}

/**
 *
 * @param content pnpm 的多文档锁文件内容
 * @param importers 发行物保留的 workspace 相对路径
 *
 * @description
 * 同时保留包管理器文档和应用文档，只移除不可达依赖，不重新解析版本。
 */
export function pruneLockfile(content, importers) {
  const foundImporters = new Set()
  const output = parseAllDocuments(content)
    .map((document) => {
      if (document.errors.length) throw document.errors[0]

      const lock = document.toJS()

      if (String(lock.lockfileVersion) !== '9.0' || !lock.importers) {
        throw new Error(
          'Only pnpm lockfile version 9 with importers is supported.',
        )
      }

      lock.importers = Object.fromEntries(
        Object.entries(lock.importers).filter(([path]) => importers.has(path)),
      )

      for (const path of Object.keys(lock.importers)) foundImporters.add(path)

      const snapshots = lock.snapshots ?? {}
      const packages = lock.packages ?? {}
      const reachable = new Set()
      const reachablePackages = new Set()
      const visitSnapshot = (key) => {
        if (reachable.has(key)) return

        const snapshot = snapshots[key]

        if (!snapshot) throw new Error(`Missing lockfile snapshot: ${key}`)

        reachable.add(key)

        const base = Object.hasOwn(packages, key)
          ? key
          : Object.keys(packages).find((name) => key.startsWith(`${name}(`))

        if (!base) throw new Error(`Missing lockfile package: ${key}`)

        reachablePackages.add(base)

        for (const field of ['dependencies', 'optionalDependencies']) {
          for (const [name, reference] of Object.entries(
            snapshot[field] ?? {},
          )) {
            visitDependency(name, reference)
          }
        }

        for (const peer of peerReferences(key)) {
          if (Object.hasOwn(snapshots, peer)) visitSnapshot(peer)
        }
      }
      const visitDependency = (name, reference) => {
        if (/^(?:link:|workspace:)/.test(reference)) return

        const key = [`${name}@${reference}`, reference].find((candidate) =>
          Object.hasOwn(snapshots, candidate),
        )

        if (!key) throw new Error(`Unresolved lockfile dependency: ${name}`)

        visitSnapshot(key)
      }

      for (const importer of Object.values(lock.importers)) {
        for (const field of lockDependencyFields) {
          for (const [name, dependency] of Object.entries(
            importer[field] ?? {},
          )) {
            const reference =
              typeof dependency === 'string' ? dependency : dependency.version

            if (typeof reference !== 'string') {
              throw new Error(`Invalid lockfile dependency: ${name}`)
            }

            visitDependency(name, reference)
          }
        }
      }

      lock.packages = Object.fromEntries(
        Object.entries(packages).filter(([key]) => reachablePackages.has(key)),
      )
      lock.snapshots = Object.fromEntries(
        Object.entries(snapshots).filter(([key]) => reachable.has(key)),
      )

      return `---\n${stringify(lock, { lineWidth: 0 })}`
    })
    .join('\n')

  for (const path of importers) {
    if (!foundImporters.has(path)) {
      throw new Error(
        `Workspace importer is missing from the lockfile: ${path}`,
      )
    }
  }

  return output
}

function stripFullstackSections(content, path) {
  const start = '<!-- fullstack:start -->'
  const end = '<!-- fullstack:end -->'
  let result = ''
  let offset = 0

  while (offset < content.length) {
    const begin = content.indexOf(start, offset)
    const finish = content.indexOf(end, offset)

    if (begin === -1 && finish === -1) return result + content.slice(offset)

    if (begin === -1 || finish < begin) {
      throw new Error(`Unpaired fullstack section marker: ${path}`)
    }

    if (
      content.indexOf(start, begin + start.length) < finish &&
      content.indexOf(start, begin + start.length) !== -1
    ) {
      throw new Error(`Nested fullstack section marker: ${path}`)
    }

    result += content.slice(offset, begin)
    offset = finish + end.length
  }

  return result
}

function included(path, edition) {
  const parts = path.split('/')
  const name = parts.at(-1)

  if (within(path, 'apps/server/src/generated')) return false

  if (path.includes('/.vitepress/cache') || within(path, '.husky/_'))
    return false

  if (
    edition === 'frontend' &&
    fullstackPaths.some((target) => within(path, target))
  ) {
    return false
  }

  if (parts.some((part) => excludedDirectories.has(part))) return false

  if (name.startsWith('.env')) {
    return publicEnvironments.has(path) || name === '.env.example'
  }

  if (/\.(?:log|local|tsbuildinfo|pem|key|p12|pfx)$/.test(name)) return false

  return !parts.some(
    (part, index) =>
      part.startsWith('.') &&
      ![
        '.github',
        '.husky',
        '.vitepress',
        '.nojekyll',
        '.gitignore',
        '.eslintrc-auto-import.json',
      ].includes(part) &&
      !(index === 0 && rootFiles.has(path)),
  )
}

function sourceFiles(root, edition, projects) {
  const files = []
  const visit = (path) => {
    if (!included(path, edition)) return

    const stat = lstatSync(join(root, path))

    if (stat.isSymbolicLink())
      throw new Error(`Source symlinks cannot be exported: ${path}`)

    if (stat.isDirectory()) {
      for (const name of readdirSync(join(root, path)).sort())
        visit(`${path}/${name}`)
    } else if (stat.isFile()) {
      files.push(path)
    }
  }

  for (const name of readdirSync(root).sort()) {
    if (
      rootFiles.has(name) ||
      /^(?:tsconfig(?:\.[\w-]+)?\.json|(?:vite(?:\.[\w-]+)?|vitest|uno|eslint|postcss|commitlint)\.config\.[cm]?[jt]s)$/.test(
        name,
      )
    ) {
      visit(name)
    }
  }

  for (const directory of [
    ...sourceDirectories,
    ...[...projects.values()].map((project) => project.directory),
    ...(edition === 'fullstack' ? ['deploy'] : []),
  ]) {
    if (existsSync(join(root, directory))) visit(directory)
  }

  return [...new Set(files)].sort()
}

function prepareDistribution(root, edition) {
  if (!['frontend', 'fullstack'].includes(edition)) {
    throw new Error(`Unknown distribution: ${edition}`)
  }

  const manifest = readJson(join(root, 'package.json'))

  if (!/^[\w.-]+$/.test(manifest.version ?? '')) {
    throw new Error('The package version is not safe for an artifact filename.')
  }

  const projects = selectProjects(root, edition, manifest)
  const importers = new Set([
    '.',
    ...[...projects.values()].map(({ directory }) => directory),
  ])
  const files = sourceFiles(root, edition, projects)
  const overrides = new Map()

  if (edition === 'frontend') {
    manifest.scripts = Object.fromEntries(
      Object.entries(manifest.scripts ?? {}).filter(
        ([name]) => !fullstackScript(name),
      ),
    )

    if (manifest.scripts['check:frontend']) {
      manifest.scripts.check = 'pnpm check:frontend && pnpm dist:check'
    }

    overrides.set('package.json', json(manifest))

    if (files.includes('harness/scopes.json')) {
      const scopes = readJson(join(root, 'harness/scopes.json'))

      delete scopes.server

      for (const scope of Object.values(scopes)) {
        if (scope.checks)
          scope.checks = scope.checks.filter((name) => !fullstackScript(name))
      }

      overrides.set('harness/scopes.json', json(scopes))
    }

    if (files.includes('tsconfig.json')) {
      const config = readJson(join(root, 'tsconfig.json'))

      if (config.references) {
        config.references = config.references.filter(
          ({ path }) => !within(path.replace(/^\.\//, ''), 'apps/server'),
        )
      }

      overrides.set('tsconfig.json', json(config))
    }

    for (const path of files.filter((path) => /\.(?:md|txt)$/.test(path))) {
      const content = readFileSync(join(root, path), 'utf8')
      const stripped = stripFullstackSections(content, path)

      if (stripped !== content) overrides.set(path, stripped)
    }
  }

  const workspace = parse(
    readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf8'),
  )

  workspace.packages = [...importers].filter((path) => path !== '.').sort()
  overrides.set('pnpm-workspace.yaml', stringify(workspace, { lineWidth: 0 }))
  overrides.set(
    'pnpm-lock.yaml',
    pruneLockfile(
      readFileSync(join(root, 'pnpm-lock.yaml'), 'utf8'),
      importers,
    ),
  )

  if (
    files.includes('.npmrc') &&
    /(?:_auth(?:Token)?|_password|username|certfile|keyfile)\s*=/i.test(
      readFileSync(join(root, '.npmrc'), 'utf8'),
    )
  ) {
    throw new Error('Credential-bearing .npmrc cannot be exported.')
  }

  return { manifest, projects, files, overrides }
}

function assertOutputPath(root, path) {
  const fromRoot = relative(root, path)

  if (!fromRoot || fromRoot.startsWith(`..${sep}`) || fromRoot === '..') {
    throw new Error('Distribution output must stay inside the repository.')
  }

  let cursor = root

  for (const part of fromRoot.split(sep)) {
    cursor = join(cursor, part)

    if (lstatSync(cursor, { throwIfNoEntry: false })?.isSymbolicLink()) {
      throw new Error('Distribution output must not traverse a symlink.')
    }
  }
}

function sourceRevision(root) {
  const revision = spawnSync('git', ['rev-parse', '--show-toplevel', 'HEAD'], {
    cwd: root,
    encoding: 'utf8',
  })
  const [directory, commit] = revision.stdout?.trim().split('\n') ?? []

  if (revision.status === 0 && realpathSync(directory) === root) {
    const status = spawnSync('git', ['status', '--porcelain'], {
      cwd: root,
      encoding: 'utf8',
    })

    return {
      commit,
      dirty: status.stdout.trim().length > 0,
    }
  }

  const previous = join(root, 'distribution.json')

  return existsSync(previous)
    ? readJson(previous).source
    : { commit: null, dirty: true }
}

/**
 *
 * @param root 源码仓库目录
 * @param edition frontend 或 fullstack
 * @param options 是否生成 tar.gz 归档；测试可仅导出目录
 *
 * @description
 * 仅替换 dist/distributions 中带本工具标记的同名产物，源码与其他输出保持不变。
 */
export async function exportDistribution(root, edition, options = {}) {
  root = realpathSync(root)

  const plan = prepareDistribution(root, edition)
  const name = `ray-template-${edition}-${plan.manifest.version}`
  const output = join(root, 'dist/distributions')
  const directory = join(output, name)
  const archive = join(output, `${name}.tar.gz`)
  const formatting = await resolveConfig(join(root, 'package.json'))

  for (const [path, content] of plan.overrides) {
    if (/\.(?:json|yaml|md)$/.test(path) && !path.endsWith('-lock.yaml')) {
      plan.overrides.set(
        path,
        await format(content, { ...formatting, filepath: path }),
      )
    }
  }

  assertOutputPath(root, directory)
  assertOutputPath(root, archive)

  if (existsSync(directory)) {
    const marker = join(directory, 'distribution.json')

    if (
      !existsSync(marker) ||
      lstatSync(marker).isSymbolicLink() ||
      readJson(marker).generatedBy !== generator
    ) {
      throw new Error(
        `Refusing to replace an unrecognized distribution: ${name}`,
      )
    }

    rmSync(directory, { recursive: true })
  } else if (existsSync(archive)) {
    throw new Error(
      `Refusing to replace an archive without its distribution directory: ${name}`,
    )
  }

  mkdirSync(directory, { recursive: true })

  const hash = createHash('sha256')

  for (const path of plan.files) {
    const source = join(root, path)
    const destination = join(directory, path)
    const content = plan.overrides.get(path)

    mkdirSync(dirname(destination), { recursive: true })

    if (content === void 0) copyFileSync(source, destination)
    else writeFileSync(destination, content)

    chmodSync(destination, lstatSync(source).mode & 0o777)
    hash.update(path)
    hash.update('\0')
    hash.update(readFileSync(destination))
    hash.update('\0')
  }

  const manifest = {
    formatVersion: 1,
    generatedBy: generator,
    edition,
    version: plan.manifest.version,
    source: sourceRevision(root),
    workspaces: [...plan.projects.values()]
      .map(({ directory }) => directory)
      .sort(),
    fileCount: plan.files.length,
    contentSha256: hash.digest('hex'),
  }

  writeFileSync(
    join(directory, 'distribution.json'),
    await format(json(manifest), {
      ...formatting,
      filepath: 'distribution.json',
    }),
  )

  if (options.archive !== false) {
    const result = spawnSync(
      'tar',
      ['--no-xattrs', '-czf', archive, '-C', output, name],
      {
        encoding: 'utf8',
        env: { ...process.env, COPYFILE_DISABLE: '1' },
      },
    )

    if (result.error || result.status !== 0) {
      throw new Error(
        `Failed to archive distribution: ${result.error?.message ?? result.stderr}`,
      )
    }
  }

  return {
    directory,
    archive: options.archive === false ? null : archive,
    manifest,
  }
}

export function checkDistributions(root = repository) {
  const editions = existsSync(join(root, 'apps/server/package.json'))
    ? ['frontend', 'fullstack']
    : ['frontend']

  return editions.map((edition) => {
    const plan = prepareDistribution(root, edition)

    return { edition, files: plan.files.length, workspaces: plan.projects.size }
  })
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const [edition, ...extra] = process.argv.slice(2)

    if (
      extra.length ||
      !['frontend', 'fullstack', '--check'].includes(edition)
    ) {
      throw new Error(
        'Usage: node scripts/distributions.mjs <frontend|fullstack|--check>',
      )
    }

    if (edition === '--check') {
      for (const result of checkDistributions()) {
        console.log(
          `Verified ${result.edition}: ${result.workspaces} workspaces, ${result.files} source files.`,
        )
      }
    } else {
      const result = await exportDistribution(repository, edition)

      console.log(
        `Exported ${portable(relative(repository, result.directory))}`,
      )
      console.log(`Archive: ${portable(relative(repository, result.archive))}`)
    }
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
