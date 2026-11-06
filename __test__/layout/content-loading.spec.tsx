import { mount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import ContentLoading from '../../apps/admin/src/layout/default/ContentWrapper/ContentLoading'
import { piniaRuntimeStore } from '../../apps/admin/src/store/modules/runtime'

vi.mock('@/hooks', () => ({
  useI18n: () => ({ t: () => 'Loading' }),
}))

describe('content loading feedback', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    vi.useFakeTimers()
    pinia = createPinia()
    setActivePinia(pinia)
  })

  afterEach(() => {
    disposePinia(pinia)
    vi.useRealTimers()
  })

  it('delays transient work and exposes a labeled indeterminate progress', async () => {
    const wrapper = mount(ContentLoading, { global: { plugins: [pinia] } })
    const runtime = piniaRuntimeStore()

    try {
      runtime.setRuntimeState('layoutContentSpinning', true)
      await nextTick()
      await vi.advanceTimersByTimeAsync(119)
      expect(wrapper.find('progress').exists()).toBe(false)
      await vi.advanceTimersByTimeAsync(1)

      const progress = wrapper.get('progress')
      const label = wrapper.get(
        `[id="${progress.attributes('aria-labelledby')}"]`,
      )

      expect(progress.attributes('value')).toBeUndefined()
      expect(label.text()).toBe('Loading')
      expect(
        wrapper.find('button, [role="button"], [role="status"]').exists(),
      ).toBe(false)

      runtime.setRuntimeState('layoutContentSpinning', false)
      await nextTick()
      expect(wrapper.find('progress').exists()).toBe(false)
    } finally {
      wrapper.unmount()
    }
  })

  it('cancels delayed feedback when work finishes or the loading host unmounts', async () => {
    const wrapper = mount(ContentLoading, { global: { plugins: [pinia] } })
    const runtime = piniaRuntimeStore()

    runtime.setRuntimeState('layoutContentSpinning', true)
    await nextTick()
    await vi.advanceTimersByTimeAsync(60)
    runtime.setRuntimeState('layoutContentSpinning', false)
    await nextTick()
    await vi.advanceTimersByTimeAsync(120)
    expect(wrapper.find('progress').exists()).toBe(false)

    runtime.setRuntimeState('layoutContentSpinning', true)
    await nextTick()
    expect(vi.getTimerCount()).toBe(1)
    wrapper.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('shows immediately during a content remount and clears when it completes', async () => {
    const runtime = piniaRuntimeStore()

    runtime.setRuntimeState('globalMainLayoutLoad', false)
    const wrapper = mount(ContentLoading, { global: { plugins: [pinia] } })

    try {
      expect(wrapper.find('progress').exists()).toBe(true)
      runtime.setRuntimeState('globalMainLayoutLoad', true)
      await nextTick()
      expect(wrapper.find('progress').exists()).toBe(false)
    } finally {
      wrapper.unmount()
    }
  })
})
