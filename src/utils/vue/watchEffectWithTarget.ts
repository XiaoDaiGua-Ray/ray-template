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

import { effectDispose } from './effectDispose'

import type { WatchOptionsBase } from 'vue'
import type { AnyFC } from '@/types'

/**
 *
 * @param fc 副作用函数
 * @param watchOptions watchEffect 配置项
 *
 * 该方法使用 watchEffect 实现副作用函数的执行
 * 并且能够在 effect 作用域卸载时，自动停止监听
 *
 * @example
 * const ref = ref(0)
 * const watcher = watch(()=> ref.value, (newVal, oldVal) => {})
 *
 * watchEffectWithTarget(watcher)
 */
export function watchEffectWithTarget<T extends AnyFC>(
  fc: T,
  watchOptions?: WatchOptionsBase,
) {
  const stop = watchEffect(fc, watchOptions)

  effectDispose(stop)
}
