// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { iconNameFromPath, scanIcons } from '../../scripts/icons.mjs'
import type { IconProps } from '../../src/components/base/RIcon'
import { iconNames, isIconName, resolveIconName } from '../../src/icons'
import type { IconName } from '../../src/icons'

describe('namespaced icons', () => {
  it('keeps the generated registry synchronized and exposes strict component props', () => {
    expect(scanIcons()).toEqual([...iconNames])
    expect(isIconName('directional/resize_h')).toBe(true)
    expect(isIconName('resize_h')).toBe(false)
    expect(isIconName('directional/missing')).toBe(false)
    expectTypeOf<IconProps['name']>().toEqualTypeOf<IconName>()
    expectTypeOf<Extract<IconName, 'resize_h'>>().toEqualTypeOf<never>()
  })

  it('supports duplicate basenames in different packages and nested paths', () => {
    const root = mkdtempSync(join(tmpdir(), 'ray-icons-'))

    try {
      for (const name of ['first/resize.svg', 'second/nested/resize.svg']) {
        const path = join(root, name)

        mkdirSync(join(path, '..'), { recursive: true })
        writeFileSync(path, '<svg/>')
      }

      expect(scanIcons(root)).toEqual(['first/resize', 'second/nested/resize'])
      expect(iconNameFromPath(join(root, 'first/resize.svg'), root)).toBe(
        'first/resize',
      )
      expect(() => iconNameFromPath(join(root, 'loose.svg'), root)).toThrow(
        'package/name',
      )
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('resolves existing persisted bare names without accepting unknown paths', () => {
    expect(resolveIconName('ray')).toBe('logo/ray')
    expect(resolveIconName('directional/resize_h')).toBe('directional/resize_h')
    expect(resolveIconName('unknown')).toBeUndefined()
    expect(resolveIconName('../ray')).toBeUndefined()
  })
})
