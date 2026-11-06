import { getAdminSession, loginAdmin, logoutAdmin } from '@/api/admin'
import {
  AdminApiError,
  advanceAdminSession,
  apiMockEnabled,
  browserSessionEnabled,
} from '@/api/admin/client'
import type { SessionInfo } from '@/api/admin/contracts'
import { APP_CATCH_KEY } from '@/app-config'
import { clearAccountRoutes, router } from '@/router'
import { isSystemRoute } from '@/router/constant'
import { getStorage, removeStorage, setStorage } from '@/utils/cache'
import { piniaLockScreenStore } from '../lock-screen'
import type { SigningCallback, SigningForm } from './types'

export const adminSessionChangeKey = 'rayAdminSessionChanged'

export const announceAdminSessionChange = () => {
  setStorage(adminSessionChangeKey, crypto.randomUUID(), 'localStorage')
}

export const piniaSigningStore = defineStore('signing', () => {
  const signingCallback = ref({} as SigningCallback)
  const permissions = ref<string[]>([])
  let revision = 0
  let expiryTimer: ReturnType<typeof setTimeout> | undefined

  const expireSession = () => {
    if (!signingCallback.value.id) return

    const route = router.currentRoute.value
    const redirect =
      route.path === '/' || isSystemRoute(route) ? void 0 : route.fullPath

    clearSigningCallback()
    void router.replace({ path: '/', query: { redirect } })
  }

  const setSession = (session: SessionInfo) => {
    signingCallback.value = session.user
    permissions.value = session.permissions
    clearTimeout(expiryTimer)

    const expiresAt = Date.parse(session.expiresAt ?? '')

    if (Number.isFinite(expiresAt))
      expiryTimer = setTimeout(
        expireSession,
        Math.min(2_147_483_647, Math.max(0, expiresAt - Date.now())),
      )
  }

  const clearSigningCallback = () => {
    revision++
    advanceAdminSession()
    clearTimeout(expiryTimer)
    signingCallback.value = {} as SigningCallback
    permissions.value = []
    clearAccountRoutes()

    for (const key of [
      APP_CATCH_KEY.token,
      APP_CATCH_KEY.signing,
      APP_CATCH_KEY.appLockScreenPasswordKey,
    ])
      removeStorage(key, 'localStorage')

    localStorage.removeItem(APP_CATCH_KEY.appPiniaSigningStore)

    for (const key of [
      APP_CATCH_KEY.appMenuTagOptions,
      APP_CATCH_KEY.appMenuKey,
      APP_CATCH_KEY.appPiniaKeepAliveStore,
    ])
      removeStorage(key, 'sessionStorage')

    piniaLockScreenStore().setLocked(false)
  }

  const signing = async ({ name, pwd }: SigningForm) => {
    const session = await loginAdmin(name, pwd)

    revision++
    advanceAdminSession()

    if ('accessToken' in session)
      setStorage(APP_CATCH_KEY.token, session.accessToken, 'localStorage')

    setSession(session)
  }

  const restoreSession = async () => {
    localStorage.removeItem(APP_CATCH_KEY.appPiniaSigningStore)
    removeStorage(APP_CATCH_KEY.signing, 'localStorage')

    if (browserSessionEnabled)
      removeStorage(APP_CATCH_KEY.token, 'localStorage')
    else if (!getStorage<string>(APP_CATCH_KEY.token, 'localStorage')) return

    const current = revision

    try {
      const session = await getAdminSession()

      if (revision === current) setSession(session)
    } catch (error) {
      if (!(error instanceof AdminApiError) || error.code !== 401) throw error

      if (revision === current) clearSigningCallback()
    }
  }

  const revalidateSession = async (): Promise<
    'active' | 'signedOut' | 'changed'
  > => {
    if (apiMockEnabled) return 'active'

    const current = revision

    try {
      const session = await getAdminSession()

      if (revision !== current)
        return signingCallback.value.id ? 'changed' : 'signedOut'

      if (
        session.user.id !== signingCallback.value.id ||
        session.user.role !== signingCallback.value.role ||
        new Set(session.permissions).size !== new Set(permissions.value).size ||
        session.permissions.some(
          (permission) => !permissions.value.includes(permission),
        )
      ) {
        location.reload()

        return 'changed'
      }

      setSession(session)

      return 'active'
    } catch (error) {
      if (!(error instanceof AdminApiError) || error.code !== 401) throw error

      if (revision === current) clearSigningCallback()

      return 'signedOut'
    }
  }

  const endSession = async (redirect?: string) => {
    clearSigningCallback()
    announceAdminSessionChange()
    await router.replace({ path: '/', query: { redirect } })
  }

  const logout = async (redirect?: string) => {
    try {
      await logoutAdmin()
    } catch (error) {
      if (!(error instanceof AdminApiError) || error.code !== 401) throw error
    }

    await endSession(redirect)
  }

  const updateDisplayName = (name: string) => {
    signingCallback.value.name = name
  }

  onScopeDispose(() => clearTimeout(expiryTimer))

  return {
    signingCallback,
    permissions,
    restoreSession,
    revalidateSession,
    signing,
    logout,
    clearSigningCallback,
    endSession,
    expireSession,
    updateDisplayName,
  }
})
