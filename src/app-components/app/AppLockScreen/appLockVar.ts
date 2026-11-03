import { useLockScreenActions, useLockScreenGetters } from '@/store'

const useAppLockScreen = () => {
  const { getLocked } = useLockScreenGetters()
  const { setLocked } = useLockScreenActions()

  return {
    setLockAppScreen: setLocked,
    getLockAppScreen: () => getLocked.value,
  }
}

export default useAppLockScreen
