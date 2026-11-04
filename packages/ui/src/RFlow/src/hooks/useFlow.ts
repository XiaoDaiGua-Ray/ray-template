import type LogicFlow from '@logicflow/core'

export const useFlow = () => {
  let flowInst: LogicFlow

  /**
   *
   * @param inst flow instance
   *
   * @description
   * 注册当前 flow 实例，用于使用 useFlow hook。
   */
  const register = (inst: LogicFlow) => {
    if (inst) {
      flowInst = inst
    }
  }

  /**
   *
   * @description
   * 获取当前 flow 实例。
   *
   * 如果未在调用前注册 onRegister 事件，则会抛出异常。
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
