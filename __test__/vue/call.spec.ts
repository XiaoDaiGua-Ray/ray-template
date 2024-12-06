import { call } from '../../src/utils/vue/call'

describe('call', () => {
  it('should be executed once', () => {
    const fn = vi.fn()

    call(() => fn())

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should be executed with an argument', () => {
    const fn = vi.fn()

    call((a: number) => fn(a), 1)

    expect(fn).toHaveBeenCalledWith(1)
  })

  it('should be executed with multiple arguments', () => {
    const fn = vi.fn()

    call((a: number, b: number) => fn(a, b), 1, 2)

    expect(fn).toHaveBeenCalledWith(1, 2)
  })
})
