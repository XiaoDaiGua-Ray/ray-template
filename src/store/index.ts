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
 * 模板约定不直接操作 store 实例，所有操作都应在 hooks 中二次封装的 getters, actions
 *
 * 持久化存储 pinia 数据
 * 但是不能正常持久化 function 属性
 *
 * 官网地址: https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/
 */
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 该仓库导出，更多是为了 hooks 包中，在模板中尽量不直接操作 store 仓库
import { piniaSettingStore } from './modules/setting'
import { piniaMenuStore } from './modules/menu'
import { piniaSigningStore } from './modules/signing'
import { piniaKeepAliveStore } from './modules/keep-alive'

// 导出 getters, actions
import { useMenuGetters, useMenuActions } from './hooks/useMenuStore'
import { useSettingGetters, useSettingActions } from './hooks/useSettingStore'
import { useSigningGetters, useSigningActions } from './hooks/useSigningStore'
import {
  useKeepAliveGetters,
  useKeepAliveActions,
} from './hooks/useKeepAliveStore'

import type { App } from 'vue'

export {
  piniaSettingStore,
  piniaMenuStore,
  piniaSigningStore,
  piniaKeepAliveStore,
  useMenuGetters,
  useMenuActions,
  useSettingGetters,
  useSettingActions,
  useSigningGetters,
  useSigningActions,
  useKeepAliveGetters,
  useKeepAliveActions,
}

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
