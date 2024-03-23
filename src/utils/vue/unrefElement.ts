/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-10-03
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import type { BasicTarget, TargetType, TargetValue } from '@/types'
import type { ComponentPublicInstance } from 'vue'

/**
 *
 * @param target 获取 ref dom, vue instance 的 dom
 * @param defaultTarget 默认值
 *
 * @example
 * <template>
 *  <div ref="refDom"></div>
 * </template>
 *
 * const refDom = ref<HTMLElement | null>(null)
 * const computedDom = computed(() => refDom.value)
 *
 * unrefElement(refDom) // div
 * unrefElement(computedDom) // div
 */
function unrefElement<T extends TargetType>(
  target: BasicTarget<T>,
  defaultElement?: T,
) {
  if (!target) {
    return defaultElement
  }

  let targetElement: TargetValue<T>

  if (typeof target === 'function') {
    targetElement = target()
  } else if (isRef(target)) {
    targetElement =
      (target.value as ComponentPublicInstance)?.$el ?? target.value
  } else {
    targetElement = target
  }

  return targetElement
}

export { unrefElement }
