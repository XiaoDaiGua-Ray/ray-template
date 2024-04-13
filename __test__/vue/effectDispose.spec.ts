import { effectDispose } from '../../src/utils/vue/effect-dispose'

describe('effectDispose', () => {
  it('should return false if getCurrentScope is null', () => {
    expect(effectDispose(() => {})).toBe(false)
  })
})
