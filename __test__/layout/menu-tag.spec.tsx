import MenuTag from '@/layout/components/MenuTag'
import type { MenuTagOptions } from '@/types'
import { RIcon } from '@ray-template/ui/icon'
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
  await import('interactjs')
  await flushPromises()
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

const point = (
  element: Element,
  type: string,
  clientX: number,
  clientY = 16,
) => {
  const event = new PointerEvent(type, {
    bubbles: true,
    isPrimary: true,
    pointerId: 2,
    pointerType: 'mouse',
    buttons: type === 'pointerup' ? 0 : 1,
    clientX,
    clientY,
  })

  Object.defineProperties(event, {
    pageX: { value: clientX },
    pageY: { value: clientY },
  })
  element.dispatchEvent(event)
}

const dragPreview = () =>
  document.body.querySelector<HTMLElement>('.menu-tag__drag-preview')

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

  point(closeButton.element, 'pointerdown', 10)
  point(closeButton.element, 'pointermove', 40)
  expect(wrapper.find('[data-menu-tag-dragged]').exists()).toBe(false)
  point(closeButton.element, 'pointerup', 40)
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

it('shares the native border across tabs and highlights the current page', async () => {
  const tagTypes = () =>
    wrapper.findAllComponents(NTag).map((tag) => tag.props('type'))

  expect(tagTypes()).toEqual(['primary', 'default', 'default'])
  state.tags.value[0]!.fixed = true
  state.active.value = state.tags.value[1]!
  await nextTick()
  expect(tagTypes()).toEqual(['default', 'primary', 'default'])
  expect(wrapper.findAll('.menu-tag__item .n-tag__border')).toHaveLength(3)
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

it('updates tab status and actions while preferences change', async () => {
  state.tags.value[0].topped = true
  state.tags.value[0].fixed = true
  await openContextMenu(0)
  const tab = wrapper.get('[data-menu-tag-path="/reports"]')
  const actions = () =>
    contextDropdown()
      .props('options')
      ?.map((option) => option.key)

  const pin = tab.get('.n-tag__icon').getComponent(RIcon)
  const label = tab.get('.menu-tag__tab')

  expect(tab.find('.n-tag__close').exists()).toBe(false)
  expect(pin.props('name')).toBe('action/pin')
  expect(pin.attributes('aria-hidden')).toBe('true')
  expect(label.attributes('aria-label')).toBe(
    'Reports · menuTag.topped · menuTag.fixed',
  )
  expect(actions()).toEqual(
    expect.arrayContaining(['toggleTop', 'toggleFixed']),
  )

  state.top.value = false
  state.fixed.value = false
  state.drag.value = false
  await nextTick()
  expect(tab.find('.n-tag__close').exists()).toBe(true)
  expect(tab.find('.n-tag__icon').exists()).toBe(false)
  expect(label.attributes('aria-label')).toBeUndefined()
  expect(label.attributes('aria-keyshortcuts')).toBeUndefined()
  expect(actions()).not.toContain('toggleTop')
  expect(actions()).not.toContain('toggleFixed')
})

it('reorders a focused protected tab with Shift and an arrow key', async () => {
  state.tags.value[0].fixed = true
  await nextTick()
  const tab = wrapper.get('[data-menu-tag-path="/reports"]')
  const button = tab.get('.menu-tag__tab')

  expect(tab.find('.n-tag__close').exists()).toBe(false)
  expect(button.attributes('aria-keyshortcuts')).toBe(
    'Shift+ArrowLeft Shift+ArrowRight',
  )
  await button.trigger('keydown', { key: 'ArrowRight' })
  expect(state.move).not.toHaveBeenCalled()
  await button.trigger('keydown', { key: 'ArrowRight', shiftKey: true })
  expect(state.move).toHaveBeenCalledExactlyOnceWith(
    '/reports',
    '/orders',
    'after',
  )
  expect(state.navigate).not.toHaveBeenCalled()
})

const mockTagRects = (viewportWidth = 300) => {
  const row = wrapper.get<HTMLElement>('.menu-tag-wrapper').element
  const scroller = row.closest('.n-scrollbar-container')!
  const mockRect = (element: Element, measure: () => DOMRect) => {
    element.getBoundingClientRect = measure
    element.getClientRects = () => [measure()] as unknown as DOMRectList
  }

  mockRect(scroller, () => new DOMRect(0, 0, viewportWidth, 32))
  Object.defineProperties(scroller, {
    clientWidth: { value: viewportWidth },
    scrollWidth: { value: 300 },
  })
  mockRect(row, () => new DOMRect(-scroller.scrollLeft, 0, 300, 32))
  const tags = wrapper.findAll<HTMLElement>('[data-menu-tag-path]')

  tags.forEach(({ element }, index) => {
    Object.defineProperties(element, {
      offsetLeft: { value: index * 100 },
      offsetWidth: { value: 94 },
    })
    mockRect(
      element,
      () => new DOMRect(index * 100 - scroller.scrollLeft, 0, 94, 30),
    )
  })

  return { row, scroller, tags }
}

it('reorders from the tab body using the release position and ignores the drag click', async () => {
  const { row, tags } = mockTagRects()
  const source = tags[0].element

  point(source, 'pointerdown', 10)
  expect(dragPreview()).toBeNull()
  point(tags[1].element, 'pointermove', 180, 22)
  const preview = dragPreview()!

  expect(preview.parentElement).toBe(row.closest('.menu-tag'))
  expect(preview.textContent).toBe(source.textContent)
  expect(preview.dataset.menuTagPath).toBeUndefined()
  expect(preview.getAttribute('aria-hidden')).toBe('true')
  expect(preview.hasAttribute('inert')).toBe(true)
  expect(preview.style.transform).toBe('translate3d(170px, 6px, 0)')

  point(tags[1].element, 'pointermove', 190, 24)
  expect(dragPreview()).toBe(preview)
  expect(preview.style.transform).toBe('translate3d(180px, 8px, 0)')
  expect(tags[1].attributes('data-menu-tag-drop')).toBe('after')
  expect(state.move).not.toHaveBeenCalled()

  point(tags[2].element, 'pointerup', 285)
  expect(state.move).toHaveBeenCalledExactlyOnceWith(
    '/reports',
    '/users',
    'after',
  )
  expect(
    row.querySelector('[data-menu-tag-drop],[data-menu-tag-dragged]'),
  ).toBeNull()
  expect(dragPreview()).toBeNull()

  await tags[0].trigger('click', { detail: 1 })
  expect(state.navigate).not.toHaveBeenCalled()

  point(source, 'pointerdown', 10)
  point(source, 'pointermove', 12)
  point(source, 'pointerup', 12)
  await tags[0].trigger('click', { detail: 1 })

  expect(state.navigate).toHaveBeenCalledExactlyOnceWith(
    '/reports',
    state.tags.value[0],
  )
  expect(state.move).toHaveBeenCalledTimes(1)
})

it.each([
  { target: 'outside the horizontal viewport', x: -10, firstTopped: false },
  { target: 'over the other tab group', x: 20, firstTopped: true },
])('rejects a drop $target', async ({ x, firstTopped }) => {
  state.tags.value[0]!.topped = firstTopped
  await nextTick()
  const { row, tags } = mockTagRects()
  const source = tags[2].element
  const target = firstTopped ? tags[0].element : outside

  point(source, 'pointerdown', 240)
  point(target, 'pointermove', x)
  expect(source.hasAttribute('data-menu-tag-dragged')).toBe(true)
  expect(row.querySelector('[data-menu-tag-drop]')).toBeNull()
  point(target, 'pointerup', x)
  expect(state.move).not.toHaveBeenCalled()
})

it('refreshes the drop marker after a scroll with a stationary pointer', () => {
  const { scroller, tags } = mockTagRects(220)
  const source = tags[0].element
  const requestFrame = vi.fn((_callback: FrameRequestCallback) => 1)

  vi.stubGlobal('requestAnimationFrame', requestFrame)

  point(source, 'pointerdown', 30)
  point(tags[1].element, 'pointermove', 180)
  const position = dragPreview()?.style.transform

  expect(position).toBe('translate3d(150px, 0px, 0)')
  expect(tags[1].attributes('data-menu-tag-drop')).toBe('after')
  expect(requestFrame).toHaveBeenCalledTimes(1)
  requestFrame.mock.calls[0][0](16)

  scroller.scrollLeft = 80
  scroller.dispatchEvent(new Event('scroll'))
  expect(requestFrame).toHaveBeenCalledTimes(2)
  requestFrame.mock.calls[1][0](32)
  expect(tags[2].attributes('data-menu-tag-drop')).toBe('after')
  expect(dragPreview()?.style.transform).toBe(position)
  point(tags[2].element, 'pointerup', 180)
})

it('cancels dragging with Escape and preserves keyboard activation', async () => {
  const button = wrapper.get<HTMLButtonElement>(
    '[data-menu-tag-path="/orders"] .menu-tag__tab',
  )

  point(button.element, 'pointerdown', 10)
  point(button.element, 'pointermove', 60)
  expect(wrapper.find('[data-menu-tag-dragged]').exists()).toBe(true)
  await button.trigger('keydown', { key: 'Escape' })
  expect(dragPreview()).toBeNull()
  point(button.element, 'pointerup', 60)
  await button.trigger('click', { detail: 0 })
  expect(state.navigate).toHaveBeenCalledExactlyOnceWith(
    '/orders',
    state.tags.value[1],
  )
  await button.trigger('click', { detail: 1 })

  expect(state.move).not.toHaveBeenCalled()
  expect(state.navigate).toHaveBeenCalledTimes(1)
})

it.each(['pointercancel', 'disabled'])(
  'removes the drag preview when the drag is %s',
  async (reason) => {
    const { row, tags } = mockTagRects()
    const source = tags[0].element

    point(source, 'pointerdown', 10)
    point(tags[1].element, 'pointermove', 180)
    expect(dragPreview()).not.toBeNull()

    if (reason === 'pointercancel') point(source, 'pointercancel', 180)
    else {
      state.drag.value = false
      await nextTick()
    }

    expect(dragPreview()).toBeNull()
    expect(
      row.querySelector('[data-menu-tag-drop],[data-menu-tag-dragged]'),
    ).toBeNull()
    expect(state.move).not.toHaveBeenCalled()
  },
)

it.each([
  { hold: 100, claimed: false },
  { hold: 400, claimed: true },
])(
  'claims a horizontal touch after $hold ms: $claimed',
  ({ hold, claimed }) => {
    const button = wrapper.get<HTMLButtonElement>('.menu-tag__tab').element
    const start = new PointerEvent('pointerdown', {
      bubbles: true,
      isPrimary: true,
      pointerId: 2,
      pointerType: 'touch',
      buttons: 1,
      clientX: 10,
      clientY: 16,
    })
    const move = new TouchEvent('touchmove', {
      bubbles: true,
      cancelable: true,
      touches: [
        new Touch({ identifier: 2, target: button, clientX: 30, clientY: 16 }),
      ],
    })

    Object.defineProperty(move, 'timeStamp', { value: start.timeStamp + hold })
    button.dispatchEvent(start)
    button.dispatchEvent(move)

    expect(move.defaultPrevented).toBe(claimed)
    expect(wrapper.find('[data-menu-tag-dragged]').exists()).toBe(claimed)
    expect(Boolean(dragPreview())).toBe(claimed)
  },
)

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
