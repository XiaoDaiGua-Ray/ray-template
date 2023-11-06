/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-11-06
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { piniaKeepAliveStore } from '../index'

export const useKeepAliveGetters = () => {
  const variable = piniaKeepAliveStore()

  /**
   *
   * @remark 获取当前可缓存项 name
   */
  const getKeepAliveInclude = computed(() => variable.keepAliveInclude)

  return {
    getKeepAliveInclude,
  }
}

export const useKeepAliveActions = () => {
  const { setKeepAliveInclude, getKeepAliveInclude } = piniaKeepAliveStore()

  return {
    setKeepAliveInclude,
    getKeepAliveInclude,
  }
}
