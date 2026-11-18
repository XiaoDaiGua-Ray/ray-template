import { mount } from '@vue/test-utils'
import { defineComponent, h, ref, withDirectives } from 'vue'
import disabled from '../../packages/directives/src/modules/disabled'

it('restores a native button and toggles the whole form without changing its children', async () => {
  const value = ref(false)
  const directive = disabled()
  const wrapper = mount(
    defineComponent(
      () => () =>
        h('div', [
          withDirectives(h('button'), [[directive, value.value]]),
          withDirectives(h('form', [h('input', { disabled: true })]), [
            [directive, value.value],
          ]),
        ]),
    ),
  )

  try {
    const button = wrapper.get('button').element
    const form = wrapper.get('form').element

    expect(button.disabled).toBe(false)
    value.value = true
    await wrapper.vm.$nextTick()
    expect(button.disabled).toBe(true)
    expect(form.hasAttribute('inert')).toBe(true)
    value.value = false
    await wrapper.vm.$nextTick()
    expect(button.disabled).toBe(false)
    expect(form.hasAttribute('inert')).toBe(false)
    expect(wrapper.get('input').element.disabled).toBe(true)
  } finally {
    wrapper.unmount()
  }
})
