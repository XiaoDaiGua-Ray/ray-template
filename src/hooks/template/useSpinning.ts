import { setVariable } from '@/global-variable'

export const useSpinning = () => {
  /**
   *
   * @param wait 延迟时长
   *
   * 刷新当前路由（强制触发刷新）
   *
   * @example
   * reload(1200)
   */
  const reload = (wait = 800) => {
    setVariable('globalMainLayoutLoad', false)

    setTimeout(() => setVariable('globalMainLayoutLoad', true), wait)
  }

  /**
   *
   * 打开加载动画（不触发强制刷新）
   *
   * @example
   * openSpin()
   */
  const openSpin = () => {
    setVariable('layoutContentSpinning', true)
  }

  /**
   *
   * 关闭加载动画（不触发强制刷新）
   *
   * @example
   * closeSpin()
   */
  const closeSpin = () => {
    setVariable('layoutContentSpinning', false)
  }

  return {
    reload,
    openSpin,
    closeSpin,
  }
}

export type UseSpinningReturnType = ReturnType<typeof useSpinning>
