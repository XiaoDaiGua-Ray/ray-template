import App from './App'
import './styles/entry'
import type { App as AppType } from 'vue'
import { setupRayTemplateCore } from './__ray-template'
import { installAutocompleteDefaults } from './app-components/provider/AppAutocompleteDefaults'
import { GLOBAL_CLASS_NAMES } from './app-config'
import { setupDayjs } from './dayjs'
import { setupDirectives } from './directives'
import { setupI18n } from './locales'
import { setupRouter } from './router'
import { setupStore } from './store'

const bootSplash = () =>
  document.getElementById(GLOBAL_CLASS_NAMES.preLoadingAnimation)

const showBootError = (error: unknown) => {
  console.error('[Ray Admin] Startup failed.', error)
  bootSplash()?.setAttribute('data-state', 'failed')
}

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
  await setupRouter(inst)
  setupDayjs()
  setupDirectives(inst)
  inst.onUnmount(installAutocompleteDefaults(document.body))
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
  bootSplash()?.remove()
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

    try {
      await setupPlugins(instance)
      instance.mount('#app')
      bootSplash()?.remove()
      await setupRayTemplateCore()
    } catch (error) {
      showBootError(error)
      throw error
    }
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
 * const setupTemplate = async () => {
 *   const app = createApp(App)
 *   await setupRouter(app)
 *   ...
 * }
 * setupTemplate()
 * ----------------------------------------------------------------
 */
void (
  window.__POWERED_BY_WUJIE__ ? setupWujieTemplate() : setupTemplate()
).catch(showBootError)
