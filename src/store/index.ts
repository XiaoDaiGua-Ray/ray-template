/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-01-03
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 持久化存储 pinia 数据
 * 但是不能正常持久化 function 属性
 *
 * 官网地址: https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/
 */
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 导出仓库实例，不建议直接使用 store
export { piniaSettingStore } from './modules/setting/index' // import { piniaSettingStore } from '@/store' 即可使用
export { piniaMenuStore } from './modules/menu/index'
export { piniaSigningStore } from './modules/signing/index'
export { piniaKeepAliveStore } from './modules/keep-alive/index'

// 导出 getters, actions
export { useMenuGetters, useMenuActions } from './hooks/useMenuStore'
export { useSettingGetters, useSettingActions } from './hooks/useSettingStore'
export { useSigningGetters, useSigningActions } from './hooks/useSigningStore'
export {
  useKeepAliveGetters,
  useKeepAliveActions,
} from './hooks/useKeepAliveStore'

import type { App } from 'vue'

/**
 *
 * 设置并且注册 pinia
 * pinia 天生支持在非 setup 环境中使用，只要在调用时已经注册
 */
export const setupStore = async (app: App<Element>) => {
  const store = createPinia()

  app.use(store)
  store.use(piniaPluginPersistedstate)
}
