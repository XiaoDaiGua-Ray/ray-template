import type { AnyFn } from '@/types'
import { getCurrentScope, onScopeDispose } from 'vue'

/**
 *
 * @param fn effect 作用域卸载时需执行函数
 *
 * @description
 * 返回 true 表示获取到 effect 作用域并且卸载；false 表示未存在 effect 作用域。
 *
 * @example
 * const watchStop = watch(() => {}, () => {})
 * const watchEffectStop = watchEffect(() => {})
 *
 * effectDispose(watchStop)
 * effectDispose(watchEffectStop)
 */
export function effectDispose<T extends AnyFn>(fn: T) {
  if (getCurrentScope()) {
    onScopeDispose(fn)

    return true
  }

  return false
}
