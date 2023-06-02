import type { App as AppType } from 'vue'

import '@/styles/base.scss'

import 'virtual:svg-icons-register' // `vite-plugin-svg-icons` 脚本, 如果不使用此插件注释即可
import 'dayjs/locale/zh-cn'

import App from './App'

import { setupRouter } from './router/index'
import { setupStore } from './store/index'
import { setupI18n } from './locales/index'
import { setupDayjs } from './dayjs/index'

/**
 *
 * 普通应用注册方法
 */
const setupTemplate = async () => {
  const app = createApp(App)

  await setupI18n(app)

  setupStore(app)

  setupRouter(app)

  setupDayjs()

  app.mount('#app')
}

/**
 *
 * 作为 `wujie-micro` 子应用注册应用方法
 * 注意: 此处的 `instance` 名称不可以写为 `app`
 */
const setupWujieTemplate = async () => {
  let instance: AppType<Element>

  window.__WUJIE_MOUNT = async () => {
    instance = createApp(App)

    await setupI18n(instance)

    setupStore(instance)

    setupRouter(instance)

    setupDayjs()

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
 * 如果项目启用无界微服务, 会自动识别并且启动以无界微服务方法启动该项目
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
