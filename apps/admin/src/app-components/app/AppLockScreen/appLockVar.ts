import { useLockScreenActions, useLockScreenGetters } from '@/store'

/**
 *
 * @description
 * 复用锁屏 Store 的状态访问，不创建独立缓存或监听器。
 *
 * @returns 读取和更新当前锁屏状态的方法
 */
const useAppLockScreen = () => {
  const { getLocked } = useLockScreenGetters()
  const { setLocked } = useLockScreenActions()

  return {
    setLockAppScreen: setLocked,
    getLockAppScreen: () => getLocked.value,
  }
}

export default useAppLockScreen
