import { disposePinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

// 该仓库导出，更多是为了 hooks 包中，在模板中尽量不直接操作 store 仓库
export * from './modules/setting'
export * from './modules/menu'
export * from './modules/signing'
export * from './modules/keep-alive'
export * from './modules/runtime'
export * from './modules/lock-screen'
// 导出 getters, actions
export * from './hooks/useMenuStore'
export * from './hooks/useSettingStore'
export * from './hooks/useSigningStore'
export * from './hooks/useKeepAliveStore'
export * from './hooks/useRuntimeStore'
export * from './hooks/useLockScreenStore'
export * from './hooks/useNavigationHistoryStore'

// Store hooks 是业务访问入口；应用卸载时同时释放 Pinia 作用域及其订阅。
export const setupStore = (app: App<Element>) => {
  const store = createPinia()

  app.use(store)
  store.use(piniaPluginPersistedstate)
  app.onUnmount(() => disposePinia(store))
}
