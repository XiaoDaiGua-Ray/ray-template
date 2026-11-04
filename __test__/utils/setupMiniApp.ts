import { setupI18n } from '../../apps/admin/src/locales'
import { setupRouter } from '../../apps/admin/src/router'
import { setupStore } from '../../apps/admin/src/store'
import renderHook from '../utils/renderHook'

/**
 *
 * @description
 * 初始化 mini ray template 应用环境。
 * 该方法会初始化 store、router、i18n 等环境。
 *
 * @example
 * const { app } = await setupMiniApp()
 */
const setupMiniApp = async () => {
  const [_, app] = renderHook(() => {})

  setupStore(app)
  await setupI18n(app)
  await setupRouter(app)

  return {
    app,
  }
}

export default setupMiniApp
