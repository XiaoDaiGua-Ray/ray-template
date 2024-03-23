import { renderNode } from '../../src/utils/vue/renderNode'
import createRefElement from '../utils/createRefElement'

describe('renderNode', () => {
  it('should render string', () => {
    const wrapper = createRefElement({
      default: renderNode('hello world') as Function,
    })
    const text = wrapper.text()

    expect(text).toBe('hello world')
  })
})
