import MenuTag from '@/layout/components/MenuTag'
import type { MenuTagOptions } from '@/types'
import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { NDropdown, NTag } from 'naive-ui'
import { h, nextTick, ref } from 'vue'
import type { Ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { Router } from 'vue-router'

const state = vi.hoisted(() => ({
  tags: null as unknown as Ref<MenuTagOptions[]>,
  active: null as unknown as Ref<MenuTagOptions | null>,
  round: null as unknown as Ref<boolean>,
  top: null as unknown as Ref<boolean>,
  fixed: null as unknown as Ref<boolean>,
  drag: null as unknown as Ref<boolean>,
  close: vi.fn(),
  navigate: vi.fn(),
  move: vi.fn(),
  toggleTop: vi.fn(),
  toggleFixed: vi.fn(),
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
  useMenuActions: () => ({
    changeMenuModelValue: state.navigate,
    isMenuTagTopped: (tag?: MenuTagOptions) =>
      state.top.value && tag?.topped === true,
    isMenuTagFixed: (tag?: MenuTagOptions) =>
      state.fixed.value && tag?.fixed === true,
    toggleMenuTagTop: state.toggleTop,
    toggleMenuTagFixed: state.toggleFixed,
    moveMenuTag: state.move,
  }),
  useRuntimeGetters: () => ({ globalMainLayoutLoad: ref(true) }),
  useSettingGetters: () => ({
    getMenuTagRound: state.round,
    getMenuTagTop: state.top,
    getMenuTagFixed: state.fixed,
    getMenuTagDrag: state.drag,
  }),
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
  state.round = ref(false)
  state.top = ref(true)
  state.fixed = ref(true)
  state.drag = ref(true)
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
      stubs: { 'transition-group': false },
      mocks: {
        $t: (key: string, params?: { name: string }) =>
          params ? `${key}:${params.name}` : key,
      },
    },
  })
})

afterEach(() => {
  wrapper.unmount()
  router.options.history.destroy()
  host.remove()
  outside.remove()
  vi.unstubAllGlobals()
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

it('closes with the named native tag button without selecting the page', async () => {
  const closeButton = wrapper.get(
    'button.n-tag__close[aria-label="menuTag.closeNamed:Orders"]',
  )

  await closeButton.trigger('click', { detail: 1 })

  expect(state.close).toHaveBeenCalledExactlyOnceWith(1)
  expect(state.navigate).not.toHaveBeenCalled()
})

it('updates the native close label when the tag is renamed', async () => {
  const closeButton = wrapper.get('.n-tag__close')

  expect(closeButton.attributes('aria-label')).toBe(
    'menuTag.closeNamed:Reports',
  )
  state.tags.value[0]!.breadcrumbLabel = 'Summary'
  await nextTick()
  expect(closeButton.attributes('aria-label')).toBe(
    'menuTag.closeNamed:Summary',
  )
})

it.each(['button', 'Delete'])(
  'restores focus after closing by keyboard (%s)',
  async (method) => {
    state.close.mockImplementationOnce((index: number) => {
      state.tags.value.splice(index, 1)
    })
    const tab = wrapper.get<HTMLButtonElement>('.menu-tag__tab[title="Orders"]')
    const closeButton = wrapper.get<HTMLButtonElement>(
      'button.n-tag__close[aria-label="menuTag.closeNamed:Orders"]',
    )

    if (method === 'Delete') {
      tab.element.focus()
      await tab.trigger('keydown', { key: 'Delete' })
    } else {
      closeButton.element.focus()
      await closeButton.trigger('click', { detail: 0 })
    }

    expect(state.close).toHaveBeenCalledExactlyOnceWith(1)
    expect(state.navigate).not.toHaveBeenCalled()
    expect(document.activeElement?.textContent).toBe('Users')
  },
)

it('uses the native primary type only for the current page', async () => {
  const tagTypes = () =>
    wrapper.findAllComponents(NTag).map((tag) => tag.props('type'))

  expect(tagTypes()).toEqual(['primary', 'default', 'default'])
  state.active.value = state.tags.value[1]!
  await nextTick()
  expect(tagTypes()).toEqual(['default', 'primary', 'default'])
})

it('applies the native round style to open tags when the preference changes', async () => {
  const tag = wrapper.get('.menu-tag__item')

  expect(tag.classes('n-tag--round')).toBe(false)
  state.round.value = true
  await nextTick()
  expect(tag.classes('n-tag--round')).toBe(true)
})

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

it('keeps context commands tied to the selected page when the order changes', async () => {
  await openContextMenu(0)
  state.tags.value.reverse()
  await nextTick()
  const command = Array.from(
    document.querySelectorAll('.n-dropdown-option-body'),
  ).find((option) => option.textContent === 'fix')

  mouse(command!, 'click', 0)
  expect(state.toggleFixed).toHaveBeenCalledExactlyOnceWith('/reports')
})

it('updates tab indicators and actions while preferences change', async () => {
  state.tags.value[0].topped = true
  state.tags.value[0].fixed = true
  await openContextMenu(0)
  const tab = wrapper.get('[data-menu-tag-path="/reports"]')
  const actions = () =>
    contextDropdown()
      .props('options')
      ?.map((option) => option.key)

  expect(tab.find('.n-tag__close').exists()).toBe(false)
  expect(tab.findAll('.menu-tag__indicator')).toHaveLength(2)
  expect(actions()).toEqual(
    expect.arrayContaining(['toggleTop', 'toggleFixed']),
  )

  state.top.value = false
  state.fixed.value = false
  state.drag.value = false
  await nextTick()
  expect(tab.find('.n-tag__close').exists()).toBe(true)
  expect(tab.findAll('.menu-tag__indicator')).toHaveLength(0)
  expect(wrapper.findAll('.menu-tag__handle')).toHaveLength(0)
  expect(actions()).not.toContain('toggleTop')
  expect(actions()).not.toContain('toggleFixed')
})

it('sends the focused handle’s keyboard reorder to the tab store', async () => {
  const handle = wrapper.get(
    '[data-menu-tag-path="/reports"] .menu-tag__handle',
  )

  await handle.trigger('keydown', { key: 'ArrowRight' })
  expect(state.move).not.toHaveBeenCalled()
  await handle.trigger('keydown', { key: 'ArrowRight', shiftKey: true })
  expect(state.move).toHaveBeenCalledExactlyOnceWith(
    '/reports',
    '/orders',
    'after',
  )
  expect(state.navigate).not.toHaveBeenCalled()
})

it('measures a burst of pointer moves once and uses the release position', () => {
  const row = wrapper.get<HTMLElement>('.menu-tag-wrapper').element
  const scroller = row.closest('.n-scrollbar-container')!
  const measure = vi.fn(() => new DOMRect(0, 0, 300, 32))

  scroller.getBoundingClientRect = measure
  row.getBoundingClientRect = () => new DOMRect(0, 0, 300, 32)
  const tags = wrapper.findAll<HTMLElement>('[data-menu-tag-path]')

  tags.forEach(({ element }, index) => {
    Object.defineProperties(element, {
      offsetLeft: { value: index * 100 },
      offsetWidth: { value: 100 },
    })
  })
  const handle = tags[0].get<HTMLButtonElement>('.menu-tag__handle').element
  const release = vi.fn()

  handle.setPointerCapture = vi.fn()
  handle.hasPointerCapture = () => true
  handle.releasePointerCapture = release
  const requestFrame = vi.fn((_callback: FrameRequestCallback) => 1)

  vi.stubGlobal('requestAnimationFrame', requestFrame)
  const point = (type: string, clientX: number) =>
    handle.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        isPrimary: true,
        pointerId: 2,
        clientX,
        clientY: 16,
      }),
    )

  point('pointerdown', 10)
  point('pointermove', 110)
  point('pointermove', 180)
  expect(measure).not.toHaveBeenCalled()
  expect(requestFrame).toHaveBeenCalledTimes(1)

  requestFrame.mock.calls[0][0](16)
  expect(measure).toHaveBeenCalledTimes(1)
  expect(requestFrame).toHaveBeenCalledTimes(1)
  expect(tags[2].attributes('data-menu-tag-drop')).toBe('before')
  expect(state.move).not.toHaveBeenCalled()

  point('pointerup', 285)
  expect(state.move).toHaveBeenCalledExactlyOnceWith(
    '/reports',
    '/users',
    'after',
  )
  expect(release).toHaveBeenCalledExactlyOnceWith(2)
  expect(
    row.querySelector('[data-menu-tag-drop],[data-menu-tag-dragged]'),
  ).toBeNull()
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
