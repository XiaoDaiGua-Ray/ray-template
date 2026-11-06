import MenuTag from '@/layout/components/MenuTag'
import type { MenuTagOptions } from '@/types'
import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { NDropdown } from 'naive-ui'
import { h, nextTick, ref } from 'vue'
import type { Ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { Router } from 'vue-router'

const state = vi.hoisted(() => ({
  tags: null as unknown as Ref<MenuTagOptions[]>,
  active: null as unknown as Ref<MenuTagOptions | null>,
  close: vi.fn(),
  navigate: vi.fn(),
}))

vi.mock('@/hooks', () => ({
  useI18n: () => ({ t: (key: string) => key }),
  useMaximize: () => ({ maximize: vi.fn() }),
  useSpinning: () => ({ reload: vi.fn() }),
  useSiderBar: () => ({
    close: state.close,
    closeForbiddenPage: vi.fn(),
    closeAll: vi.fn(),
    closeRight: vi.fn(),
    closeLeft: vi.fn(),
    closeOther: vi.fn(),
    checkCloseLeft: (index: number) => index > 0,
    checkCloseRight: (index: number) => index < state.tags.value.length - 1,
  }),
}))

vi.mock('@/store', () => ({
  useMenuGetters: () => ({
    getMenuTagOptions: state.tags,
    getCurrentMenuOption: state.active,
  }),
  useMenuActions: () => ({ changeMenuModelValue: state.navigate }),
  useRuntimeGetters: () => ({ globalMainLayoutLoad: ref(true) }),
}))

let wrapper: VueWrapper
let router: Router
let host: HTMLElement
let outside: HTMLButtonElement

beforeEach(async () => {
  vi.clearAllMocks()
  state.tags = ref(
    ['Reports', 'Orders', 'Users'].map((label) => ({
      fullPath: `/${label.toLowerCase()}`,
      breadcrumbLabel: label,
      meta: {},
    })) as MenuTagOptions[],
  )
  state.active = ref(state.tags.value[0]!)
  router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/:pathMatch(.*)*', component: { render: () => h('div') } },
    ],
  })
  await router.push('/reports')
  host = document.createElement('div')
  outside = document.createElement('button')
  document.body.append(host, outside)
  wrapper = mount(MenuTag, {
    attachTo: host,
    global: {
      plugins: [router],
      mocks: { $t: (key: string) => key },
    },
  })
})

afterEach(() => {
  wrapper.unmount()
  router.options.history.destroy()
  host.remove()
  outside.remove()
})

const contextDropdown = () =>
  wrapper
    .findAllComponents(NDropdown)
    .find((menu) => menu.props('trigger') === 'manual')!

const mouse = (element: Element, type: string, button: number) => {
  element.dispatchEvent(
    new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      button,
      clientX: 120,
      clientY: 80,
    }),
  )
}

const openContextMenu = async (index: number) => {
  const tab = wrapper.findAll('.menu-tag__tab')[index]!.element

  mouse(tab, 'mousedown', 2)
  mouse(tab, 'contextmenu', 2)
  await nextTick()
  await nextTick()
  mouse(tab, 'mouseup', 2)
  await flushPromises()
}

it('keeps the context menu open while repeatedly right-clicking other tags', async () => {
  for (const index of [0, 1, 2, 0]) {
    await openContextMenu(index)
    expect(contextDropdown().props('show')).toBe(true)
    expect(document.querySelector('.menu-tag__dropdown')).not.toBeNull()
  }
})

it('applies a context command to the most recently right-clicked tag', async () => {
  await openContextMenu(0)
  await openContextMenu(2)

  const command = [
    ...document.querySelectorAll('.n-dropdown-option-body'),
  ].find((option) => option.textContent === 'closeCurrent')

  expect(command).toBeDefined()
  mouse(command!, 'click', 0)
  await nextTick()
  expect(state.close).toHaveBeenCalledExactlyOnceWith(2)
  expect(contextDropdown().props('show')).toBe(false)
})

it.each([0, 2])(
  'dismisses when mouse button %i is clicked outside the tags and menu',
  async (button) => {
    await openContextMenu(0)
    mouse(outside, 'mousedown', button)
    mouse(outside, 'mouseup', button)
    await nextTick()
    expect(contextDropdown().props('show')).toBe(false)
  },
)

it('dismisses the context menu when selecting a different tag', async () => {
  await openContextMenu(0)
  const tab = wrapper.findAll('.menu-tag__tab')[1]!

  mouse(tab.element, 'mousedown', 0)
  mouse(tab.element, 'mouseup', 0)
  await tab.trigger('click')
  expect(contextDropdown().props('show')).toBe(false)
  expect(state.navigate).toHaveBeenCalledExactlyOnceWith(
    '/orders',
    state.tags.value[1],
  )
})

it('dismisses the context menu with Escape after switching tags', async () => {
  await openContextMenu(0)
  await openContextMenu(1)
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
  )
  await nextTick()
  expect(contextDropdown().props('show')).toBe(false)
})
