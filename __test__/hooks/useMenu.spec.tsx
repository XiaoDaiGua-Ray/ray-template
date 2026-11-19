import { useMenu } from '@ray-template/composables/useMenu'
import type { UseMenuOptions } from '@ray-template/composables/useMenu'
import { mount } from '@vue/test-utils'
import { NMenu } from 'naive-ui'
import { defineComponent, nextTick } from 'vue'

const daily = { key: 2, label: 'Daily' }
const options = [
  { key: 'home', label: 'Home' },
  { key: 1, label: 'Reports', children: [daily] },
]

const mountMenu = (initial: UseMenuOptions) => {
  const menu = useMenu(initial)
  const wrapper = mount(
    defineComponent({
      setup: () => () => <NMenu ref={menu.menuRef} {...menu.menuProps} />,
    }),
  )
  const select = (label: string) =>
    wrapper
      .findAll('.n-menu-item-content')
      .find((row) => row.text() === label)!
      .trigger('click')

  return { ...menu, wrapper, select }
}

it('updates controlled selection and expansion before notifying native callbacks', async () => {
  const onValue = vi.fn(() => menu.menuProps.value)
  const onExpanded = vi.fn(() => menu.menuProps.expandedKeys)
  const onExpandedAlias = vi.fn()
  const menu = mountMenu({
    options,
    value: 'home',
    expandedKeys: [],
    'onUpdate:value': onValue,
    onUpdateExpandedKeys: [onExpanded, onExpandedAlias],
  })

  try {
    menu.showOption(2)
    await nextTick()
    expect(onExpanded).toHaveBeenCalledExactlyOnceWith([1])
    expect(onExpanded).toHaveReturnedWith([1])
    expect(onExpandedAlias).toHaveBeenCalledExactlyOnceWith([1])
    expect(menu.menuProps.value).toBe('home')

    await menu.select('Daily')
    expect(onValue).toHaveBeenCalledExactlyOnceWith(2, daily)
    expect(onValue).toHaveReturnedWith(2)
    expect(menu.wrapper.get('.n-menu-item-content--selected').text()).toBe(
      'Daily',
    )
  } finally {
    menu.wrapper.unmount()
  }
})

it('keeps native defaults for independently uncontrolled props', async () => {
  const menu = mountMenu({
    options: [],
    defaultValue: 'home',
    defaultExpandAll: true,
    watchProps: ['defaultExpandedKeys'],
  })

  try {
    menu.menuProps.options = options
    await nextTick()
    expect(menu.wrapper.get('.n-menu-item-content--selected').text()).toBe(
      'Home',
    )
    expect(menu.wrapper.get('[aria-expanded="true"]').text()).toContain('Daily')

    await menu.select('Daily')
    expect(menu.wrapper.get('.n-menu-item-content--selected').text()).toBe(
      'Daily',
    )
    expect(menu.menuProps.value).toBeUndefined()
    expect(menu.menuProps.expandedKeys).toBeUndefined()
  } finally {
    menu.wrapper.unmount()
  }
})

it('delegates instance methods only while the menu is mounted', () => {
  const menu = useMenu()
  const instance = { showOption: vi.fn(), deriveResponsiveState: vi.fn() }

  menu.showOption()
  menu.deriveResponsiveState()
  menu.menuRef.value = instance
  menu.showOption()
  menu.deriveResponsiveState()
  menu.menuRef.value = null
  menu.showOption('home')
  menu.deriveResponsiveState()

  expect(instance.showOption).toHaveBeenCalledExactlyOnceWith(void 0)
  expect(instance.deriveResponsiveState).toHaveBeenCalledExactlyOnceWith()
})
