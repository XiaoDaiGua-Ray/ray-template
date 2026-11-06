import type LogicFlow from '@logicflow/core'
import { onScopeDispose } from 'vue'

/**
 *
 * @description
 * 通过 RFlow 的 onRegister 取得当前实例，实例生命周期由组件负责。
 *
 * @returns 注册函数与实例访问方法
 */
export const useFlow = () => {
  let flowInst: LogicFlow | undefined

  /**
   *
   * @param inst 当前挂载的 LogicFlow 实例
   *
   * @description
   * 注册当前 flow 实例，用于使用 useFlow hook。
   */
  const register = (inst: LogicFlow) => {
    if (inst) {
      flowInst = inst
      onScopeDispose(() => {
        if (flowInst === inst) flowInst = void 0
      }, true)
    }
  }

  /**
   *
   * @description
   * 获取当前 flow 实例。
   *
   * 如果未在调用前注册 onRegister 事件，则会抛出异常。
   *
   * @returns 当前 LogicFlow 实例
   * @throws 未注册或组件已卸载时抛错
   *
   * @example
   * const [register, { getFlowInstance }] = useFlow()
   *
   * const inst = getFlowInstance()
   */
  const getFlowInstance = () => {
    if (!flowInst) {
      throw new Error(
        '[useFlow]: flow instance is not ready yet. if you are using useFlow, please make sure you have called register method in onRegister event.',
      )
    }

    return flowInst
  }

  return [
    register,
    {
      getFlowInstance,
    },
  ] as const
}
