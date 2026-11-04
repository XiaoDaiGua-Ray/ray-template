import { renderNode } from '../../apps/admin/src/utils/vue/render-node'
import createRefElement from '../utils/createRefElement'

describe('renderNode', () => {
  it('should render string', () => {
    const wrapper = createRefElement({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      default: renderNode('hello world') as Function,
    })
    const text = wrapper.text()

    expect(text).toBe('hello world')
  })
})

it('renders numbers and empty text without falling back', () => {
  const fallback = h('span', 'fallback')

  expect(renderNode(0, { defaultElement: fallback })()).toBe(0)
  expect(renderNode('', { defaultElement: fallback })()).toBe('')
  expect(renderNode(42)()).toBe(42)
  expect(renderNode(null, { defaultElement: fallback })()).toBe(fallback)
})
