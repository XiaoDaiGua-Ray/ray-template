import { mount } from '@vue/test-utils'
import { NButton, NInput, NInputNumber, NWatermark } from 'naive-ui'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import WatermarkSettings from '../../apps/admin/src/layout/components/SiderBar/components/SettingDrawer/segment-views/Watermark'
import { piniaSettingStore } from '../../apps/admin/src/store/modules/setting'
import { getDefaultSettingConfig } from '../../apps/admin/src/store/modules/setting/constant'
import { piniaSigningStore } from '../../apps/admin/src/store/modules/signing'

const mountSettings = () =>
  mount(WatermarkSettings, { global: { stubs: { Watermark: true } } })

const buttonFor = (wrapper: ReturnType<typeof mountSettings>, key: string) =>
  wrapper
    .findAllComponents(NButton)
    .find((button) => button.text() === `preferences.watermark.${key}`)!

describe('watermark preference controls', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  afterEach(() => disposePinia(pinia))

  it('previews style presets without changing text, visibility, or other preferences', async () => {
    const store = piniaSettingStore()

    store.updateSettingState('watermarkConfig', {
      content: 'Custom\nWatermark',
    })
    store.updateSettingState('layoutConfig', { mode: 'top' })
    const wrapper = mountSettings()

    try {
      await buttonFor(wrapper, 'compact').trigger('click')
      expect(store.watermarkConfig).toMatchObject({
        content: 'Custom\nWatermark',
        width: 256,
        cross: true,
      })
      expect(store.watermarkSwitch).toBe(false)
      expect(store.layoutConfig.mode).toBe('top')
      expect(wrapper.findComponent(NWatermark).props()).toMatchObject({
        content: 'Custom\nWatermark',
        width: 256,
        fullscreen: false,
      })

      store.updateSettingState('watermarkSwitch', true)
      await buttonFor(wrapper, 'horizontal').trigger('click')
      expect(store.watermarkConfig.rotate).toBe(0)
      expect(store.watermarkSwitch).toBe(true)
      await buttonFor(wrapper, 'reset').trigger('click')
      expect(store.watermarkConfig).toEqual(
        getDefaultSettingConfig().watermarkConfig,
      )
      expect(store.watermarkSwitch).toBe(false)
      expect(store.layoutConfig.mode).toBe('top')
    } finally {
      wrapper.unmount()
    }
  })

  it('uses available display text and still allows clearing the content', async () => {
    const store = piniaSettingStore()
    const signing = piniaSigningStore()
    const wrapper = mountSettings()

    try {
      expect(buttonFor(wrapper, 'useAccountName').props('disabled')).toBe(true)
      signing.signingCallback = { name: 'Ray', role: 'admin' }
      await nextTick()
      await buttonFor(wrapper, 'useAccountName').trigger('click')
      expect(store.watermarkConfig.content).toBe('Ray')
      await buttonFor(wrapper, 'useApplicationTitle').trigger('click')
      expect(store.watermarkConfig.content).toBe(store.sideBarLogo?.title)

      await wrapper.findComponent(NInput).find('textarea').setValue('')
      expect(store.watermarkConfig.content).toBe('')
      expect(store.watermarkSwitch).toBe(false)
    } finally {
      wrapper.unmount()
    }
  })

  it('keeps each generated canvas edge within its supported bounds', async () => {
    const store = piniaSettingStore()
    const wrapper = mountSettings()
    const numberFor = (key: string) =>
      wrapper
        .findAllComponents(NInputNumber)
        .find((input) => input.props('inputProps')?.id?.endsWith(`-${key}`))!
    const update = async (key: string, value: number) => {
      const handler = numberFor(key).props('onUpdateValue')

      if (Array.isArray(handler)) handler.forEach((callback) => callback(value))
      else handler?.(value)

      await nextTick()
    }

    try {
      await update('xGap', 100)
      expect(numberFor('width').props('max')).toBe(3996)
      await update('width', 3996)
      expect(store.watermarkConfig.width + store.watermarkConfig.xGap).toBe(
        4096,
      )
      await update('width', 3997)
      expect(store.watermarkConfig.width).toBe(3996)
      await update('xGap', -3996)
      expect(store.watermarkConfig.xGap).toBe(100)
      await update('xGap', -3995)
      expect(store.watermarkConfig.width + store.watermarkConfig.xGap).toBe(1)
      await update('height', Number.POSITIVE_INFINITY)
      expect(store.watermarkConfig.height).toBe(384)
    } finally {
      wrapper.unmount()
    }
  })
})
