import LogicFlow from '@logicflow/core'
import { flushPromises, mount } from '@vue/test-utils'
import { RFlow, useFlow } from '../../packages/ui/src/RFlow'
import flowProps from '../../packages/ui/src/RFlow/src/props'

const mocks = vi.hoisted(() => ({
  instances: [] as Array<{
    render: ReturnType<typeof vi.fn>
    renderRawData: ReturnType<typeof vi.fn>
    destroy: ReturnType<typeof vi.fn>
    updateEditConfig: ReturnType<typeof vi.fn>
    keyboard: { disabled: boolean; disable: ReturnType<typeof vi.fn> }
  }>,
}))

vi.mock('@logicflow/core', () => {
  class FakeFlow {
    static use = vi.fn()
    render = vi.fn()
    renderRawData = vi.fn()
    destroy = vi.fn()
    updateEditConfig = vi.fn()
    keyboard = { disabled: true, disable: vi.fn() }
    getEditConfig = () => ({
      isSilentMode: false,
      textEdit: false,
      adjustNodePosition: false,
    })
    constructor() {
      mocks.instances.push(this)
    }
  }

  return { default: FakeFlow }
})

beforeEach(() => {
  mocks.instances.length = 0
  vi.mocked(LogicFlow.use).mockClear()
})

it('registers later plugin sets, renders initial data, and releases each instance', async () => {
  const [register, actions] = useFlow()
  const data = { nodes: [{ id: 'start' }], edges: [] }
  const plugin = { pluginName: 'later-plugin', install: vi.fn() }
  const first = mount(RFlow)
  const second = mount(RFlow, {
    props: { data, use: [plugin], onRegister: register },
  })

  expect(LogicFlow.use).toHaveBeenCalledWith(plugin)
  expect(mocks.instances[1].render).toHaveBeenCalledWith(data)
  expect(actions.getFlowInstance()).toBe(mocks.instances[1])
  await second.setProps({ data: void 0 })
  expect(mocks.instances[1].renderRawData).toHaveBeenLastCalledWith({
    nodes: [],
    edges: [],
  })
  first.unmount()
  second.unmount()
  await flushPromises()
  expect(
    mocks.instances.every(
      (instance) => instance.destroy.mock.calls.length === 1,
    ),
  ).toBe(true)
  expect(() => actions.getFlowInstance()).toThrow('flow instance is not ready')
})

it('restores configured editing and keyboard behavior after readonly mode', async () => {
  const wrapper = mount(RFlow)
  const instance = mocks.instances[0]

  try {
    expect(instance.updateEditConfig).not.toHaveBeenCalled()
    await wrapper.setProps({ readonly: true })
    expect(instance.updateEditConfig).toHaveBeenLastCalledWith({
      isSilentMode: true,
    })
    await wrapper.setProps({ readonly: false })
    expect(instance.updateEditConfig).toHaveBeenLastCalledWith({
      isSilentMode: false,
      textEdit: false,
      adjustNodePosition: false,
    })
    expect(instance.keyboard.disable).toHaveBeenCalledOnce()
  } finally {
    wrapper.unmount()
  }
})

it('creates independent nested default options for every instance', () => {
  const first = flowProps.options.default()
  const second = flowProps.options.default()

  expect(first).not.toBe(second)
  expect(first.keyboard).not.toBe(second.keyboard)
})
