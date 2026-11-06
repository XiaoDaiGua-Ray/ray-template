import type { AnyFn, BasicTypes, ValidateValueType } from '../types'

/**
 *
 * @param value 待判断的值
 * @param type 要匹配的完整类型标签
 *
 * @description
 * 按 Object.prototype.toString 的标签判断。普通函数和异步函数都匹配 Function。
 */
export const isValueType = <T extends BasicTypes>(
  value: unknown,
  type: ValidateValueType,
): value is T => {
  const tag = Object.prototype.toString.call(value)

  return (
    tag === `[object ${type}]` ||
    (type === 'Function' && typeof value === 'function')
  )
}

/**
 *
 * @param length 生成的字符数
 * @param radix 从字符集开头可选的字符数，范围 1 到 62
 *
 * @description
 * 使用 Web Crypto 生成随机标识，字符集依次为数字、大写字母、小写字母。
 *
 * @throws 长度不是非负安全整数，或基数超出范围时抛出 RangeError。
 */
export const uuid = (length = 16, radix = 62) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

  if (
    !Number.isSafeInteger(length) ||
    length < 0 ||
    !Number.isInteger(radix) ||
    radix < 1 ||
    radix > chars.length
  ) {
    throw new RangeError('[uuid]: Invalid length or radix.')
  }

  const range = 2 ** 32
  const limit = range - (range % radix)
  // 小批量复用缓冲区，避免每个字符都跨越一次 Web Crypto 边界。
  const samples = new Uint32Array(Math.min(length, 128))
  let result = ''

  while (result.length < length) {
    crypto.getRandomValues(samples)

    for (const sample of samples) {
      // 丢弃无法均匀分配到字符集的样本。
      if (sample < limit) result += chars[sample % radix]

      if (result.length === length) break
    }
  }

  return result
}

/**
 *
 * @param func 待判断的值
 *
 * @returns 是否为 async 声明的函数；普通的 Promise 工厂函数返回 false。
 */
export const isAsyncFunction = (func: unknown) =>
  typeof func === 'function' &&
  Object.prototype.toString.call(func) === '[object AsyncFunction]'

/**
 *
 * @param value 待判断的值
 *
 * @returns 是否存在可调用的 then；async 函数本身不属于 PromiseLike。
 */
export const isPromise = <T>(value: unknown): value is PromiseLike<T> =>
  value !== null &&
  (typeof value === 'object' || typeof value === 'function') &&
  typeof (value as PromiseLike<T>).then === 'function'

/**
 *
 * @param fn 待执行的函数
 * @param errorCallback 同步抛错时执行的回调
 * @param args 调用参数，省略时不传参
 *
 * @returns 函数结果，或处理错误后的 undefined。
 *
 * @throws 错误回调自身抛出的异常会传给调用方。
 */
export const callWithErrorHandling = <T extends AnyFn, E extends Error>(
  fn: T,
  errorCallback: (error: E) => void,
  args?: Parameters<T>,
): ReturnType<T> | undefined => {
  try {
    return fn(...(args ?? []))
  } catch (error) {
    errorCallback(error as E)
  }
}

/**
 *
 * @param fn 待执行的函数
 * @param errorCallback 同步抛错或返回值拒绝时执行的回调
 * @param args 调用参数，省略时不传参
 *
 * @returns 等待后的结果，或处理错误后的 undefined。
 *
 * @throws 错误回调自身抛出时，返回的 Promise 会拒绝。
 */
export const callWithAsyncErrorHandling = async <
  T extends AnyFn,
  E extends Error,
>(
  fn: T,
  errorCallback: (error: E) => void,
  args?: Parameters<T>,
): Promise<Awaited<ReturnType<T>> | undefined> => {
  try {
    return await fn(...(args ?? []))
  } catch (error) {
    errorCallback(error as E)
  }
}
