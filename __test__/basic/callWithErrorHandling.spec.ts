import { callWithErrorHandling } from '../../src/utils/basic'

describe('callWithErrorHandling', () => {
  it('should call the function and return the result', () => {
    const fn = (x: number) => x

    const callbackFn = () => {}

    expect(callWithErrorHandling(fn, callbackFn, [1])).toBe(1)
  })

  it('should call the callback function when the function throws an error', () => {
    let callbackFnExecuted = 1

    const fn = () => {
      throw new Error('test error')
    }

    const callbackFn = () => {
      callbackFnExecuted = 2
    }

    callWithErrorHandling(fn, callbackFn)

    expect(callbackFnExecuted).toBe(2)
  })
})
