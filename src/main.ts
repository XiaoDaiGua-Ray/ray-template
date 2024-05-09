import App from './App'

import '@/styles/base.scss' // 初始化一些基础样式
import './app-components/provider/provider.scss' // 初始化 provider 包注入组件样式
import 'vue3-next-qrcode/es/style.css' // vue3-next-qrcode 样式

import 'virtual:svg-icons-register' // vite-plugin-svg-icons 脚本，启用 svg 雪碧图

import { setupRouter } from './router'
import { setupStore } from './store'
import { setupI18n } from './locales'
import { setupDayjs } from './dayjs'
import { setupDirectives } from './directives'
import { setupRayTemplateCore } from './__ray-template'

import type { App as AppType } from 'vue'

/**
 *
 * @param inst vue instance
 *
 * @description
 * 该方法注册所有模板插件。
 *
 * 注册时应该注意每个插件的加载顺序。
 */
const setupPlugins = async (inst: AppType<Element>) => {
  setupStore(inst)
  await setupI18n(inst)
  setupRouter(inst)
  setupDayjs()
  setupDirectives(inst)
}

/**
 *
 * @description
 * 普通应用注册方法。
 */
const setupTemplate = async () => {
  const app = createApp(App)

  await setupPlugins(app)
  app.mount('#app')
  await setupRayTemplateCore()
}

/**
 *
 * @description
 * 作为 wujie-micro 子应用注册应用方法。
 *
 * 并且挂载一个 __WUJIE_MOUNT 实例。
 */
const setupWujieTemplate = async () => {
  let instance: AppType<Element>

  window.__WUJIE_MOUNT = async () => {
    instance = createApp(App)

    await setupPlugins(instance)
    instance.mount('#app')
    await setupRayTemplateCore()
  }

  window.__WUJIE_UNMOUNT = () => {
    instance.unmount()
  }

  window.__WUJIE.mount()
}

/**
 *
 * @description
 * 如果项目启用无界微服务, 会自动识别并且启动以无界微服务方法启动该项目。
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
