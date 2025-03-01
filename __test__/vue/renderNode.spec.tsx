import { renderNode } from '../../src/utils/vue/render-node'
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
