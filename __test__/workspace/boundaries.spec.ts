// @vitest-environment node
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const directories: string[] = []
const checker = resolve('scripts/check-package-boundaries.mjs')

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'ray-boundaries-'))

  directories.push(root)
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({ version: '1.0.0' }),
  )
  mkdirSync(join(root, 'apps'))
  mkdirSync(join(root, 'packages'))

  return {
    add(
      group: string,
      name: string,
      runtime: string,
      source = '',
      dependencies = {},
    ) {
      const directory = join(root, group, name)

      mkdirSync(directory)
      writeFileSync(
        join(directory, 'package.json'),
        JSON.stringify({
          name: `@ray-template/${name}`,
          version: '1.0.0',
          rayTemplate: { runtime },
          exports: { '.': './index.ts' },
          dependencies,
        }),
      )
      writeFileSync(join(directory, 'index.ts'), source)
    },
    check() {
      const result = spawnSync(process.execPath, [checker, root], {
        encoding: 'utf8',
      })

      return { status: result.status, output: result.stdout + result.stderr }
    },
  }
}

afterEach(() => {
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true })
})

describe('workspace ownership', () => {
  it('permits independent applications to share universal contracts', () => {
    const project = fixture()

    project.add(
      'packages',
      'contracts',
      'universal',
      'export const version = 1',
    )

    for (const [name, runtime] of [
      ['admin', 'browser'],
      ['server', 'server'],
    ]) {
      project.add(
        'apps',
        name,
        runtime,
        "import { version } from '@ray-template/contracts'",
        { '@ray-template/contracts': 'workspace:*' },
      )
    }

    expect(project.check().status).toBe(0)
  })

  it('rejects application dependencies even when their exports exist', () => {
    const project = fixture()

    project.add('apps', 'server', 'server')
    project.add('apps', 'admin', 'browser', '', {
      '@ray-template/server': 'workspace:*',
    })
    expect(project.check().output).toContain(
      'applications cannot be dependencies',
    )
  })

  it('rejects browser dependencies and Node builtins in universal packages', () => {
    const project = fixture()

    project.add('packages', 'ui', 'browser')
    project.add(
      'packages',
      'contracts',
      'universal',
      "import fs from 'node:fs'",
      { '@ray-template/ui': 'workspace:*' },
    )
    const result = project.check()

    expect(result.status).toBe(1)
    expect(result.output).toContain('universal cannot depend on browser')
    expect(result.output).toContain('node:fs')
  })

  it('rejects undeclared app imports and relative workspace escapes', () => {
    const project = fixture()

    project.add(
      'apps',
      'admin',
      'browser',
      "import missing from 'undeclared'\nimport other from '../server/index.ts'",
    )
    expect(project.check().output).toContain('undeclared')
    expect(project.check().output).toContain('../server/index.ts')
  })
})
