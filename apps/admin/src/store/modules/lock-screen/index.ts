import { APP_CATCH_KEY } from '@/app-config'
import { getStorageInstance } from '@/utils/cache-backend'
import { useStorage } from '@vueuse/core'

export const piniaLockScreenStore = defineStore('lock-screen', () => {
  // 沿用历史布尔值格式与 key，并保留跨标签页 storage 同步。
  const locked = useStorage(
    APP_CATCH_KEY.isAppLockScreen,
    false,
    getStorageInstance('localStorage'),
    { mergeDefaults: true },
  )
  const setLocked = (value: boolean) => {
    locked.value = value
  }

  return { locked, setLocked }
})
