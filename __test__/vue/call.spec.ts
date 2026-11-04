import { call } from '../../apps/admin/src/utils/vue/call'

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

it('forwards variadic arguments in order and stops when a callback throws', () => {
  const first = vi.fn(
    (_a: number, _b: string, _c: boolean, _d: null, _e: number) => {},
  )
  const error = new Error('stop')
  const last = vi.fn()

  expect(() =>
    call(
      [
        first,
        () => {
          throw error
        },
        last,
      ],
      1,
      'a',
      false,
      null,
      2,
    ),
  ).toThrow(error)
  expect(first).toHaveBeenCalledExactlyOnceWith(1, 'a', false, null, 2)
  expect(last).not.toHaveBeenCalled()
})
