import { isPromise } from '../../apps/admin/src/utils/basic'

describe('isPromise', () => {
  it('should return true if the value is a Promise', () => {
    const promise = Promise.resolve('')

    expect(isPromise(promise)).toBe(true)
  })

  it('should return false if the value is not a Promise', () => {
    const notPromise = 'not a Promise'

    expect(isPromise(notPromise)).toBe(false)
  })

  it('should return false if the value is a class', () => {
    class MyClass {}

    expect(isPromise(MyClass)).toBe(false)
  })

  it('should return false if the value is a function', () => {
    const fn = () => {}

    expect(isPromise(fn)).toBe(false)
  })

  it('should distinguishes an async function from its result', () => {
    const asyncFn = async () => {}

    expect(isPromise(asyncFn)).toBe(false)
    expect(isPromise(asyncFn())).toBe(true)
  })
})

it('recognizes thenables without accepting non-callable then properties', () => {
  expect(isPromise({ then: vi.fn() })).toBe(true)
  expect(isPromise({ then: true })).toBe(false)
  expect(isPromise(null)).toBe(false)
})
