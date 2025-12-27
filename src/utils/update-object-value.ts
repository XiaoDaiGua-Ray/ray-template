import type { AnyFn, Recordable } from '@/types'
import { isValueType } from '@/utils'

/**
 *
 * @param targetObject 目标对象值
 * @param key 目标 key
 * @param value 待修改值
 * @param callback 修改完成后的回调，只有修改成功才会触发
 *
 * @description
 * 所以这是一个的更新对象值的方法。
 * 仅允许修改目标对象本身的属性值，不允许修改对象中嵌套的对象属性值与原型连上的值。
 * 如果更新未成功，不会触发 callback 回调方法。
 *
 * @example
 * const obj = { a: 1, b: 2, c: { d: 3 } }
 * updateObjectValue(obj, 'a', 2) // success
 * updateObjectValue(obj, 'b', 3) // success
 * updateObjectValue(obj, 'c', { d: 4 }) // success
 * updateObjectValue(obj, 'd', 5) // reject
 */
export const updateObjectValue = <
  Target extends Recordable,
  Key extends keyof Target,
  Value extends Target[Key], // 移除 Partial，使类型更准确
  Callback extends AnyFn = AnyFn, // 添加默认类型
>(
  targetObject: Target,
  key: Key,
  value: Value,
  callback?: Callback,
): void => {
  if (!targetObject || typeof targetObject !== 'object') {
    console.warn(
      `[updateObjectValue]: targetObject must be an object, received ${typeof targetObject}`,
    )

    return
  }

  if (!Object.hasOwn(targetObject, key)) {
    return
  }

  if (isValueType<object>(value, 'Object')) {
    targetObject[key] = {
      ...targetObject[key],
      ...value,
    } as Target[Key]
  } else {
    targetObject[key] = value
  }

  callback?.()
}
