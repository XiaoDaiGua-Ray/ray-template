import { createApp } from 'vue'

import type { App as AppType } from 'vue'

import '@/styles/base.scss'

// import 'amfe-flexible' // 如果为移动端项目, 解开该注释即可
import 'virtual:svg-icons-register' // `vite-plugin-svg-icons` 脚本, 如果不使用此插件注释即可

import App from './App'

import { setupRouter } from './router/index'
import { setupStore } from './store/index'
import { setupI18n } from './language/index'

const setupTemplate = () => {
  const instance = createApp(App)

  setupRouter(instance)

  setupStore(instance)

  setupI18n(instance)

  instance.mount('#app')
}

if (window.__POWERED_BY_WUJIE__) {
  let instance: AppType<Element>

  window.__WUJIE_MOUNT = () => {
    instance = createApp(App)

    setupRouter(instance)

    setupStore(instance)

    setupI18n(instance)

    instance.mount('#app')
  }
  window.__WUJIE_UNMOUNT = () => {
    instance.unmount()
  }

  window.__WUJIE.mount()
} else {
  setupTemplate()
}
