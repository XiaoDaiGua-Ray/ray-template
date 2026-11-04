import { createPinia, disposePinia, setActivePinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp, nextTick } from 'vue'
import {
  APP_CATCH_KEY,
  GLOBAL_CLASS_NAMES,
} from '../../apps/admin/src/app-config'
import {
  findMenuRoot,
  firstMenuLeaf,
} from '../../apps/admin/src/layout/navigation'
import { piniaLockScreenStore } from '../../apps/admin/src/store/modules/lock-screen'
import { piniaSettingStore } from '../../apps/admin/src/store/modules/setting'
import {
  getDefaultSettingConfig,
  normalizeLayoutConfig,
} from '../../apps/admin/src/store/modules/setting/constant'
import type { AppMenuOption } from '../../apps/admin/src/types'

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

const mountPersistedSettings = () => {
  const pinia = createPinia().use(piniaPluginPersistedstate)
  const app = createApp({ render: () => null }).use(pinia)

  app.mount(document.createElement('div'))
  setActivePinia(pinia)

  return { pinia, app }
}

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
    const { pinia, app } = mountPersistedSettings()

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

  it('restores the exported preferences through the existing store and persistence', async () => {
    const { pinia, app } = mountPersistedSettings()
    const store = piniaSettingStore()
    const property = GLOBAL_CLASS_NAMES.rayTemplateThemePrimaryColor
    const fadeProperty = GLOBAL_CLASS_NAMES.rayTemplateThemePrimaryFadeColor
    const { style } = document.documentElement

    try {
      store.updateSettingState('layoutConfig', { mode: 'right' })
      store.updateSettingState('appTheme', 'dark')
      store.updateSettingState('watermarkConfig', { content: 'Portable' })
      store.updateSettingState('keepAliveConfig', {
        keepAliveExclude: ['Page'],
      })
      store.changePrimaryColor('#3468db')
      const file = store.exportPreferences()

      store.updateSettingState('layoutConfig', { mode: 'top' })
      store.updateSettingState('appTheme', 'light')
      store.updateSettingState('appRootRoute', { path: '/custom-home' })
      store.changePrimaryColor('#000000')
      store.importPreferences(JSON.stringify(file))
      await nextTick()

      expect(store.exportPreferences()).toEqual(file)
      expect(store._appTheme).toBe(true)
      expect(style.getPropertyValue(property)).toBe('#3468db')
      expect(store.appRootRoute.path).toBe('/custom-home')
      expect(file.preferences).not.toHaveProperty('appRootRoute')
      expect(file.preferences).not.toHaveProperty('lockScreenSwitch')
      expect(
        JSON.parse(
          localStorage.getItem(APP_CATCH_KEY.appPiniaSettingStore) ?? 'null',
        ),
      ).toMatchObject({ layoutConfig: { mode: 'right' }, appTheme: 'dark' })
    } finally {
      app.unmount()
      disposePinia(pinia)
      localStorage.removeItem(APP_CATCH_KEY.appPiniaSettingStore)
      style.removeProperty(property)
      style.removeProperty(fadeProperty)
    }
  })

  it('does not change any preference when the file contains invalid settings', () => {
    const pinia = createPinia()

    setActivePinia(pinia)
    const store = piniaSettingStore()
    const before = store.exportPreferences()

    try {
      expect(() => store.importPreferences('{"routes": []}')).toThrow()
      expect(() =>
        store.importPreferences(JSON.stringify({ ...before, version: 2 })),
      ).toThrow()
      expect(() =>
        store.importPreferences(
          JSON.stringify({
            ...before,
            preferences: {
              ...before.preferences,
              appTheme: 'dark',
              menuConfig: { ...before.preferences.menuConfig, menuWidth: -1 },
            },
          }),
        ),
      ).toThrow()
      expect(store.exportPreferences()).toEqual(before)
    } finally {
      disposePinia(pinia)
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
