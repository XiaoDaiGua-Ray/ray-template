import { mount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { h, nextTick } from 'vue'
import GlobalProvider from '../../apps/admin/src/app-components/provider/AppNaiveGlobalProvider'
import AppStyleProvider from '../../apps/admin/src/app-components/provider/AppStyleProvider'
import { piniaSettingStore } from '../../apps/admin/src/store/modules/setting'

it('reuses the global message instance across themes and removes its host on unmount', async () => {
  const pinia = createPinia()

  setActivePinia(pinia)
  const originalChildren = new Set(document.body.children)
  const wrapper = mount(GlobalProvider, {
    global: { plugins: [pinia] },
    slots: { default: () => h(AppStyleProvider) },
  })
  const message = window.$message
  const hosts = () =>
    Array.from(document.body.children).filter((el) => !originalChildren.has(el))

  try {
    expect(hosts()).toHaveLength(1)
    const store = piniaSettingStore()

    store.updateSettingState('themeStyle', 'material')
    store.updateSettingState('appTheme', 'dark')
    await nextTick()
    expect(window.$message).toBe(message)
    expect(
      document.documentElement.style.getPropertyValue('--r-token-primary'),
    ).toBe('#d6bbff')
    expect(
      document.documentElement.style.getPropertyValue('--r-token-radius'),
    ).toBe('20px')
    expect(
      document.documentElement.classList.contains('r-template--dark'),
    ).toBe(true)
    expect(hosts()).toHaveLength(1)
  } finally {
    wrapper.unmount()
    disposePinia(pinia)
  }

  expect(hosts()).toHaveLength(0)
})
