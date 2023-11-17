/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-09-11
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 存放全局临时变量，脱离 pinia 使用的变量
 * 简单的全局变量，并不需要复杂的控制流程
 *
 * 使用方法
 * @example
 *
 * 获取普通变量
 * getVariable('target key', 'default value')
 *
 * 获取响应式变量
 * getVariableToRefs('target key')
 *
 * 更改 state 变量
 * setVariable('key', 'value')
 */

import type { AnyFC } from '@/types/modules/utils'

const variableState = reactive({
  globalSpinning: false, // 全局加载控制器
  globalDrawerValue: false, // 全局抽屉控制器（小尺寸设备可用）
  globalMainLayoutLoad: true, // LayoutContent 区域加载控制器
  layoutContentMaximize: false, // LayoutContent 区域全屏控制器
})

export type VariableState = typeof variableState

export type VariableStateKey = keyof VariableState

export function setVariable<T extends VariableStateKey, FC extends AnyFC>(
  key: T,
  value: VariableState[T],
  cb?: FC,
) {
  variableState[key] = value

  cb?.()
}

export function getVariable<T extends VariableStateKey>(
  key: VariableStateKey,
  defaultValue?: VariableState[T],
) {
  const v = variableState[key]

  return v ? readonly(variableState)[key] : defaultValue
}

export function getVariableToRefs<K extends VariableStateKey>(key: K) {
  return readonly(toRef<VariableState, K>(variableState, key))
}
