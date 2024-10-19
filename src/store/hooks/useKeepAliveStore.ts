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
