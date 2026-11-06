import { createPinia, disposePinia, setActivePinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp, nextTick } from 'vue'
import { APP_CATCH_KEY, APP_THEME } from '../../apps/admin/src/app-config'
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
  it.each([
    { title: 'Ray Admin', migrated: '/welcome' },
    { title: 'Custom workspace', migrated: '/dashboard' },
  ])(
    'migrates only the legacy default logo target ($title)',
    ({ title, migrated }) => {
      localStorage.setItem(
        APP_CATCH_KEY.appPiniaSettingStore,
        JSON.stringify({
          sideBarLogo: {
            icon: 'logo/ray',
            title,
            url: '/dashboard',
            jumpType: 'station',
          },
          appRootRoute: { name: 'Old', path: '/old-unregistered-home' },
        }),
      )
      const first = mountPersistedSettings()
      const store = piniaSettingStore()

      expect(store.sideBarLogo?.url).toBe(migrated)
      expect(store.appRootRoute.path).toBe('/old-unregistered-home')
      store.updateSettingState('sideBarLogo', { url: '/dashboard' })
      store.$persist()
      first.app.unmount()
      disposePinia(first.pinia)
      const second = mountPersistedSettings()

      try {
        expect(piniaSettingStore().sideBarLogo?.url).toBe('/dashboard')
        expect(
          piniaSettingStore().exportPreferences().preferences,
        ).not.toHaveProperty('workspaceLandingMigrated')
      } finally {
        second.app.unmount()
        disposePinia(second.pinia)
        localStorage.removeItem(APP_CATCH_KEY.appPiniaSettingStore)
      }
    },
  )

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
        menuConfig: { iconSize: 16, collapsedIconSize: 16, menuWidth: 244 },
        primaryColorOverride: {
          common: { primaryColor: '#3468db', bodyColor: '#000000' },
          Card: { borderRadius: '99px' },
        },
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
      expect(store.menuConfig).toMatchObject({
        iconSize: 20,
        collapsedIconSize: 22,
        menuWidth: 244,
      })
      expect(store.themeStyle).toBe('modern')
      expect(store.themeOverrides.common?.primaryColor).toBe('#3468db')
      expect(store.themeOverrides.common?.bodyColor).toBe(
        APP_THEME.appNaiveUIThemeOverrides.light.common?.bodyColor,
      )
      expect(store.themeOverrides.Card?.borderRadius).toBe('12px')
      store.updateSettingState('layoutConfig', { mode: 'top' })
      expect(store.layoutConfig.fixedHeader).toBe(true)
      expect(store.layoutConfig.mode).toBe('top')
    } finally {
      app.unmount()
      disposePinia(pinia)
      localStorage.removeItem(APP_CATCH_KEY.appPiniaSettingStore)
    }
  })

  it.each([
    { iconSize: 16, collapsedIconSize: 16 },
    { iconSize: 24, collapsedIconSize: 18 },
  ])('preserves menu icon sizes saved by the current app (%o)', (sizes) => {
    const initial = mountPersistedSettings()
    const store = piniaSettingStore()

    store.updateSettingState('menuConfig', sizes)
    store.$persist()
    initial.app.unmount()
    disposePinia(initial.pinia)
    const restored = mountPersistedSettings()

    try {
      expect(piniaSettingStore().menuConfig).toMatchObject(sizes)
      expect(
        piniaSettingStore().exportPreferences().preferences,
      ).not.toHaveProperty('menuIconSizesUpdated')
    } finally {
      restored.app.unmount()
      disposePinia(restored.pinia)
      localStorage.removeItem(APP_CATCH_KEY.appPiniaSettingStore)
    }
  })

  it('restores the exported preferences through the existing store and persistence', async () => {
    const { pinia, app } = mountPersistedSettings()
    const store = piniaSettingStore()

    try {
      store.updateSettingState('layoutConfig', { mode: 'right' })
      store.updateSettingState('appTheme', 'dark')
      store.updateSettingState('themeStyle', 'material')
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
      store.updateSettingState('themeStyle', 'plain')
      store.importPreferences(JSON.stringify(file))
      await nextTick()

      expect(store.exportPreferences()).toEqual(file)
      expect(store._appTheme).toBe(true)
      expect(store.themeOverrides.common?.primaryColor).toBe('#3468db')
      expect(store.themeOverrides.Card?.borderRadius).toBe('20px')
      expect(store.appRootRoute.path).toBe('/custom-home')
      expect(file.preferences).not.toHaveProperty('appRootRoute')
      expect(file.preferences).not.toHaveProperty('lockScreenSwitch')
      expect(
        JSON.parse(
          localStorage.getItem(APP_CATCH_KEY.appPiniaSettingStore) ?? 'null',
        ),
      ).toMatchObject({
        layoutConfig: { mode: 'right' },
        appTheme: 'dark',
        themeStyle: 'material',
      })
    } finally {
      app.unmount()
      disposePinia(pinia)
      localStorage.removeItem(APP_CATCH_KEY.appPiniaSettingStore)
    }
  })

  it('imports a legacy file and resets preset tokens independently of the accent', () => {
    const pinia = createPinia()

    setActivePinia(pinia)
    const store = piniaSettingStore()

    try {
      store.updateSettingState('themeStyle', 'material')
      store.changePrimaryColor('#3468db')
      const { preferences, ...file } = store.exportPreferences()
      const { themeStyle: _style, ...legacy } = preferences

      store.importPreferences(JSON.stringify({ ...file, preferences: legacy }))
      expect(store.themeStyle).toBe('modern')
      expect(store.themeOverrides.Card?.borderRadius).toBe('12px')
      expect(store.themeOverrides.common?.primaryColor).toBe('#3468db')

      store.changePrimaryColor()
      store.updateSettingState('themeStyle', 'plain')
      expect(store.themeOverrides.common?.boxShadow1).toBe('none')
      store.updateSettingState('themeStyle', 'modern')
      expect(store.themeOverrides.common?.boxShadow1).not.toBe('none')
      expect(store.themeOverrides.common?.primaryColor).toBe('#3b63d9')
    } finally {
      disposePinia(pinia)
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
