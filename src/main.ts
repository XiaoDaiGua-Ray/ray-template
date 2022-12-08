import { createApp } from 'vue'

import type { App as AppType } from 'vue'

import '@/styles/base.scss'

// import 'amfe-flexible' // 如果为移动端项目, 解开该注释即可
import 'virtual:svg-icons-register' // `vite-plugin-svg-icons` 脚本, 如果不使用此插件注释即可

import App from './App'

import {
  setupRouter,
  setupRouterLoadingBar,
  permissionRouter,
} from './router/index'
import { setupStore } from './store/index'
import { setupI18n } from './language/index'

/**
 *
 * 普通应用注册方法
 */
const setupTemplate = () => {
  const app = createApp(App)

  setupI18n(app)

  setupStore(app)

  setupRouter(app)

  setupRouterLoadingBar()

  permissionRouter()

  app.mount('#app')
}

/**
 *
 * 作为 `wujie-micro` 子应用注册应用方法
 * 注意: 此处的 `instance` 名称不可以写为 `app`
 */
const setupWujieTemplate = () => {
  let instance: AppType<Element>

  window.__WUJIE_MOUNT = () => {
    instance = createApp(App)

    setupI18n(instance)

    setupStore(instance)

    setupRouter(instance)

    setupRouterLoadingBar()

    permissionRouter()

    instance.mount('#app')
  }

  window.__WUJIE_UNMOUNT = () => {
    instance.unmount()
  }

  window.__WUJIE.mount()
}

/**
 *
 * 如果此处需要作为微服务主应用使用, 则只需要执行 `setupTemplate` 方法即可
 *
 * 作为主应用
 * ----------------------------------------------------------------
 * # 示例
 * const setupTemplate = () => {
 *   const app = createApp(App)
 *   setupRouter(app)
 *   ...
 * }
 * setupTemplate()
 * ----------------------------------------------------------------
 */

window.__POWERED_BY_WUJIE__ ? setupWujieTemplate() : setupTemplate()
