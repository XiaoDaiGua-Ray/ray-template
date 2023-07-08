import App from './App'

import '@/styles/base.scss'

import 'virtual:svg-icons-register' // `vite-plugin-svg-icons` 脚本

import { setupRouter } from './router/index'
import { setupStore } from './store/index'
import { setupI18n } from './locales/index'
import { setupDayjs } from './dayjs/index'
import { setupDirectives } from './directives/index'

import type { App as AppType } from 'vue'

/**
 *
 * @param inst vue instance
 *
 * 该方法注册所有模板插件
 * 注册时应该注意每个插件的加载顺序
 */
const setupPlugins = async (inst: AppType<Element>) => {
  await setupI18n(inst)
  await setupStore(inst)
  setupRouter(inst)
  setupDayjs()
  setupDirectives(inst)
}

/**
 *
 * 普通应用注册方法
 */
const setupTemplate = async () => {
  const app = createApp(App)

  await setupPlugins(app)
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

    await setupPlugins(instance)
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
 * @example
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
