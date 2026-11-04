import { mount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import GlobalProvider from '../../apps/admin/src/app-components/provider/AppNaiveGlobalProvider'
import { piniaSettingStore } from '../../apps/admin/src/store/modules/setting'

it('reuses the global message instance across themes and removes its host on unmount', async () => {
  const pinia = createPinia()

  setActivePinia(pinia)
  const originalChildren = new Set(document.body.children)
  const wrapper = mount(GlobalProvider, { global: { plugins: [pinia] } })
  const message = window.$message
  const hosts = () =>
    Array.from(document.body.children).filter((el) => !originalChildren.has(el))

  try {
    expect(hosts()).toHaveLength(1)
    piniaSettingStore().updateSettingState('_appTheme', true)
    await nextTick()
    expect(window.$message).toBe(message)
    expect(hosts()).toHaveLength(1)
  } finally {
    wrapper.unmount()
    disposePinia(pinia)
  }

  expect(hosts()).toHaveLength(0)
})
