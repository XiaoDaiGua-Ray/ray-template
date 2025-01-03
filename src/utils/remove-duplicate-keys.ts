import { reduce } from 'lodash-es'

import type { Recordable } from '@/types'

/**
 *
 * @param targetObject target object
 *
 * @description
 * 移除对象中重复的键。
 * 以最后一次出现的键为准。
 *
 * @example
 * removeDuplicateKeys({ a: 1, b: 2, a: 3 }) // { a: 3, b: 2 }
 */
export const removeDuplicateKeys = <T extends Recordable>(targetObject: T) => {
  return reduce(
    Object.entries(targetObject).reverse(),
    (result, [key, value]) => {
      result[key as keyof T] = value

      return result
    },
    {} as T,
  )
}
