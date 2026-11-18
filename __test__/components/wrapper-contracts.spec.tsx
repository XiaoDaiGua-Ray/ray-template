import { flushPromises, mount } from '@vue/test-utils'
import { NDropdown, NForm, NFormItem, NGrid, NSpin } from 'naive-ui'
import { defineComponent, h, nextTick, ref } from 'vue'
import { RCollapseGrid } from '../../packages/ui/src/RCollapseGrid'
import { RForm, useForm } from '../../packages/ui/src/RForm'
import { RIcon } from '../../packages/ui/src/RIcon'
import { RIframe } from '../../packages/ui/src/RIframe'
import type { RIframeInst } from '../../packages/ui/src/RIframe/src/types'
import { RMoreDropdown } from '../../packages/ui/src/RMoreDropdown'
import { RSegment } from '../../packages/ui/src/RSegment'

it('keeps controlled open state and zero grid gaps consistent', async () => {
  const open = ref(false)
  const wrapper = mount(
    defineComponent(() => () => (
      <RCollapseGrid
        open={open.value}
        onUpdateOpen={(value) => (open.value = value)}
        xGap={0}
        yGap={0}
      />
    )),
  )

  try {
    const button = wrapper.get('button.collapse-icon')

    expect(wrapper.findComponent(NGrid).props()).toMatchObject({
      xGap: 0,
      yGap: 0,
      collapsed: true,
    })
    expect(button.attributes('aria-expanded')).toBe('false')
    await button.trigger('click')
    expect(open.value).toBe(true)
    expect(wrapper.findComponent(NGrid).props('collapsed')).toBe(false)
    await button.trigger('click')
    expect(open.value).toBe(false)
  } finally {
    wrapper.unmount()
  }
})

it('forwards dropdown placement and renders segment label functions', () => {
  const dropdown = mount(RMoreDropdown, {
    props: { placement: 'top-end', triggerLabel: 'Row actions' },
  })
  const segment = mount(RSegment, {
    props: {
      options: [{ key: 'one', label: () => h('strong', 'Rendered label') }],
    },
  })

  try {
    expect(dropdown.findComponent(NDropdown).props('placement')).toBe('top-end')
    expect(dropdown.get('button').attributes('aria-label')).toBe('Row actions')
    expect(segment.get('strong').text()).toBe('Rendered label')
  } finally {
    dropdown.unmount()
    segment.unmount()
  }
})

it('preserves SVG root paint when no sprite service is installed', async () => {
  const wrapper = mount(RIcon, { props: { name: 'action/close_all' } })

  try {
    await vi.waitFor(() => expect(wrapper.find('svg rect').exists()).toBe(true))
    expect(wrapper.get('svg').attributes()).toMatchObject({
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.8',
    })
  } finally {
    wrapper.unmount()
  }
})

it('moves segment focus past disabled choices and emits each change once', async () => {
  const change = vi.fn()
  const wrapper = mount(RSegment, {
    attachTo: document.body,
    props: {
      options: [
        { key: 'a', label: 'A' },
        { key: 'b', label: 'B', disabled: true },
        { key: 'c', label: 'C' },
      ],
      onUpdateValue: change,
    },
  })

  try {
    const [a, b, c] = wrapper.findAll('[role="radio"]')

    expect(a.attributes('tabindex')).toBe('0')
    expect(b.attributes('aria-disabled')).toBe('true')
    await a.trigger('keydown', { key: 'ArrowRight' })
    expect(change.mock.calls).toEqual([['c']])
    expect(document.activeElement).toBe(c.element)
    expect(c.attributes('aria-checked')).toBe('true')
    await c.trigger('keydown', { key: 'Home' })
    expect(a.attributes('aria-checked')).toBe('true')
  } finally {
    wrapper.unmount()
  }
})

it('starts iframe loading for every source and exposes the same native element', async () => {
  const wrapper = mount(RIframe, { props: { src: '/one.html' } })

  try {
    await nextTick()
    const frame = wrapper.get('iframe')

    await frame.trigger('load')
    expect(wrapper.findComponent(NSpin).props('show')).toBe(false)
    await wrapper.setProps({ src: '/two.html' })
    expect(wrapper.findComponent(NSpin).props('show')).toBe(true)
    const instance = wrapper.vm as unknown as RIframeInst

    expect(instance.iframe).toBe(frame.element)
    expect(instance.iframeInst).toBe(frame.element)
    await frame.trigger('error')
    expect(wrapper.findComponent(NSpin).props('show')).toBe(false)
  } finally {
    wrapper.unmount()
  }
})

it('submits single-line Enter reactively without consuming IME, multiline, or combobox events', async () => {
  const onFinish = vi.fn()
  const wrapper = mount(RForm, {
    props: { submitWhenEnter: false, onFinish },
    slots: {
      default: () => [
        h('input'),
        h('textarea'),
        h('input', { role: 'combobox' }),
      ],
    },
  })

  try {
    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    expect(onFinish).not.toHaveBeenCalled()
    await wrapper.setProps({ submitWhenEnter: true })
    await wrapper.get('textarea').trigger('keydown', { key: 'Enter' })
    await wrapper.get('[role="combobox"]').trigger('keydown', { key: 'Enter' })
    await wrapper
      .get('input')
      .trigger('keydown', { key: 'Enter', isComposing: true })
    await flushPromises()
    expect(onFinish).not.toHaveBeenCalled()
    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    await flushPromises()
    expect(onFinish).toHaveBeenCalledOnce()
  } finally {
    wrapper.unmount()
  }
})

it('keeps validation failures handled and prevents repeated Enter submissions', async () => {
  const pending = Promise.withResolvers<void>()
  const onFinish = vi.fn(() => pending.promise)
  const wrapper = mount(RForm, {
    props: { submitWhenEnter: true, onFinish, model: { name: '' } },
    slots: {
      default: () =>
        h(
          NFormItem,
          { path: 'name', rule: { required: true, message: 'Required' } },
          () => h('input'),
        ),
    },
  })

  try {
    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    await flushPromises()
    expect(onFinish).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Required')
    await wrapper.setProps({ model: { name: 'Ready' } })
    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    await flushPromises()
    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    await flushPromises()
    expect(onFinish).toHaveBeenCalledOnce()
    pending.resolve()
    await flushPromises()
    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    await flushPromises()
    expect(onFinish).toHaveBeenCalledTimes(2)
  } finally {
    wrapper.unmount()
  }
})

it('clears registered form instances when their component unmounts', async () => {
  const [register, actions] = useForm({ name: 'Initial', enabled: false })
  const wrapper = mount(RForm, { props: { onRegister: register } })

  expect(actions.getFormInstance().validate).toBe(
    wrapper.findComponent(NForm).vm.validate,
  )
  actions.updateFormCondition({ name: 'Updated' })
  expect(actions.formConditionRef.value).toEqual({
    name: 'Updated',
    enabled: false,
  })
  actions.reset({ enabled: true })
  expect(actions.formConditionRef.value).toEqual({
    name: 'Initial',
    enabled: true,
  })
  wrapper.unmount()
  await nextTick()
  expect(() => actions.getFormInstance()).toThrow('form instance is not ready')
})

it('allows forwarded key handlers to consume Enter before automatic submission', async () => {
  const onFinish = vi.fn()
  const onKeydown = vi.fn((event: KeyboardEvent) => event.preventDefault())
  const wrapper = mount(RForm, {
    props: { submitWhenEnter: true, onFinish },
    attrs: { onKeydown },
    slots: { default: () => h('input') },
  })

  try {
    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    await flushPromises()
    expect(onKeydown).toHaveBeenCalledOnce()
    expect(onFinish).not.toHaveBeenCalled()
  } finally {
    wrapper.unmount()
  }
})

it('does not submit after its component unmounts during asynchronous validation', async () => {
  const validation = Promise.withResolvers<void>()
  const onFinish = vi.fn()
  const wrapper = mount(RForm, {
    props: { submitWhenEnter: true, onFinish, model: { name: 'Ready' } },
    slots: {
      default: () =>
        h(
          NFormItem,
          { path: 'name', rule: { validator: () => validation.promise } },
          () => h('input'),
        ),
    },
  })

  await wrapper.get('input').trigger('keydown', { key: 'Enter' })
  wrapper.unmount()
  validation.resolve()
  await flushPromises()
  expect(onFinish).not.toHaveBeenCalled()
})
