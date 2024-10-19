/**
 *
 * 统一管理是否处于锁屏状态
 *
 * 可以根据后台接口进行替换该变量, 只要是一个响应式的变量值即可
 */

import { useStorage } from '@vueuse/core'
import { APP_CATCH_KEY } from '@/app-config'

const appLockScreen = useStorage(
  APP_CATCH_KEY.isAppLockScreen,
  false,
  sessionStorage,
  {
    mergeDefaults: true,
  },
)

const useAppLockScreen = () => {
  const setLockAppScreen = (bool: boolean) => {
    appLockScreen.value = bool
  }

  const getLockAppScreen = () => appLockScreen.value

  return {
    setLockAppScreen,
    getLockAppScreen,
  }
}

export default useAppLockScreen
