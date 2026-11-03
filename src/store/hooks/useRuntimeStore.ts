import { piniaRuntimeStore } from '../modules/runtime'

// 临时 UI 状态不持久化；同一个 Pinia 实例共享，应用卸载后随 store 释放。
export const useRuntimeGetters = () => {
  const state = storeToRefs(piniaRuntimeStore())

  return {
    globalSpinning: readonly(state.globalSpinning),
    globalDrawerValue: readonly(state.globalDrawerValue),
    globalMainLayoutLoad: readonly(state.globalMainLayoutLoad),
    layoutContentMaximize: readonly(state.layoutContentMaximize),
    layoutContentMaximizeVersion: readonly(state.layoutContentMaximizeVersion),
    layoutContentSpinning: readonly(state.layoutContentSpinning),
    layoutContentMaximizeStyle: readonly(state.layoutContentMaximizeStyle),
  }
}

export const useRuntimeActions = () => {
  const { setRuntimeState, reloadContent } = piniaRuntimeStore()

  return { setRuntimeState, reloadContent }
}
