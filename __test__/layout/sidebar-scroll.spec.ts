import { mount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useSiderScroll } from '../../src/hooks/template/useSiderScroll'
import Menu from '../../src/layout/components/Menu'
import { router } from '../../src/router'
import { piniaMenuStore } from '../../src/store/modules/menu'
import { piniaSettingStore } from '../../src/store/modules/setting'
import { positionSelectedMenuItem } from '../../src/utils'

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
