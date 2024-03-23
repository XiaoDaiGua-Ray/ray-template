import { isPromise } from '../../src/utils/basic'

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

  it('should return true if the value is an async function', () => {
    const asyncFn = async () => {}

    expect(isPromise(asyncFn)).toBe(true)
  })
})
