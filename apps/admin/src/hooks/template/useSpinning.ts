import { useRuntimeActions } from '@/store'

/**
 *
 * @description
 * 操作共享内容区状态。reload(wait = 800) 会卸载页面，恢复计时器归 Store 所有，
 * 连续刷新以最后一次为准；手动加载与刷新互不持有对方的状态。
 *
 * @returns 页面刷新以及手动开启、关闭加载状态的方法。
 */
export const useSpinning = () => {
  const { reloadContent: reload, setRuntimeState } = useRuntimeActions()

  /**
   *
   * @description
   * 开启共享的手动加载状态；指示器的显示延迟由布局负责。
   */
  const openSpin = () => setRuntimeState('layoutContentSpinning', true)

  /**
   *
   * @description
   * 关闭手动加载状态，不取消由 reload 触发的页面重挂载。
   */
  const closeSpin = () => setRuntimeState('layoutContentSpinning', false)

  return { reload, openSpin, closeSpin }
}

export type UseSpinningReturnType = ReturnType<typeof useSpinning>
