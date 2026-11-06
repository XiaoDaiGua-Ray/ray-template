// @vitest-environment node

import { spawnSync } from 'node:child_process'
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { parse, parseAllDocuments, stringify } from 'yaml'
import {
  checkDistributions,
  exportDistribution,
  pruneLockfile,
} from '../../scripts/distributions.mjs'

let fixture: string
const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf8'))
const reference = (version: string) => ({ specifier: version, version })

function write(path: string, value: string | object) {
  const target = join(fixture, path)

  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(
    target,
    typeof value === 'string' ? value : JSON.stringify(value),
  )
}

function lockfile() {
  const manager = {
    lockfileVersion: '9.0',
    importers: {
      '.': { packageManagerDependencies: { pnpm: reference('12.0.0') } },
    },
    packages: { 'pnpm@12.0.0': {}, 'pm-native@1.0.0': {} },
    snapshots: {
      'pnpm@12.0.0': { optionalDependencies: { 'pm-native': '1.0.0' } },
      'pm-native@1.0.0': {},
    },
  }
  const workspace = {
    lockfileVersion: '9.0',
    settings: { autoInstallPeers: true },
    importers: {
      '.': { devDependencies: { yaml: reference('2.9.1') } },
      'apps/admin': {
        dependencies: {
          '@ray-template/ui': reference('link:../../packages/ui'),
          alias: reference('real-package@1.0.0(peer@2.0.0(nested@3.0.0))'),
        },
      },
      'apps/docs': {
        dependencies: {
          '@ray-template/ui': reference('link:../../packages/ui'),
        },
      },
      'apps/server': {
        dependencies: {
          '@ray-template/api-contracts': reference(
            'link:../../packages/api-contracts',
          ),
          '@ray-template/server-store': reference(
            'link:../../packages/server-store',
          ),
          '@nestjs/core': reference('12.0.0'),
        },
      },
      'packages/ui': {
        dependencies: {
          '@ray-template/api-contracts': reference('link:../api-contracts'),
          vue: reference('3.5.0'),
        },
      },
      'packages/api-contracts': {
        dependencies: { valibot: reference('1.5.0') },
      },
      'packages/server-store': { dependencies: { pg: reference('8.0.0') } },
    },
    packages: {
      'yaml@2.9.1': {},
      'vue@3.5.0': {},
      'valibot@1.5.0': {},
      'real-package@1.0.0': {},
      'peer@2.0.0': {},
      'nested@3.0.0': {},
      'native-optional@1.0.0': {},
      '@nestjs/core@12.0.0': {},
      'pg@8.0.0': {},
      'pg-protocol@1.0.0': {},
      'unused@1.0.0': {},
    },
    snapshots: {
      'yaml@2.9.1': {},
      'vue@3.5.0': {},
      'valibot@1.5.0': {},
      'real-package@1.0.0(peer@2.0.0(nested@3.0.0))': {
        optionalDependencies: { 'native-optional': '1.0.0' },
      },
      'peer@2.0.0(nested@3.0.0)': {},
      'nested@3.0.0': {},
      'native-optional@1.0.0': {},
      '@nestjs/core@12.0.0': {},
      'pg@8.0.0': { dependencies: { 'pg-protocol': '1.0.0' } },
      'pg-protocol@1.0.0': {},
      'unused@1.0.0': {},
    },
  }

  return `---\n${stringify(manager)}\n---\n${stringify(workspace)}`
}

beforeEach(() => {
  fixture = mkdtempSync(join(tmpdir(), 'ray-distribution-'))
  write('package.json', {
    name: 'ray-template',
    version: '6.0.1',
    private: true,
    scripts: {
      dev: 'vite',
      'check:frontend': 'pnpm typecheck && pnpm test:run',
      check: 'pnpm check:frontend && pnpm server:check && pnpm dist:check',
      setup: 'node scripts/fullstack.mjs setup',
      'dev:full': 'node scripts/fullstack.mjs dev',
      'server:check': 'pnpm --filter @ray-template/server check',
      'dist:frontend': 'node scripts/distributions.mjs frontend',
      'dist:fullstack': 'node scripts/distributions.mjs fullstack',
      'dist:check': 'node scripts/distributions.mjs --check',
    },
    devDependencies: { yaml: '2.9.1' },
  })
  write('apps/admin/package.json', {
    name: '@ray-template/admin',
    dependencies: {
      '@ray-template/ui': 'workspace:*',
      alias: 'npm:real-package@1.0.0',
    },
  })
  write('apps/docs/package.json', {
    name: '@ray-template/docs',
    dependencies: { '@ray-template/ui': 'workspace:*' },
  })
  write('apps/server/package.json', {
    name: '@ray-template/server',
    dependencies: {
      '@ray-template/api-contracts': 'workspace:*',
      '@ray-template/server-store': 'workspace:*',
      '@nestjs/core': '12.0.0',
    },
  })
  write('packages/ui/package.json', {
    name: '@ray-template/ui',
    dependencies: { '@ray-template/api-contracts': 'workspace:*' },
    peerDependencies: { vue: '3.5.0' },
  })
  write('packages/api-contracts/package.json', {
    name: '@ray-template/api-contracts',
    dependencies: { valibot: '1.5.0' },
  })
  write('packages/server-store/package.json', {
    name: '@ray-template/server-store',
    dependencies: { pg: '8.0.0' },
  })
  write('packages/ui/src/index.ts', 'export const shared = true\n')
  write('apps/server/src/main.ts', 'export const server = true\n')
  write('apps/admin/src/main.ts', 'export const admin = true\n')
  write('scripts/distributions.mjs', '// exporter\n')
  write('scripts/fullstack.mjs', '// server launcher\n')
  write('deploy/compose.yaml', 'services: {}\n')
  write('.github/workflows/ci.yaml', 'name: CI\n')
  write('.github/workflows/distributions.yaml', 'name: Distributions\n')
  write('.husky/pre-commit', 'pnpm lint-staged\n')
  chmodSync(join(fixture, '.husky/pre-commit'), 0o755)
  write(
    'pnpm-workspace.yaml',
    'packages:\n  - apps/*\n  - packages/*\nverifyDepsBeforeRun: false\n',
  )
  write('pnpm-lock.yaml', lockfile())
  write('harness/scopes.json', {
    toolchain: { checks: ['packages:check'] },
    server: { checks: ['server:check'] },
  })
  write('harness/context/server.md', '# Server\n')
  write('tsconfig.json', {
    references: [
      { path: './tsconfig.app.json' },
      { path: './apps/server/tsconfig.json' },
    ],
  })
  write('tsconfig.app.json', '{}\n')
  write(
    'README.md',
    '# Template\n\nFrontend instructions.\n\n<!-- fullstack:start -->\n[Server](apps/server/README.md)\n<!-- fullstack:end -->\n\nShared instructions.\n',
  )
})

afterEach(() => {
  rmSync(fixture, { recursive: true, force: true })
})

it('exports a real frontend workspace without server files, scripts or dependency graph', async () => {
  const sourceManifest = readFileSync(join(fixture, 'package.json'), 'utf8')
  const sourceLock = readFileSync(join(fixture, 'pnpm-lock.yaml'), 'utf8')
  const { directory, manifest } = await exportDistribution(
    fixture,
    'frontend',
    {
      archive: false,
    },
  )
  const exported = readJson(join(directory, 'package.json'))
  const locks = parseAllDocuments(
    readFileSync(join(directory, 'pnpm-lock.yaml'), 'utf8'),
  ).map((document) => document.toJS())

  expect(exported.scripts).not.toHaveProperty('server:check')
  expect(exported.scripts).not.toHaveProperty('setup')
  expect(exported.scripts).not.toHaveProperty('dev:full')
  expect(exported.scripts).not.toHaveProperty('dist:fullstack')
  expect(exported.scripts.check).toBe('pnpm check:frontend && pnpm dist:check')
  expect(exported.scripts.dev).toBe('vite')
  expect(existsSync(join(directory, 'apps/server'))).toBe(false)
  expect(existsSync(join(directory, 'packages/server-store'))).toBe(false)
  expect(existsSync(join(directory, 'scripts/fullstack.mjs'))).toBe(false)
  expect(existsSync(join(directory, 'deploy'))).toBe(false)
  expect(
    existsSync(join(directory, '.github/workflows/distributions.yaml')),
  ).toBe(false)
  expect(existsSync(join(directory, '.github/workflows/ci.yaml'))).toBe(true)
  expect(readJson(join(directory, 'harness/scopes.json'))).not.toHaveProperty(
    'server',
  )
  expect(readJson(join(directory, 'tsconfig.json')).references).toEqual([
    { path: './tsconfig.app.json' },
  ])
  expect(readFileSync(join(directory, 'README.md'), 'utf8')).toContain(
    'Frontend instructions.',
  )
  expect(readFileSync(join(directory, 'README.md'), 'utf8')).not.toContain(
    '[Server]',
  )
  expect(
    parse(readFileSync(join(directory, 'pnpm-workspace.yaml'), 'utf8'))
      .packages,
  ).toEqual([
    'apps/admin',
    'apps/docs',
    'packages/api-contracts',
    'packages/ui',
  ])
  expect(locks).toHaveLength(2)
  expect(locks[0].snapshots).toHaveProperty('pm-native@1.0.0')
  expect(Object.keys(locks[1].snapshots)).toEqual(
    expect.arrayContaining([
      'real-package@1.0.0(peer@2.0.0(nested@3.0.0))',
      'peer@2.0.0(nested@3.0.0)',
      'nested@3.0.0',
      'native-optional@1.0.0',
    ]),
  )
  expect(locks[1].snapshots).not.toHaveProperty('@nestjs/core@12.0.0')
  expect(locks[1].snapshots).not.toHaveProperty('pg@8.0.0')
  expect(locks[1].packages).not.toHaveProperty('pg-protocol@1.0.0')
  expect(locks[1].packages).not.toHaveProperty('unused@1.0.0')
  expect(manifest.edition).toBe('frontend')
  expect(manifest.contentSha256).toMatch(/^[a-f0-9]{64}$/)
  expect(manifest.workspaces).not.toContain('apps/server')
  expect(readFileSync(join(fixture, 'package.json'), 'utf8')).toBe(
    sourceManifest,
  )
  expect(readFileSync(join(fixture, 'pnpm-lock.yaml'), 'utf8')).toBe(sourceLock)

  if (process.platform !== 'win32') {
    expect(statSync(join(directory, '.husky/pre-commit')).mode & 0o777).toBe(
      0o755,
    )
  }
})

it('exports fullstack with its backend and transitive packages', async () => {
  const { directory, manifest } = await exportDistribution(
    fixture,
    'fullstack',
    {
      archive: false,
    },
  )
  const lock = parseAllDocuments(
    readFileSync(join(directory, 'pnpm-lock.yaml'), 'utf8'),
  )[1].toJS()

  expect(existsSync(join(directory, 'apps/server/src/main.ts'))).toBe(true)
  expect(
    existsSync(join(directory, 'packages/server-store/package.json')),
  ).toBe(true)
  expect(existsSync(join(directory, 'deploy/compose.yaml'))).toBe(true)
  expect(readJson(join(directory, 'package.json')).scripts).toHaveProperty(
    'dev:full',
  )
  expect(lock.snapshots).toHaveProperty('pg-protocol@1.0.0')
  expect(manifest.workspaces).toContain('apps/server')
})

it('omits local secrets, unapproved root files and generated output while including new source', async () => {
  for (const path of [
    '.env',
    '.env.local',
    'credentials.json',
    '.git/config',
    'apps/server/.env',
    'apps/server/src/generated/client.ts',
    'apps/server/dist-test/result.js',
    'apps/admin/.env.local',
    'apps/admin/node_modules/secret.txt',
    'packages/ui/dist/index.js',
    'apps/docs/.vitepress/cache/leak.json',
    'scripts/private.pem',
    'docs/.local/token',
    '.husky/_/husky.sh',
  ])
    write(path, 'private data')

  write('apps/server/.env.example', 'DATABASE_URL=postgresql://example\n')
  write('apps/server/.gitignore', '/src/generated/\n/dist-test/\n/.env.local\n')
  write('apps/admin/.env.development', 'VITE_API_MOCK=true\n')
  write(
    'packages/ui/src/new-uncommitted.ts',
    'export const uncommitted = true\n',
  )
  write('__test__/cache/keep.spec.ts', 'export const regression = true\n')
  write('apps/admin/src/utils/cache/index.ts', 'export const storage = true\n')
  const { directory } = await exportDistribution(fixture, 'fullstack', {
    archive: false,
  })

  expect(existsSync(join(directory, 'apps/server/.env.example'))).toBe(true)
  expect(existsSync(join(directory, 'apps/server/.gitignore'))).toBe(true)
  expect(existsSync(join(directory, 'apps/server/src/generated'))).toBe(false)
  expect(existsSync(join(directory, 'apps/server/dist-test'))).toBe(false)
  expect(existsSync(join(directory, 'apps/admin/.env.development'))).toBe(true)
  expect(
    existsSync(join(directory, 'packages/ui/src/new-uncommitted.ts')),
  ).toBe(true)
  expect(existsSync(join(directory, '__test__/cache/keep.spec.ts'))).toBe(true)
  expect(
    existsSync(join(directory, 'apps/admin/src/utils/cache/index.ts')),
  ).toBe(true)
  expect(existsSync(join(directory, 'apps/admin/.env.local'))).toBe(false)
  expect(existsSync(join(directory, 'apps/server/.env'))).toBe(false)
  expect(existsSync(join(directory, '.env'))).toBe(false)
  expect(existsSync(join(directory, 'credentials.json'))).toBe(false)
  expect(existsSync(join(directory, '.git'))).toBe(false)
  expect(existsSync(join(directory, 'packages/ui/dist'))).toBe(false)
  expect(existsSync(join(directory, 'scripts/private.pem'))).toBe(false)
})

it('validates exports read-only and supports frontend-only extracted projects', async () => {
  const entries = readdirSync(fixture)

  expect(checkDistributions(fixture).map(({ edition }) => edition)).toEqual([
    'frontend',
    'fullstack',
  ])
  expect(readdirSync(fixture)).toEqual(entries)

  const { directory } = await exportDistribution(fixture, 'frontend', {
    archive: false,
  })

  expect(checkDistributions(directory).map(({ edition }) => edition)).toEqual([
    'frontend',
  ])
  await expect(
    exportDistribution(directory, 'fullstack', { archive: false }),
  ).rejects.toThrow('Workspace dependency is missing')
})

it('refuses broken dependency graphs and missing lockfile importers', async () => {
  write('packages/ui/package.json', {
    name: '@ray-template/ui',
    dependencies: { '@ray-template/server': 'workspace:*' },
  })
  expect(() => checkDistributions(fixture)).toThrow(
    'Frontend dependency reaches the server',
  )
  expect(() =>
    pruneLockfile(lockfile(), new Set(['.', 'apps/missing'])),
  ).toThrow('Workspace importer is missing')
  expect(() =>
    pruneLockfile('lockfileVersion: 6\nimporters: {}', new Set()),
  ).toThrow('version 9')
})

it('refuses credentials in package-manager config and malformed section markers', async () => {
  write('.npmrc', '//registry.npmjs.org/:_authToken=do-not-export\n')
  expect(() => checkDistributions(fixture)).toThrow('Credential-bearing .npmrc')
  rmSync(join(fixture, '.npmrc'))
  write('README.md', '<!-- fullstack:start -->\nMissing end\n')
  expect(() => checkDistributions(fixture)).toThrow(
    'Unpaired fullstack section marker',
  )
})

it('replaces only recognized generated output and keeps artifact content reproducible', async () => {
  const output = 'dist/distributions/ray-template-frontend-6.0.1'

  write(`${output}/keep.txt`, 'user data')
  await expect(
    exportDistribution(fixture, 'frontend', { archive: false }),
  ).rejects.toThrow('unrecognized distribution')
  expect(readFileSync(join(fixture, output, 'keep.txt'), 'utf8')).toBe(
    'user data',
  )
  rmSync(join(fixture, output), { recursive: true })
  const first = await exportDistribution(fixture, 'frontend', {
    archive: false,
  })
  const second = await exportDistribution(fixture, 'frontend', {
    archive: false,
  })

  expect(first.manifest.contentSha256).toBe(second.manifest.contentSha256)
})

it.skipIf(process.platform === 'win32')(
  'rejects existing and dangling output symlinks and source symlinks',
  async () => {
    const outside = mkdtempSync(join(tmpdir(), 'ray-distribution-outside-'))

    try {
      symlinkSync(outside, join(fixture, 'dist'), 'dir')
      await expect(
        exportDistribution(fixture, 'frontend', { archive: false }),
      ).rejects.toThrow('symlink')
      expect(readdirSync(outside)).toEqual([])
      rmSync(join(fixture, 'dist'))
      mkdirSync(join(fixture, 'dist/distributions'), { recursive: true })
      symlinkSync(
        join(outside, 'new-file'),
        join(fixture, 'dist/distributions/ray-template-frontend-6.0.1.tar.gz'),
      )
      await expect(exportDistribution(fixture, 'frontend')).rejects.toThrow(
        'symlink',
      )
      expect(existsSync(join(outside, 'new-file'))).toBe(false)
      rmSync(join(fixture, 'dist'), { recursive: true })
      symlinkSync(
        join(fixture, 'package.json'),
        join(fixture, 'packages/ui/src/linked.json'),
      )
      expect(() => checkDistributions(fixture)).toThrow('Source symlinks')
    } finally {
      rmSync(outside, { recursive: true, force: true })
    }
  },
)

it('creates a portable archive containing one distribution root and its provenance', async () => {
  const { archive } = await exportDistribution(fixture, 'frontend')
  const result = spawnSync('tar', ['-tzf', archive!], { encoding: 'utf8' })

  expect(result.status).toBe(0)
  expect(result.stdout).toContain(
    'ray-template-frontend-6.0.1/distribution.json',
  )
  expect(result.stdout).toContain(
    'ray-template-frontend-6.0.1/apps/admin/package.json',
  )
  expect(result.stdout).not.toContain('apps/server')
})
