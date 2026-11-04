import { toValue } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { BasicTarget, TargetType } from '../types'

/**
 *
 * @param target 元素、组件实例、引用或 getter
 * @param defaultElement 目标为空时的回退值
 *
 * @returns 解包后的值；组件实例返回其根节点。
 */
function unrefElement<T extends TargetType>(
  target: BasicTarget<T>,
  defaultElement?: T,
) {
  const value = toValue(target)
  const element = (value as ComponentPublicInstance | null | undefined)?.$el as
    T | undefined

  return element ?? value ?? defaultElement
}

export { unrefElement }
