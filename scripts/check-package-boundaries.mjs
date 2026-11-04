import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = fileURLToPath(new URL('../', import.meta.url))
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

for (const app of ['@ray-template/admin', '@ray-template/docs']) {
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
  const files = readdirSync(dir, { recursive: true, withFileTypes: true })

  for (const file of files) {
    const path = join(file.parentPath, file.name)

    if (
      !file.isFile() ||
      !/\.(?:[cm]?tsx?|vue)$/.test(file.name) ||
      relative(dir, path)
        .split(sep)
        .some((part) => ['node_modules', 'dist', 'cache'].includes(part))
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
      let invalid = false

      if (
        specifier.startsWith('@/') ||
        /^@(api|mock|images)(\/|$)/.test(specifier)
      ) {
        invalid = manifest.name !== '@ray-template/admin'
      } else if (specifier.startsWith('.')) {
        const target = relative(dir, resolve(dirname(path), specifier))

        invalid = target === '..' || target.startsWith('..' + sep)
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
      } else if (group === 'packages' && !specifier.startsWith('node:')) {
        const parts = specifier.split('/')
        const name = parts.slice(0, specifier.startsWith('@') ? 2 : 1).join('/')

        invalid = !declared[name]
      }

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
