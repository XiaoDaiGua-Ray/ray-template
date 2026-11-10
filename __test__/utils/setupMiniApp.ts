import { setupI18n } from '../../apps/admin/src/locales'
import { setupRouter } from '../../apps/admin/src/router'
import { setupStore } from '../../apps/admin/src/store'
import { piniaSigningStore } from '../../apps/admin/src/store/modules/signing'
import Login from '../../apps/admin/src/views/login'
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
const setupMiniApp = async (authenticated = false) => {
  const [_, app] = renderHook(() => {})

  setupStore(app)
  setupI18n(app)

  if (authenticated)
    await app.runWithContext(() =>
      piniaSigningStore().signing({ name: 'admin', pwd: '123456' }),
    )

  await setupRouter(app, authenticated, Login)

  return {
    app,
  }
}

export default setupMiniApp
