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

import type {
  MaybeComputedElementRef,
  UnRefElementReturn,
  VueInstance,
} from '@/types/modules/vue'
import type { MaybeElement } from '@/types/modules/element'

export function unrefElement<T extends MaybeElement>(
  elRef: MaybeComputedElementRef<T>,
): UnRefElementReturn<T> {
  const plain = toValue(elRef)

  return (plain as VueInstance)?.$el ?? plain
}
