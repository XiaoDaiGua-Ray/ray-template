/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-01
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 缓存
 *
 * 管理系统缓存
 * 基于 KeepAlive 组件实现
 * 依赖 APP_KEEP_ALIVE 配置
 */

import { APP_KEEP_ALIVE } from '@/app-config'
import { APP_CATCH_KEY } from '@/app-config'

import type { KeepAliveStoreState } from './types'
import type { AppMenuOption } from '@/types'

export const piniaKeepAliveStore = defineStore(
  'keepAlive',
  () => {
    const { maxKeepAliveLength } = APP_KEEP_ALIVE

    const state = reactive<KeepAliveStoreState>({
      keepAliveInclude: [],
    })

    const getCurrentKeepAliveLength = () => state.keepAliveInclude.length

    /**
     *
     * @param option current menu option
     *
     * @remark 判断当前页面是否配置需要缓存, 并且判断当前缓存数量是否超过最大缓存数设置数量
     * @remark 如果超过最大阈值, 则会按照尾插头删方式维护该队列
     */
    const setKeepAliveInclude = (option: AppMenuOption) => {
      const length = getCurrentKeepAliveLength()
      const {
        name,
        meta: { keepAlive },
      } = option

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

    /** 获取当前缓存队列 */
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
      paths: ['keepAliveInclude'],
    },
  },
)
