import GlobalSearch from '@/layout/components/Search/GlobalSearch'
import { router } from '@/router'
import { piniaMenuStore } from '@/store/modules/menu'
import { piniaNavigationHistoryStore } from '@/store/modules/navigation-history'
import { piniaSigningStore } from '@/store/modules/signing'
import type { AppMenuOption } from '@/types'
import { flushPromises, mount } from '@vue/test-utils'
import setupMiniApp from '../utils/setupMiniApp'

const option = (path: string, label: string, show = true): AppMenuOption => ({
  path,
  fullPath: path,
  key: path,
  name: path,
  breadcrumbLabel: label,
  label,
  show,
  meta: {},
})

it('filters cached entries by current menu visibility and keeps favorite toggles separate from navigation', async () => {
  vi.stubGlobal('innerWidth', 1440)
  const { app } = await setupMiniApp()

  piniaSigningStore().signingCallback = {
    id: 'search-user',
    name: 'Search User',
    role: 'admin',
  }
  const menu = piniaMenuStore()

  menu.options = [
    option('/visible', 'Visible page'),
    option('/hidden', 'Hidden page', false),
  ]
  const history = piniaNavigationHistoryStore()

  history.recordVisit('/visible')
  history.toggleFavorite('/hidden')
  history.toggleFavorite('/removed')
  const navigate = vi
    .spyOn(menu, 'changeMenuModelValue')
    .mockImplementation(() => void 0)
  const wrapper = mount(GlobalSearch, {
    attachTo: document.body,
    props: { show: true },
    global: {
      plugins: [router],
      stubs: {
        teleport: true,
        Modal: { inheritAttrs: false, template: '<div><slot /></div>' },
        RIcon: { inheritAttrs: false, template: '<span />' },
      },
    },
  })

  try {
    await flushPromises()
    expect(wrapper.find('.global-search').text()).toContain('Visible page')
    expect(wrapper.find('.global-search').text()).not.toContain('Hidden page')
    const star = wrapper.find('.global-search__favorite')
      .element as HTMLButtonElement

    star.click()
    await flushPromises()
    expect(history.favoritePaths).toContain('/visible')
    expect(navigate).not.toHaveBeenCalled()
    menu.options = []
    await flushPromises()
    expect(wrapper.find('.global-search__destination').exists()).toBe(false)
  } finally {
    wrapper.unmount()
    app.unmount()
    vi.unstubAllGlobals()
  }
})

it('does not navigate while composing and supports keyboard result focus and Enter', async () => {
  vi.stubGlobal('innerWidth', 1440)
  const { app } = await setupMiniApp()

  piniaSigningStore().signingCallback = {
    id: 'keyboard-user',
    name: 'Keyboard User',
    role: 'admin',
  }
  const menu = piniaMenuStore()

  menu.options = [option('/visible', 'Visible page')]
  const navigate = vi
    .spyOn(menu, 'changeMenuModelValue')
    .mockImplementation(() => void 0)
  const wrapper = mount(GlobalSearch, {
    attachTo: document.body,
    props: { show: true },
    global: {
      plugins: [router],
      stubs: {
        teleport: true,
        Modal: { inheritAttrs: false, template: '<div><slot /></div>' },
        RIcon: { inheritAttrs: false, template: '<span />' },
      },
    },
  })

  try {
    await flushPromises()
    const input = wrapper.find('input').element as HTMLInputElement

    input.value = 'Visible'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await flushPromises()
    expect(wrapper.findAll('.global-search__destination')).toHaveLength(1)
    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        isComposing: true,
        bubbles: true,
      }),
    )
    expect(navigate).not.toHaveBeenCalled()
    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(
      document.activeElement?.classList.contains('global-search__destination'),
    ).toBe(true)
    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      }),
    )
    await flushPromises()
    expect(navigate).toHaveBeenCalledTimes(1)
  } finally {
    wrapper.unmount()
    app.unmount()
    vi.unstubAllGlobals()
  }
})
