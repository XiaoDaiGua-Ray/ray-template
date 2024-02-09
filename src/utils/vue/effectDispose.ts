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

import { getCurrentScope, onScopeDispose } from 'vue'

import type { AnyFC } from '@/types'

/**
 *
 * @param fc effect 作用域卸载时需执行函数
 *
 * @description
 * 返回 true 表示获取到 effect 作用域并且卸载；false 表示未存在 effect 作用域
 *
 * @example
 * const watchStop = watch(() => {}, () => {})
 * const watchEffectStop = watchEffect(() => {})
 *
 * effectDispose(watchStop)
 * effectDispose(watchEffectStop)
 */
export function effectDispose<T extends AnyFC>(fc: T) {
  if (getCurrentScope()) {
    onScopeDispose(fc)

    return true
  }

  return false
}
