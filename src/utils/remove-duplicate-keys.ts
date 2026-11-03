import type { Recordable } from '@/types'

/**
 *
 * @param targetObject 已按 JavaScript 规则合并同名键的对象
 *
 * @returns 可枚举自有属性的浅拷贝，包含 Symbol 键。
 */
export const removeDuplicateKeys = <T extends Recordable>(
  targetObject: T,
): T => ({
  ...targetObject,
})
