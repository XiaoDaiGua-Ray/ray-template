import { mount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import Appearance from '../../apps/admin/src/layout/components/SiderBar/components/SettingDrawer/segment-views/Appearance'
import Layout from '../../apps/admin/src/layout/components/SiderBar/components/SettingDrawer/segment-views/Layout'
import { piniaRuntimeStore } from '../../apps/admin/src/store/modules/runtime'
import { piniaSettingStore } from '../../apps/admin/src/store/modules/setting'
import { getDefaultSettingConfig } from '../../apps/admin/src/store/modules/setting/constant'

describe('workspace preference shortcuts', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  afterEach(() => disposePinia(pinia))

  it('identifies the default spacing when settings first opens', () => {
    const wrapper = mount(Layout, { global: { plugins: [pinia] } })

    try {
      const selected = wrapper.findAll(
        '.r-workspace-presets button[aria-pressed="true"]',
      )

      expect(selected).toHaveLength(1)
      expect(selected[0].text()).toContain('preferences.layout.spacious')
      expect(wrapper.get('.r-workspace-presets__current').text()).toContain(
        '24 px',
      )
    } finally {
      wrapper.unmount()
    }
  })

  it.each([
    { contentWidth: 'fluid' as const, contentPadding: 16 },
    {
      contentWidth: 'fixed' as const,
      contentMaxWidth: 1200,
      contentPadding: 24,
    },
  ])('shows saved custom spacing without changing it: %j', async (layout) => {
    const store = piniaSettingStore()

    store.updateSettingState('layoutConfig', layout)
    const previousLayout = { ...store.layoutConfig }
    const wrapper = mount(Layout, { global: { plugins: [pinia] } })

    try {
      const current = wrapper.get('.r-workspace-presets__current')

      expect(current.text()).toContain('preferences.layout.custom')
      expect(current.text()).toContain(`${layout.contentPadding} px`)
      expect(
        wrapper.findAll('.r-workspace-presets button[aria-pressed="true"]'),
      ).toHaveLength(0)
      expect(store.layoutConfig).toEqual(previousLayout)

      await wrapper
        .findAll('.r-workspace-presets button')
        .find((button) => button.text() === 'preferences.layout.compact')!
        .trigger('click')

      expect(current.text()).toContain('preferences.layout.compact')
      expect(current.text()).toContain('8 px')
      expect(
        wrapper.get('.r-workspace-presets button[aria-pressed="true"]').text(),
      ).toContain('preferences.layout.compact')

      await wrapper
        .findAll('button')
        .find((button) => button.text() === 'layout.reset')!
        .trigger('click')

      expect(current.text()).toContain('preferences.layout.spacious')
      expect(current.text()).toContain('24 px')
    } finally {
      wrapper.unmount()
    }
  })

  it('applies reading spacing without replacing navigation or fixed bars', async () => {
    const store = piniaSettingStore()

    store.updateSettingState('layoutConfig', {
      mode: 'right',
      fixedHeader: false,
      fixedFooter: false,
    })
    const wrapper = mount(Layout, { global: { plugins: [pinia] } })

    try {
      const button = wrapper
        .findAll('button')
        .find((button) => button.text() === 'preferences.layout.reading')!

      await button.trigger('click')
      expect(store.layoutConfig).toEqual({
        mode: 'right',
        fixedHeader: false,
        fixedFooter: false,
        contentWidth: 'fixed',
        contentMaxWidth: 960,
        contentPadding: 24,
      })
      expect(button.attributes('aria-pressed')).toBe('true')
      await wrapper
        .get('[role="switch"][aria-label="preferences.layout.maximize"]')
        .trigger('click')
      expect(piniaRuntimeStore().layoutContentMaximize).toBe(true)
      expect(store.layoutConfig.mode).toBe('right')
    } finally {
      wrapper.unmount()
    }
  })

  it('resets appearance independently and leaves the selected color mode intact', async () => {
    const store = piniaSettingStore()

    store.updateSettingState('appTheme', 'auto')
    store.updateSettingState('layoutConfig', { mode: 'top' })
    store.updateSettingState('watermarkConfig', { content: 'Keep me' })
    store.updateSettingState('themeStyle', 'plain')
    store.updateSettingState('contentTransition', 'opacity')
    store.changePrimaryColor('#ff0000')
    const wrapper = mount(Appearance, { global: { plugins: [pinia] } })
    const click = async (text: string) =>
      wrapper
        .findAll('button')
        .find((button) => button.text() === `preferences.${text}`)!
        .trigger('click')

    try {
      await click('appearance.minimal')
      expect([
        store.breadcrumbSwitch,
        store.menuTagSwitch,
        store.copyrightSwitch,
      ]).toEqual([false, false, false])
      await click('appearance.reset')
      expect(store.contentTransition).toBe(
        getDefaultSettingConfig().contentTransition,
      )
      expect(store.menuTagSwitch).toBe(getDefaultSettingConfig().menuTagSwitch)
      expect(store.themeStyle).toBe(getDefaultSettingConfig().themeStyle)
      expect(store.primaryColorOverride).toEqual({})
      expect(store.appTheme).toBe('auto')
      expect(store.layoutConfig.mode).toBe('top')
      expect(store.watermarkConfig.content).toBe('Keep me')
    } finally {
      wrapper.unmount()
    }
  })
})
