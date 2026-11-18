import { useMenuKeyboard } from '@ray-template/admin-shell'
import { flushPromises, mount } from '@vue/test-utils'
import { NMenu } from 'naive-ui'
import { defineComponent, h } from 'vue'

const options = [
  {
    key: 'group',
    label: 'Group',
    children: [
      { key: 'a', label: 'Alpha' },
      { key: 'b', label: 'Beta' },
    ],
  },
  { key: 'c', label: 'Gamma' },
]

const mountMenu = (horizontal = false, collapsed = false) => {
  const selected = vi.fn()
  const wrapper = mount(
    defineComponent({
      setup() {
        const keyboard = useMenuKeyboard(horizontal, () => collapsed)

        return () =>
          h('nav', { onKeydown: keyboard.onKeydown }, [
            h(NMenu, {
              options,
              collapsed,
              mode: horizontal ? 'horizontal' : 'vertical',
              nodeProps: keyboard.nodeProps,
              dropdownProps: keyboard.dropdownProps,
              onUpdateValue: selected,
            }),
          ])
      },
    }),
    { attachTo: document.body },
  )

  return { wrapper, selected }
}

it('opens an inline group, moves focus to its child, and selects it from the keyboard', async () => {
  const { wrapper, selected } = mountMenu()

  try {
    const group = wrapper.get('[role="menuitem"]')

    expect(group.attributes('tabindex')).toBe('0')
    await group.trigger('keydown', { key: 'Enter' })
    const items = wrapper.findAll('[role="menuitem"]')

    expect(items.map((item) => item.text())).toEqual([
      'Group',
      'Alpha',
      'Beta',
      'Gamma',
    ])
    await group.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(items[1]!.element)
    await items[1]!.trigger('keydown', { key: ' ' })
    expect(selected.mock.calls[0]?.[0]).toBe('a')
  } finally {
    wrapper.unmount()
  }
})

it.each([
  [true, false],
  [false, true],
])(
  'selects from a keyboard-opened popup (horizontal=%s, collapsed=%s)',
  async (horizontal, collapsed) => {
    const { wrapper, selected } = mountMenu(horizontal, collapsed)

    try {
      const group = wrapper.get('[role="menuitem"]')

      await group.trigger('keydown', { key: 'Enter' })
      await flushPromises()
      expect(document.querySelector('.n-dropdown-menu')).not.toBeNull()

      for (const key of ['ArrowDown', 'Enter']) {
        await group.trigger('keydown', { key })
      }

      expect(selected.mock.calls[0]?.[0]).toBe('a')
    } finally {
      wrapper.unmount()
    }
  },
)
