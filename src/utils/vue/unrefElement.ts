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

import type { BasicTarget, TargetType, TargetValue } from '@/types/modules/vue'
import type { ComponentPublicInstance } from 'vue'

export function unrefElement<T extends TargetType>(
  target: BasicTarget<T>,
  defaultTarget?: T,
) {
  if (!target) {
    return defaultTarget
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
