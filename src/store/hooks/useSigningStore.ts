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
  const { signing, logout, clearSigningCallback } = piniaSigningStore()

  return {
    signing,
    logout,
    clearSigningCallback,
  }
}
