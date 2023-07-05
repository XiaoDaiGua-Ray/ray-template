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

export { useSetting } from './modules/setting/index' // import { useSetting } from '@/store' 即可使用
export { useMenu } from './modules/menu/index'
export { useSignin } from './modules/signin/index'
export { useKeepAlive } from './modules/keep-alive/index'

import type { App } from 'vue'

/** 设置并且注册 pinia */
export const setupStore = async (app: App<Element>) => {
  const store = createPinia()

  app.use(store)

  store.use(piniaPluginPersistedstate)
}
