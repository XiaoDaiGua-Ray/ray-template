import { shallowMount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { h } from 'vue'
import Layout from '../../src/layout'
import { router } from '../../src/router'
import { piniaSettingStore } from '../../src/store/modules/setting'

it('lets a custom header replace the complete default header and top navigation', () => {
  const pinia = createPinia()

  setActivePinia(pinia)
  piniaSettingStore().updateSettingState('layoutConfig', { mode: 'top' })
  const options = {
    global: { renderStubDefaultSlot: true, plugins: [router, pinia] },
  }
  const standard = shallowMount(Layout, options)

  expect(standard.find('top-navigation-stub').exists()).toBe(true)
  standard.unmount()
  const custom = shallowMount(Layout, {
    ...options,
    slots: {
      header: () => h('div', { 'data-test': 'custom-header' }, 'Custom'),
    },
  })

  try {
    expect(custom.find('[data-test="custom-header"]').exists()).toBe(true)
    expect(custom.find('top-navigation-stub').exists()).toBe(false)
  } finally {
    custom.unmount()
    disposePinia(pinia)
  }
})
