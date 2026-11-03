import { createPinia, disposePinia, setActivePinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp, nextTick } from 'vue'
import { APP_CATCH_KEY } from '../../src/app-config'
import { findMenuRoot, firstMenuLeaf } from '../../src/layout/navigation'
import { piniaLockScreenStore } from '../../src/store/modules/lock-screen'
import { piniaSettingStore } from '../../src/store/modules/setting'
import {
  getDefaultSettingConfig,
  normalizeLayoutConfig,
} from '../../src/store/modules/setting/constant'
import type { AppMenuOption } from '../../src/types'

const menu = (
  fullPath: string,
  children?: AppMenuOption[],
  show = true,
): AppMenuOption => ({
  name: fullPath,
  path: fullPath,
  fullPath,
  key: fullPath,
  label: fullPath,
  meta: {},
  children,
  show,
})

describe('layout preferences', () => {
  it('adds defaults and bounds persisted or programmatic invalid values', () => {
    expect(normalizeLayoutConfig(null)).toEqual(
      getDefaultSettingConfig().layoutConfig,
    )
    expect(
      normalizeLayoutConfig({
        mode: 'unknown',
        contentMaxWidth: NaN,
        contentPadding: -100,
      }),
    ).toMatchObject({ mode: 'side', contentMaxWidth: 1200, contentPadding: 0 })
    expect(
      normalizeLayoutConfig({
        mode: 'mixed',
        contentWidth: 'fixed',
        contentMaxWidth: 99999,
      }),
    ).toMatchObject({
      mode: 'mixed',
      contentWidth: 'fixed',
      contentMaxWidth: 2560,
    })
  })

  it('hydrates old preferences without changing the storage key or losing data', () => {
    localStorage.setItem(
      APP_CATCH_KEY.appPiniaSettingStore,
      JSON.stringify({
        localeLanguage: 'en-US',
        sideBarLogo: { icon: 'ray', title: 'Saved title' },
        menuTagSwitch: false,
      }),
    )
    const pinia = createPinia().use(piniaPluginPersistedstate)
    const app = createApp({ render: () => null }).use(pinia)

    app.mount(document.createElement('div'))
    setActivePinia(pinia)

    try {
      const store = piniaSettingStore()

      expect(store.layoutConfig).toEqual(getDefaultSettingConfig().layoutConfig)
      expect(store.sideBarLogo).toMatchObject({
        icon: 'logo/ray',
        title: 'Saved title',
      })
      expect(store.localeLanguage).toBe('en-US')
      expect(store.menuTagSwitch).toBe(false)
      store.updateSettingState('layoutConfig', { mode: 'top' })
      expect(store.layoutConfig.fixedHeader).toBe(true)
      expect(store.layoutConfig.mode).toBe('top')
    } finally {
      app.unmount()
      disposePinia(pinia)
      localStorage.removeItem(APP_CATCH_KEY.appPiniaSettingStore)
    }
  })

  it('finds mixed navigation roots by nested leaf and skips hidden branches', () => {
    const root = menu('/root', [
      menu('/hidden', [], false),
      menu('/child', [menu('/leaf')]),
    ])

    expect(findMenuRoot([root], '/leaf')).toBe(root)
    expect(firstMenuLeaf(root)?.fullPath).toBe('/leaf')
    expect(
      findMenuRoot([menu('/hidden', [], false)], '/hidden'),
    ).toBeUndefined()
    expect(
      firstMenuLeaf(menu('/empty', [menu('/hidden', [], false)])),
    ).toBeUndefined()
  })
  it('keeps the legacy lock-screen boolean storage contract inside Pinia', async () => {
    localStorage.setItem(APP_CATCH_KEY.isAppLockScreen, 'true')
    const pinia = createPinia()

    setActivePinia(pinia)

    try {
      const store = piniaLockScreenStore()

      expect(store.locked).toBe(true)
      store.setLocked(false)
      await nextTick()
      expect(localStorage.getItem(APP_CATCH_KEY.isAppLockScreen)).toBe('false')
    } finally {
      disposePinia(pinia)
      localStorage.removeItem(APP_CATCH_KEY.isAppLockScreen)
    }
  })
})
