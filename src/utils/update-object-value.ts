import type { AnyFn, Recordable } from '@/types'
import { isPlainObject } from 'lodash-es'

/**
 *
 * @param targetObject 待更新对象
 * @param key 对象自身的属性键
 * @param value 新值
 * @param callback 写入成功后的回调
 *
 * @description
 * 仅更新自有属性。新旧值都是普通对象时浅合并，其余直接替换。
 */
export const updateObjectValue = <
  Target extends Recordable,
  Key extends keyof Target,
  Value extends Target[Key],
  Callback extends AnyFn = AnyFn,
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

  if (isPlainObject(value) && isPlainObject(targetObject[key])) {
    targetObject[key] = {
      ...targetObject[key],
      ...value,
    } as Target[Key]
  } else {
    targetObject[key] = value
  }

  callback?.()
}
