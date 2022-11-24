import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import type { App } from 'vue'

export { useSetting } from './modules/setting' // import { useSetting } from '@/store' 即可使用
export { useMenu } from './modules/menu'

const store = createPinia()

export const setupStore = (app: App<Element>) => {
  app.use(store)

  store.use(piniaPluginPersistedstate)
}
