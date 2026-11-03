import { ref } from 'vue'
import type { Ref } from 'vue'
import { useI18n } from '../../src/hooks/web/useI18n'

const { state } = vi.hoisted(() => ({
  state: {
    instance: void 0 as
      | {
          mode: string
          global: {
            t: (key: string, ...args: unknown[]) => string
            locale: Ref<string>
          }
        }
      | undefined,
  },
}))

vi.mock('../../src/locales', () => ({
  get i18n() {
    return state.instance
  },
}))

beforeEach(() => {
  state.instance = {
    mode: 'composition',
    global: { t: (key) => key, locale: ref('zh-CN') },
  }
})

describe('useI18n namespaces', () => {
  it('prefixes relative keys and preserves fully qualified keys', () => {
    const { t } = useI18n('hooks')

    expect(t('webIntro')).toBe('hooks.webIntro')
    expect(t('hooks.webIntro')).toBe('hooks.webIntro')
    expect(t('hooksExtra.title')).toBe('hooks.hooksExtra.title')
    expect(t('')).toBe('')
  })

  it('recovers when the instance initializes after the hook was created', () => {
    state.instance = void 0
    const hook = useI18n('hooks')

    expect(hook.t('code')).toBe('hooks.code')
    expectTypeOf(hook.t('code')).toEqualTypeOf<string>()
    state.instance = {
      mode: 'composition',
      global: { t: (key) => `translated:${key}`, locale: ref('zh-CN') },
    }
    expect(hook.t('code')).toBe('translated:hooks.code')
    hook.locale('en-US')
    expect(state.instance.global.locale.value).toBe('en-US')
    state.instance.global.t = (key) => `updated:${key}`
    expect(hook.t('code')).toBe('updated:hooks.code')
  })
})

it('forwards interpolation and leaves plain text and route keys untouched', async () => {
  const native = vi.fn((key: string) => `translated:${key}`)

  state.instance!.global.t = native
  const { t: translate } = useI18n()
  const { t } = await import('../../src/hooks/template/useI18n')

  expect(translate('Already readable')).toBe('Already readable')
  expect(t('menu.Dashboard')).toBe('menu.Dashboard')
  expect(translate('hooks.count', { count: 2 })).toBe('translated:hooks.count')
  expect(native).toHaveBeenCalledExactlyOnceWith('hooks.count', { count: 2 })
})
