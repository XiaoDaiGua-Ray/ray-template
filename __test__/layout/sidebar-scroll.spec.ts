import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useSiderScroll } from '../../apps/admin/src/hooks/template/useSiderScroll'
import Menu from '../../apps/admin/src/layout/components/Menu'
import { router } from '../../apps/admin/src/router'
import { piniaMenuStore } from '../../apps/admin/src/store/modules/menu'
import { piniaRuntimeStore } from '../../apps/admin/src/store/modules/runtime'
import { piniaSettingStore } from '../../apps/admin/src/store/modules/setting'
import { positionSelectedMenuItem } from '../../apps/admin/src/utils'
import setupMiniApp from '../utils/setupMiniApp'

it.each([
  [true, '.n-layout-scroll-container'],
  [false, '.n-scrollbar-container'],
])(
  'keeps the logo outside the menu scroll region (native: %s)',
  async (nativeScrollbar, selector) => {
    const pinia = createPinia()

    setActivePinia(pinia)
    piniaSettingStore().updateSettingState('menuConfig', { nativeScrollbar })

    const wrapper = mount(Menu, {
      global: { plugins: [router, pinia] },
      props: {
        options: [
          {
            name: 'selected',
            label: 'Selected',
            path: '/selected',
            fullPath: '/selected',
            key: '/selected',
            meta: {},
          },
        ],
      },
    })

    try {
      piniaMenuStore().updateMenuState('menuKey', '/selected')
      await nextTick()
      await vi.dynamicImportSettled()
      const logo = wrapper.get('.r-menu__logo').element
      const scroller = wrapper.get<HTMLElement>(
        `.app-menu__scroll ${selector}`,
      ).element
      const selected = wrapper.get('.n-menu-item-content--selected').element

      expect(scroller.contains(logo)).toBe(false)
      expect(scroller.contains(selected)).toBe(true)

      const scrollTo = vi
        .spyOn(scroller, 'scrollTo')
        .mockImplementation(() => {})

      useSiderScroll()({ left: 0, top: 30 })
      expect(scrollTo).toHaveBeenCalledWith(
        expect.objectContaining({ top: 30 }),
      )
      scrollTo.mockClear()

      scroller.scrollTop = 80
      vi.spyOn(scroller, 'getBoundingClientRect').mockReturnValue(
        new DOMRect(0, 64, 272, 200),
      )
      const itemRect = vi.spyOn(selected, 'getBoundingClientRect')

      itemRect.mockReturnValue(new DOMRect(0, 100, 272, 40))
      positionSelectedMenuItem()
      expect(scrollTo).not.toHaveBeenCalled()

      itemRect.mockReturnValue(new DOMRect(0, 300, 272, 40))
      positionSelectedMenuItem()
      expect(scrollTo).toHaveBeenCalledWith(
        expect.objectContaining({ top: 316, behavior: 'smooth' }),
      )
    } finally {
      wrapper.unmount()
      disposePinia(pinia)
    }
  },
)

it('keeps the desktop collapse preference while the phone menu opens and closes', async () => {
  vi.stubGlobal('innerWidth', 390)
  const { app } = await setupMiniApp()
  const menu = piniaMenuStore()
  const runtime = piniaRuntimeStore()

  menu.updateMenuState('collapsed', true)
  runtime.setRuntimeState('globalDrawerValue', true)
  const wrapper = mount(Menu, {
    attachTo: document.body,
    global: {
      plugins: [router],
      stubs: {
        teleport: true,
        RIcon: { inheritAttrs: false, template: '<span />' },
      },
    },
  })

  try {
    await flushPromises()
    expect(menu.collapsed).toBe(true)
    expect(wrapper.find('.app-menu__mobile-heading').exists()).toBe(true)
    expect(wrapper.find('.n-layout-sider--collapsed').exists()).toBe(false)

    await wrapper.get('.app-menu__close').trigger('click')
    expect(runtime.globalDrawerValue).toBe(false)
    runtime.setRuntimeState('globalDrawerValue', true)

    vi.stubGlobal('innerWidth', 1440)
    window.dispatchEvent(new Event('resize'))
    await flushPromises()
    expect(runtime.globalDrawerValue).toBe(false)
    expect(menu.collapsed).toBe(true)
    expect(wrapper.find('.app-menu__mobile-heading').exists()).toBe(false)
    expect(wrapper.find('.n-layout-sider--collapsed').exists()).toBe(true)
  } finally {
    wrapper.unmount()
    app.unmount()
    vi.unstubAllGlobals()
  }
})
