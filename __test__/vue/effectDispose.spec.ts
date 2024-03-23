import { effectDispose } from '../../src/utils/vue/effectDispose'

describe('effectDispose', () => {
  it('should return false if getCurrentScope is null', () => {
    expect(effectDispose(() => {})).toBe(false)
  })
})
