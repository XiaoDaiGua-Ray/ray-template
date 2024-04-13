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
 * @description
 * 存放全局响应式变量，脱离 pinia 使用的变量。
 * 简单的全局变量，并不需要复杂的控制流程。
 *
 * @example
 * 获取响应式变量
 * getVariableToRefs('target key')
 *
 * 更改 state 变量
 * setVariable('key', 'value')
 *
 * 创建响应式说仓库
 * createVariableState({ your state })
 */

import type { AnyFC } from '@/types'

/**
 *
 * @description
 * 全局响应式变量。
 *
 * 不推荐直接访问、设置该 state不建议在组件中直接使用该 state，
 * 请使用 `getVariable`、`getVariableToRefs`、`setVariable` 方法进行操作。
 */
const variableState = reactive({
  globalSpinning: false, // 全局加载控制器
  globalDrawerValue: false, // 全局抽屉控制器（小尺寸设备可用）
  globalMainLayoutLoad: true, // LayoutContent 区域加载控制器，会触发强制刷新
  layoutContentMaximize: false, // LayoutContent 区域全屏控制器
  layoutContentSpinning: false, // LayoutContent 区域加载控制器，不会触发强制刷新
})

export type VariableState = typeof variableState
export type VariableStateKey = keyof VariableState

type ReadonlyVariableState<T> = {
  [K in keyof T & string]: Readonly<Ref<T[K]>>
}

/**
 *
 * @param key variable key
 * @param value variable value
 * @param cb 设置完成后的回调函数
 *
 * 手动设置 variableState 的值
 *
 * @example
 * setVariable('globalSpinning', true) // 设置全局加载状态为 true
 * setVariable('globalSpinning', true, () => {}) // 设置全局加载状态为 true，并且在设置完成后执行回调函数
 */
export function setVariable<T extends VariableStateKey, FC extends AnyFC>(
  key: T,
  value: VariableState[T],
  cb?: FC,
) {
  if (Object.hasOwn(variableState, key)) {
    variableState[key] = value

    cb?.()
  }
}

/**
 *
 * @param key 目标值 key
 *
 * 返回目标值的响应式 ref
 *
 * @example
 * getVariableToRefs('globalSpinning') // 返回 Ref<boolean>
 */
export function getVariableToRefs<K extends VariableStateKey>(key: K) {
  return readonly(toRef<VariableState, K>(variableState, key))
}

/**
 *
 * @description
 * 允许解构获取 variable 属性。并且返回一个只读的 ref。
 *
 * 该方法为了解决 getVariableToRefs 方法的解构问题，如果需要在一个地方获取很多 variable 属性，可以使用该方法。
 *
 * @example
 * const { globalMainLayoutLoad } = getVariable()
 */
export function getVariable(): ReadonlyVariableState<typeof variableState> {
  return {
    ...toRefs(readonly(variableState)),
  }
}
