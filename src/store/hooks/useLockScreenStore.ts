import { piniaLockScreenStore } from '../modules/lock-screen'

export const useLockScreenGetters = () => {
  const store = piniaLockScreenStore()

  return { getLocked: computed(() => store.locked) }
}

export const useLockScreenActions = () => {
  const { setLocked } = piniaLockScreenStore()

  return { setLocked }
}
