import { piniaSigningStore } from '../index'

export const useSigningGetters = () => {
  const variable = piniaSigningStore()

  /**
   *
   * @description
   * 获取登陆返回信息。
   */
  const getSigningCallback = computed(() => variable.signingCallback)
  const getPermissions = computed(() => variable.permissions)

  return {
    getSigningCallback,
    getPermissions,
  }
}

export const useSigningActions = () => {
  const { signing, logout, clearSigningCallback, restoreSession } =
    piniaSigningStore()

  return {
    signing,
    logout,
    clearSigningCallback,
    restoreSession,
  }
}
