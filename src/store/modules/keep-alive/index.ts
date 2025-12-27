import { APP_CATCH_KEY } from '@/app-config'
import type { AppMenuOption } from '@/types'
import { piniaSettingStore } from '../setting'
import type { KeepAliveStoreState } from './types'

export const piniaKeepAliveStore = defineStore(
  'keepAlive',
  () => {
    const state = reactive<KeepAliveStoreState>({
      keepAliveInclude: [],
    })

    const getCurrentKeepAliveLength = () => state.keepAliveInclude.length

    /**
     *
     * @param option current menu option
     *
     * @description
     * 设置当前可缓存项。
     * 如果当前可缓存项数量超过最大缓存数量，则移除第一个，添加最后一个。
     */
    const setKeepAliveInclude = (option: AppMenuOption) => {
      const length = getCurrentKeepAliveLength()
      const {
        name,
        meta: { keepAlive },
      } = option
      const { maxKeepAliveLength } = piniaSettingStore().keepAliveConfig

      if (keepAlive) {
        if (
          length < maxKeepAliveLength &&
          !state.keepAliveInclude.includes(name)
        ) {
          state.keepAliveInclude.push(name)

          return
        }

        if (length >= maxKeepAliveLength) {
          state.keepAliveInclude.splice(0, 1)
          state.keepAliveInclude.push(name)
        }
      }
    }

    // 获取当前缓存队列
    const getKeepAliveInclude = () => state.keepAliveInclude

    return {
      ...toRefs(state),
      setKeepAliveInclude,
      getKeepAliveInclude,
    }
  },
  {
    persist: {
      key: APP_CATCH_KEY.appPiniaKeepAliveStore,
      storage: window.sessionStorage,
      pick: ['keepAliveInclude'],
    },
  },
)
