import { shallowMount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { h, nextTick } from 'vue'
import Layout from '../../src/layout'
import { router } from '../../src/router'
import { piniaRuntimeStore } from '../../src/store/modules/runtime'
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

it('offers a restore button for custom content and also exits with Escape', async () => {
  const pinia = createPinia()

  setActivePinia(pinia)
  const runtime = piniaRuntimeStore()
  const wrapper = shallowMount(Layout, {
    global: { renderStubDefaultSlot: true, plugins: [router, pinia] },
    slots: {
      default: () => h('div', { 'data-test': 'custom-content' }, 'Custom'),
    },
  })

  try {
    expect(wrapper.find('.r-layout-content-restore__button').exists()).toBe(
      false,
    )
    runtime.setRuntimeState('layoutContentMaximize', true)
    await nextTick()
    expect(wrapper.find('[data-test="custom-content"]').exists()).toBe(true)
    await wrapper.get('.r-layout-content-restore__button').trigger('click')
    expect(runtime.layoutContentMaximize).toBe(false)

    runtime.setRuntimeState('layoutContentMaximize', true)
    await nextTick()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(runtime.layoutContentMaximize).toBe(false)
  } finally {
    wrapper.unmount()
    disposePinia(pinia)
  }
})

it('moves the full navigation to the right without adding a second menu', () => {
  const pinia = createPinia()

  setActivePinia(pinia)
  piniaSettingStore().updateSettingState('layoutConfig', { mode: 'right' })
  const wrapper = shallowMount(Layout, {
    global: { renderStubDefaultSlot: true, plugins: [router, pinia] },
  })

  try {
    expect(wrapper.get('app-menu-stub').attributes('end')).toBe('true')
    expect(wrapper.find('top-navigation-stub').exists()).toBe(false)
  } finally {
    wrapper.unmount()
    disposePinia(pinia)
  }
})
