/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-11-10
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { scopeDispose } from './scopeDispose'

import type { WatchOptionsBase } from 'vue'
import type { AnyFC } from '@/types/modules/utils'

/**
 *
 * @param fc 副作用函数
 * @param watchOptions watchEffect 配置项
 *
 * 该方法使用 watchEffect 实现副作用函数的执行
 * 并且能够在 effect 作用域卸载时，自动停止监听
 */
export function watchEffectWithTarget(
  fc: AnyFC,
  watchOptions?: WatchOptionsBase,
) {
  const stop = watchEffect(fc, watchOptions)

  scopeDispose(stop)
}
