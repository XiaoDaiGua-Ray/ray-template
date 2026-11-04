import { watchEffect } from 'vue'
import type { WatchEffect, WatchOptionsBase } from 'vue'

/**
 *
 * @param fn 响应式副作用，可注册清理函数
 * @param watchOptions Vue 监听配置
 *
 * @returns 停止句柄；在作用域内创建时也会随作用域停止。
 */
export const watchEffectWithTarget = (
  fn: WatchEffect,
  watchOptions?: WatchOptionsBase,
) => watchEffect(fn, watchOptions)
