import { getAdminSession, loginAdmin, logoutAdmin } from '@/api/admin'
import { AdminApiError } from '@/api/admin/client'
import { APP_CATCH_KEY } from '@/app-config'
import { useSiderBar, useVueRouter } from '@/hooks'
import type {
  SigningCallback,
  SigningForm,
  SigningResponse,
} from '@/store/modules/signing/types'
import { getStorage, removeStorage, setStorage } from '@/utils/cache'

/** 登录状态仓库，使用 localStorage 持久化 signingCallback。 */
export const piniaSigningStore = defineStore(
  'signing',
  () => {
    const { router } = useVueRouter()
    const permissions = ref<string[]>([])
    const state = reactive({
      /** 用户资料由会话接口刷新；role 用于现有路由和菜单守卫。 */
      signingCallback: {} as SigningCallback,
    })

    /**
     *
     * @param signingFormValue 用户登录信息
     *
     * @description
     * 请求标准登录接口，保存返回的会话 token、资料与权限码。
     * 保留组件侧 code=0 的成功约定；接口错误通过 Promise 拒绝。
     */
    const signing = async (
      signingFormValue: SigningForm,
    ): Promise<SigningResponse> => {
      const session = await loginAdmin(
        signingFormValue.name,
        signingFormValue.pwd,
      )

      setStorage(APP_CATCH_KEY.token, session.accessToken, 'localStorage')
      state.signingCallback = session.user
      permissions.value = session.permissions

      return { code: 0, message: 'OK', data: state.signingCallback }
    }

    const restoreSession = async () => {
      permissions.value = []

      if (!getStorage<string>(APP_CATCH_KEY.token, 'localStorage')) {
        state.signingCallback = {} as SigningCallback

        return
      }

      try {
        const session = await getAdminSession()

        state.signingCallback = session.user
        permissions.value = session.permissions
      } catch (error) {
        if (!(error instanceof AdminApiError) || error.code !== 401) throw error

        removeStorage(APP_CATCH_KEY.token, 'localStorage')
        removeStorage(APP_CATCH_KEY.signing, 'localStorage')
        state.signingCallback = {} as SigningCallback
      }
    }

    /**
     *
     * @param toSigning 是否需要退出登录，并且重定向至登录页
     *
     * @description
     * 清除所有登录缓存信息。
     * 如果 toSigning 传递 true 则会重定向至登录页。
     */
    const clearSigningCallback = (toSigning: boolean) => {
      const { closeAll } = useSiderBar()
      const {
        appPiniaMenuStore,
        appPiniaSigningStore,
        token,
        signing,
        appMenuKey,
      } = APP_CATCH_KEY

      // 提示信息
      window.$message.info('账号退出中...')
      state.signingCallback = {} as SigningCallback
      permissions.value = []
      // 移除所有 sessionStorage 缓存
      removeStorage('__all_sessionStorage__', 'sessionStorage')
      // 移除指定 localStorage 缓存
      removeStorage(appPiniaSigningStore, 'localStorage')
      removeStorage(appPiniaMenuStore, 'localStorage')
      removeStorage(token, 'localStorage')
      removeStorage(signing, 'localStorage')
      removeStorage(appMenuKey, 'localStorage')
      removeStorage(APP_CATCH_KEY.isAppLockScreen, 'localStorage')
      // 关闭所有侧边栏标签
      closeAll()

      if (toSigning) {
        router.clearRoutes()
        void router.replace('/')

        setTimeout(() => {
          window.location.reload()
        }, 0)
      }
    }

    /**
     *
     * 退出登陆并且清空缓存数据
     * 延迟 300ms 后强制刷新当前系统
     */
    const logout = async () => {
      try {
        await logoutAdmin()
      } catch {
        // 服务端暂时不可达时，仍允许用户完成本地退出。
      } finally {
        clearSigningCallback(true)
      }
    }

    return {
      ...toRefs(state),
      permissions,
      restoreSession,
      signing,
      logout,
      clearSigningCallback,
    }
  },
  {
    persist: {
      key: APP_CATCH_KEY.appPiniaSigningStore,
      pick: ['signingCallback'],
      storage: window.localStorage,
    },
  },
)
