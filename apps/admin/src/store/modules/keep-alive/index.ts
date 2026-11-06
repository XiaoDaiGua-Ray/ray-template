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

    /**
     *
     * @param option current menu option
     *
     * @description
     * 设置当前可缓存项。
     * 如果当前可缓存项数量超过最大缓存数量，则移除第一个，添加最后一个。
     */
    const setKeepAliveInclude = (option: AppMenuOption) => {
      const {
        name,
        meta: { keepAlive },
      } = option
      const { maxKeepAliveLength } = piniaSettingStore().keepAliveConfig

      if (!keepAlive || !name || maxKeepAliveLength <= 0) return

      const include = state.keepAliveInclude

      if (include.at(-1) === name && include.length <= maxKeepAliveLength)
        return

      state.keepAliveInclude = [
        ...new Set(include.filter((key) => key !== name)),
        name,
      ].slice(-maxKeepAliveLength)
    }

    // 获取当前缓存队列
    const getKeepAliveInclude = () => state.keepAliveInclude

    /**
     *
     * @param names 当前仍打开且允许访问的业务组件名称
     *
     * @description
     * 移除已关闭或失去权限的页面缓存，空工作区不会保留隐式首页。
     */
    const retainKeepAliveInclude = (names: ReadonlySet<string>) => {
      state.keepAliveInclude = state.keepAliveInclude.filter((name) =>
        names.has(name),
      )
    }

    return {
      ...toRefs(state),
      setKeepAliveInclude,
      getKeepAliveInclude,
      retainKeepAliveInclude,
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
