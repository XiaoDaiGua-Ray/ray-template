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
 * 但不建议滥用
 */

/** 全局响应式变量 */
const variableState = reactive({
  globalSpinning: false,
  globalDrawerValue: false,
})

type VariableStateKey = keyof typeof variableState

export function setVariable(
  key: VariableStateKey,
  value: (typeof variableState)[VariableStateKey],
) {
  variableState[key] = value
}

export function getVariable(key: VariableStateKey) {
  return variableState[key] as (typeof variableState)[VariableStateKey]
}

export function globalVariableToRefs<K extends VariableStateKey>(key: K) {
  return toRef<typeof variableState, K>(variableState, key)
}
