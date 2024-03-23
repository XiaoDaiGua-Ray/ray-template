import { isAsyncFunction } from '../../src/utils/basic'

describe('isAsyncFunction', () => {
  it('should return true if the function is async', () => {
    const asyncFn = async () => {}

    expect(isAsyncFunction(asyncFn)).toBe(true)
  })

  it('should return false if the function is not async', () => {
    const syncFn = () => {}

    expect(isAsyncFunction(syncFn)).toBe(false)
  })

  it('should return false if the function is not a function', () => {
    const notFn = 'not a function'

    expect(isAsyncFunction(notFn)).toBe(false)
  })

  it('should return false if the function is a class', () => {
    class MyClass {}

    expect(isAsyncFunction(MyClass)).toBe(false)
  })

  it('should return false if the function is a Promise', () => {
    const promise = Promise.resolve('')

    expect(isAsyncFunction(promise)).toBe(false)
  })
})
