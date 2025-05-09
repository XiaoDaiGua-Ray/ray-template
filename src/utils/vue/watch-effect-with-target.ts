import { effectDispose } from './effect-dispose'

import type { WatchOptionsBase } from 'vue'
import type { AnyFC } from '@/types'

/**
 *
 * @param fn 副作用函数
 * @param watchOptions watchEffect 配置项
 *
 * @description
 * 该方法使用 watchEffect 实现副作用函数的执行，
 * 并且能够在 effect 作用域卸载时，自动停止监听。
 *
 * @example
 * const ref = ref(0)
 * const watcher = watch(()=> ref.value, (newVal, oldVal) => {})
 *
 * watchEffectWithTarget(watcher)
 */
export function watchEffectWithTarget<T extends AnyFC>(
  fn: T,
  watchOptions?: WatchOptionsBase,
) {
  const stop = watchEffect(fn, watchOptions)

  effectDispose(stop)
}
