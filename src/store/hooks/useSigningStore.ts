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

import { piniaSigningStore } from '../index'

export const useSigningGetters = () => {
  const variable = piniaSigningStore()

  /**
   *
   * @description
   * 获取登陆返回信息。
   */
  const getSigningCallback = computed(() => variable.signingCallback)

  return {
    getSigningCallback,
  }
}

export const useSigningActions = () => {
  const { signing, logout } = piniaSigningStore()

  return {
    signing,
    logout,
  }
}
