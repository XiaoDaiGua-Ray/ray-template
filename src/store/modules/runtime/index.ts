export interface RuntimeState {
  globalSpinning: boolean
  globalDrawerValue: boolean
  globalMainLayoutLoad: boolean
  layoutContentMaximize: boolean
  layoutContentSpinning: boolean
  layoutContentMaximizeStyle: {
    zIndex: number
    backgroundColor?: string
    transition?: string
  }
}

export const piniaRuntimeStore = defineStore('runtime', () => {
  const state = reactive<RuntimeState>({
    globalSpinning: false,
    globalDrawerValue: false,
    globalMainLayoutLoad: true,
    layoutContentMaximize: false,
    layoutContentSpinning: false,
    layoutContentMaximizeStyle: { zIndex: 999 },
  })
  let reloadTimer: ReturnType<typeof setTimeout> | undefined

  const setRuntimeState = <K extends keyof RuntimeState>(
    key: K,
    value: RuntimeState[K],
  ) => {
    state[key] = value
  }

  // 刷新会卸载发起调用的页面，计时器必须由 store 持有；重复刷新以最后一次为准。
  const reloadContent = (wait = 800) => {
    clearTimeout(reloadTimer)
    state.globalMainLayoutLoad = false
    reloadTimer = setTimeout(() => {
      state.globalMainLayoutLoad = true
      reloadTimer = void 0
    }, wait)
  }

  onScopeDispose(() => clearTimeout(reloadTimer))

  return { ...toRefs(state), setRuntimeState, reloadContent }
})
