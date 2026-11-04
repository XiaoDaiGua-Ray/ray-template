import { effectDispose } from '../../apps/admin/src/utils/vue/effect-dispose'

describe('effectDispose', () => {
  it('should return false if getCurrentScope is null', () => {
    expect(effectDispose(() => {})).toBe(false)
  })
})
