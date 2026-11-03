import { mount } from '@vue/test-utils'
import { effectScope, h, nextTick, ref } from 'vue'
import { unrefElement } from '../../src/utils/vue/unref-element'
import { watchEffectWithTarget } from '../../src/utils/vue/watch-effect-with-target'

it('unwraps elements and component roots consistently across refs and getters', () => {
  const div = document.createElement('div')
  const fallback = document.createElement('main')
  const wrapper = mount({ render: () => h('section') })

  try {
    expect(unrefElement(div)).toBe(div)
    expect(unrefElement(() => div)).toBe(div)
    expect(unrefElement(ref(div))).toBe(div)
    expect(unrefElement(null, fallback)).toBe(fallback)
    expect(unrefElement(ref(null), fallback)).toBe(fallback)
    expect(unrefElement(() => null, fallback)).toBe(fallback)
    expect(unrefElement(wrapper.vm)).toBe(wrapper.element)
    expect(unrefElement(() => wrapper.vm)).toBe(wrapper.element)
    expect(unrefElement(ref(wrapper.vm))).toBe(wrapper.element)
  } finally {
    wrapper.unmount()
  }
})

it('returns a stop handle and cleans up a watch on both explicit stop and scope disposal', async () => {
  const value = ref(1)
  const effect = vi.fn()
  const cleanup = vi.fn()
  const scope = effectScope()
  const run = () =>
    watchEffectWithTarget((onCleanup) => {
      effect(value.value)
      onCleanup(cleanup)
    })

  const stop = run()

  expect(effect).toHaveBeenLastCalledWith(1)
  stop()
  expect(cleanup).toHaveBeenCalledTimes(1)
  const scoped = scope.run(run)

  expect(scoped).toBeTypeOf('function')
  value.value = 2
  await nextTick()
  expect(effect).toHaveBeenLastCalledWith(2)
  scope.stop()
  value.value = 3
  await nextTick()
  expect(effect.mock.calls).toEqual([[1], [1], [2]])
  expect(cleanup).toHaveBeenCalledTimes(3)
})
