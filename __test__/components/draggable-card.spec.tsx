import { flushPromises, mount } from '@vue/test-utils'
import interact from 'interactjs'
import RDraggableCard from '../../packages/ui/src/RDraggableCard/DraggableCard'

const mocks = vi.hoisted(() => ({
  instances: [] as Array<{
    draggable: ReturnType<typeof vi.fn>
    resizable: ReturnType<typeof vi.fn>
    unset: ReturnType<typeof vi.fn>
  }>,
}))

vi.mock('interactjs', () => ({
  default: Object.assign(
    vi.fn(() => {
      const instance = {
        draggable: vi.fn().mockReturnThis(),
        resizable: vi.fn().mockReturnThis(),
        unset: vi.fn(),
      }

      mocks.instances.push(instance)

      return instance
    }),
    { modifiers: { restrictRect: vi.fn((value) => value) } },
  ),
}))

beforeEach(() => {
  mocks.instances.length = 0
  vi.mocked(interact).mockClear()
})

it('releases drag listeners on disable/unmount and removes only the final shared container', async () => {
  const first = mount(RDraggableCard, { props: { title: 'First' } })
  const second = mount(RDraggableCard, { props: { title: 'Second' } })

  await flushPromises()
  expect(interact).toHaveBeenCalledTimes(2)
  await first.setProps({ dad: false })
  expect(mocks.instances[0].unset).toHaveBeenCalledOnce()
  await first.setProps({ dad: true })
  expect(interact).toHaveBeenCalledTimes(3)
  first.unmount()
  expect(mocks.instances[2].unset).toHaveBeenCalledOnce()
  expect(document.getElementById('r-draggable-card-container')).not.toBeNull()
  second.unmount()
  expect(mocks.instances[1].unset).toHaveBeenCalledOnce()
  expect(document.getElementById('r-draggable-card-container')).toBeNull()
})

it('repositions and rebinds after boundary changes without keeping the previous interaction', async () => {
  const wrapper = mount(RDraggableCard, { props: { title: 'Test' } })

  try {
    await flushPromises()
    await wrapper.setProps({ defaultPosition: { x: 24, y: 36 } })
    expect(mocks.instances[0].unset).toHaveBeenCalledOnce()
    expect(
      document.querySelector<HTMLElement>('.r-draggable-card')?.style.transform,
    ).toBe('translate(24px, 36px)')
  } finally {
    wrapper.unmount()
  }
})
