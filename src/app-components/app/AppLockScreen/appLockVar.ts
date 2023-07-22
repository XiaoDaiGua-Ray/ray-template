/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-20
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 统一管理是否处于锁屏状态
 *
 * 可以根据后台接口进行替换该变量, 只要是一个响应式的变量值即可
 */

const appLockScreen = useStorage('isAppLockScreen', false, sessionStorage, {
  mergeDefaults: true,
})

const useAppLockScreen = () => {
  const setLockAppScreen = (bool: boolean) => {
    appLockScreen.value = bool
  }

  const getLockAppScreen = () => appLockScreen.value

  return {
    setLockAppScreen,
    getLockAppScreen,
  }
}

export default useAppLockScreen
