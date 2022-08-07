import type { App } from 'vue'

export { useSetting } from './modules/setting' // import { useSetting } from '@/store' 即可使用

const store = createPinia()

export const setupStore = (app: App<Element>) => {
  app.use(store)
}
