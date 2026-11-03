import { callWithAsyncErrorHandling } from '../../src/utils/basic'

describe('callWithAsyncErrorHandling', () => {
  it('should call the function and return the result', async () => {
    const fn = (x: number) => x

    const callbackFn = () => {}

    await expect(callWithAsyncErrorHandling(fn, callbackFn, [1])).resolves.toBe(
      1,
    )
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

it('handles Promise rejections from both async functions and regular factories', async () => {
  const rejected = new Error('rejected')
  const callback = vi.fn()
  const asyncFn = async () => {
    throw rejected
  }
  const factory = () => Promise.reject(rejected)

  await expect(
    callWithAsyncErrorHandling(asyncFn, callback),
  ).resolves.toBeUndefined()
  await expect(
    callWithAsyncErrorHandling(factory, callback),
  ).resolves.toBeUndefined()
  expect(callback.mock.calls).toEqual([[rejected], [rejected]])
  await expect(
    callWithAsyncErrorHandling(async () => 42, callback),
  ).resolves.toBe(42)
})

it('does not invoke the error callback again when the callback throws', async () => {
  const failure = new Error('callback failed')
  const callback = vi.fn(() => {
    throw failure
  })

  await expect(
    callWithAsyncErrorHandling(() => {
      throw new Error('original error')
    }, callback),
  ).rejects.toBe(failure)
  expect(callback).toHaveBeenCalledTimes(1)
})
