// @vitest-environment node
import { execFileSync } from 'node:child_process'
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

it('generates usable types and package imports after additions, moves and deletions', () => {
  const root = mkdtempSync(join(tmpdir(), 'ray-icon-generation-'))
  const script = join(root, 'scripts/icons.mjs')
  const manifest = join(root, 'src/icons/manifest.ts')
  const run = (...args: string[]) =>
    execFileSync(process.execPath, [script, ...args], {
      cwd: root,
      stdio: 'pipe',
    })
  const read = (): { names: string[]; sprites: Record<string, string> } =>
    JSON.parse(
      execFileSync(
        process.execPath,
        [
          '--input-type=module',
          '-e',
          'const m = await import(process.argv[1]); process.stdout.write(JSON.stringify({ names: m.iconNames, sprites: m.iconSprites }))',
          pathToFileURL(manifest).href,
        ],
        { cwd: root, encoding: 'utf8' },
      ),
    )

  try {
    mkdirSync(join(root, 'scripts'), { recursive: true })
    mkdirSync(join(root, 'src/icons/action'), { recursive: true })
    symlinkSync(resolve('node_modules'), join(root, 'node_modules'), 'junction')
    copyFileSync('scripts/icons.mjs', script)
    copyFileSync('.prettierrc.cjs', join(root, '.prettierrc.cjs'))
    writeFileSync(join(root, 'package.json'), '{"type":"module"}')
    writeFileSync(join(root, 'src/icons/action/first.svg'), '<svg/>')
    run()
    run('--check')
    expect(read()).toEqual({
      names: ['action/first'],
      sprites: { action: '/__spritemap-action' },
    })
    renameSync(
      join(root, 'src/icons/action/first.svg'),
      join(root, 'src/icons/action/renamed.svg'),
    )
    run()
    expect(read().names).toEqual(['action/renamed'])
    mkdirSync(join(root, 'src/icons/business-tools'), { recursive: true })
    writeFileSync(join(root, 'src/icons/business-tools/new.svg'), '<svg/>')
    expect(() => run('--check')).toThrow()
    run()
    expect(read().sprites['business-tools']).toBe('/__spritemap-business-tools')
    expect(read().names).toContain('business-tools/new')
    rmSync(join(root, 'src/icons/action'), { recursive: true })
    run()
    expect(read()).toEqual({
      names: ['business-tools/new'],
      sprites: { 'business-tools': '/__spritemap-business-tools' },
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}, 15_000)
