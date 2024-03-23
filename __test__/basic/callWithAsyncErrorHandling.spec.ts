import { callWithAsyncErrorHandling } from '../../src/utils/basic'

describe('callWithAsyncErrorHandling', () => {
  it('should call the function and return the result', () => {
    const fn = (x: number) => x
    const callbackFn = () => {}

    expect(callWithAsyncErrorHandling(fn, callbackFn, [1])).resolves.toBe(1)
  })

  it('should call the callback function when the function throws an error', () => {
    let callbackFnExecuted = 1

    const fn = () => {
      throw new Error('test error')
    }
    const callbackFn = () => {
      callbackFnExecuted = 2
    }

    callWithAsyncErrorHandling(fn, callbackFn)

    expect(callbackFnExecuted).toBe(2)
  })
})
