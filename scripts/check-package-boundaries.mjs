import { readdirSync, readFileSync } from 'node:fs'
import { builtinModules } from 'node:module'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = resolve(
  process.argv[2] ?? fileURLToPath(new URL('../', import.meta.url)),
)
const builtins = new Set([
  ...builtinModules,
  ...builtinModules.map((name) => `node:${name}`),
])
const projects = ['packages', 'apps'].flatMap((group) =>
  readdirSync(join(root, group), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map(({ name }) => ({ group, dir: join(root, group, name) })),
)
const manifests = new Map(
  projects.map(({ dir }) => {
    const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))

    return [manifest.name, manifest]
  }),
)
const errors = []
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

for (const app of projects
  .filter(({ group }) => group === 'apps')
  .map(
    ({ dir }) =>
      JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).name,
  )) {
  if (manifests.get(app)?.version !== version) {
    errors.push(`${app} must use workspace version ${version}.`)
  }
}

for (const { group, dir } of projects) {
  const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
  const declared = {
    ...manifest.dependencies,
    ...manifest.peerDependencies,
    ...manifest.devDependencies,
  }
  const runtime = manifest.rayTemplate?.runtime

  if (!['browser', 'server', 'universal'].includes(runtime))
    errors.push(`${manifest.name}: declare rayTemplate.runtime.`)

  for (const [name, range] of Object.entries(declared)) {
    const target = manifests.get(name)

    if (!target) continue

    if (!String(range).startsWith('workspace:'))
      errors.push(`${manifest.name}: ${name} must use workspace protocol.`)

    if (
      projects.some(
        (project) =>
          project.group === 'apps' &&
          JSON.parse(readFileSync(join(project.dir, 'package.json'), 'utf8'))
            .name === name,
      )
    )
      errors.push(
        `${manifest.name}: applications cannot be dependencies (${name}).`,
      )

    const targetRuntime = target.rayTemplate?.runtime

    if (
      (runtime === 'universal' && targetRuntime !== 'universal') ||
      (runtime === 'server' && targetRuntime === 'browser') ||
      (runtime === 'browser' && targetRuntime === 'server')
    )
      errors.push(
        `${manifest.name}: ${runtime} cannot depend on ${targetRuntime} ${name}.`,
      )
  }

  const files = readdirSync(dir, { recursive: true, withFileTypes: true })

  for (const file of files) {
    const path = join(file.parentPath, file.name)

    if (
      !file.isFile() ||
      !/\.(?:[cm]?tsx?|vue)$/.test(file.name) ||
      relative(dir, path)
        .split(sep)
        .some((part) =>
          [
            'node_modules',
            'dist',
            'cache',
            'generated',
            '.harness-local',
          ].includes(part),
        )
    )
      continue

    const content = readFileSync(path, 'utf8')
    const script = file.name.endsWith('.vue')
      ? Array.from(
          content.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g),
          (match) => match[1],
        ).join('\n')
      : content
    const { importedFiles } = ts.preProcessFile(script, true, true)

    for (const { fileName: specifier } of importedFiles) {
      if (specifier.startsWith('virtual:') || specifier.includes('*')) continue

      let invalid = false

      if (
        specifier.startsWith('@/') ||
        /^@(api|mock|images)(\/|$)/.test(specifier)
      ) {
        invalid = manifest.name !== '@ray-template/admin'
      } else if (specifier.startsWith('.')) {
        const target = relative(dir, resolve(dirname(path), specifier))

        invalid =
          isAbsolute(target) || target === '..' || target.startsWith('..' + sep)
      } else if (specifier.startsWith('@ray-template/')) {
        const parts = specifier.split('/')
        const name = parts.slice(0, 2).join('/')
        const entry = parts.length === 2 ? '.' : './' + parts.slice(2).join('/')
        const target = manifests.get(name)

        invalid =
          !declared[name] ||
          !target ||
          !Object.keys(target.exports ?? {}).some(
            (key) =>
              key === entry ||
              (key.endsWith('/*') && entry.startsWith(key.slice(0, -1))),
          )
      } else if (!builtins.has(specifier)) {
        const parts = specifier.split('/')
        const name = parts.slice(0, specifier.startsWith('@') ? 2 : 1).join('/')

        invalid = !declared[name]
      }

      if (runtime === 'universal' && builtins.has(specifier)) invalid = true

      if (invalid) errors.push(`${relative(root, path)}: ${specifier}`)
    }
  }
}

const checked = new Set()

function checkCycle(name, chain = []) {
  if (chain.includes(name)) {
    errors.push(`Package cycle: ${[...chain, name].join(' → ')}`)

    return
  }

  if (checked.has(name)) return

  const manifest = manifests.get(name)

  for (const dependency of Object.keys({
    ...manifest.dependencies,
    ...manifest.peerDependencies,
  })) {
    if (manifests.has(dependency)) checkCycle(dependency, [...chain, name])
  }

  checked.add(name)
}

for (const name of manifests.keys()) checkCycle(name)

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(
    `Verified import boundaries and dependency cycles for ${manifests.size} workspace projects.`,
  )
}
