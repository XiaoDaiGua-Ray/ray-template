import { APP_CATCH_KEY } from '@/app-config'
import { useStorage } from '@vueuse/core'

const appLockScreen = useStorage(
  APP_CATCH_KEY.isAppLockScreen,
  false,
  window.localStorage,
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
