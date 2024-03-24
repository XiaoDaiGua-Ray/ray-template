import { setupStore } from '../../src/store'
import { setupRouter } from '../../src/router'
import { setupI18n } from '../../src/locales'
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
  setupRouter(app)
  await setupI18n(app)

  return {
    app,
  }
}

export default setupMiniApp
