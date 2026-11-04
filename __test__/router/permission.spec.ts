import { createMemoryHistory, createRouter } from 'vue-router'
import { APP_CATCH_KEY } from '../../apps/admin/src/app-config'
import { permissionRouter } from '../../apps/admin/src/router/utils/permission'
import { setStorage } from '../../apps/admin/src/utils/cache'

vi.mock('../../apps/admin/src/hooks', () => ({
  useAppRoot: () => ({ getRootPath: { value: '/dashboard' } }),
}))
vi.mock('../../apps/admin/src/router/utils/valid-role', () => ({
  validRole: (meta: { role?: string[] }) =>
    !meta.role?.length || meta.role.includes('admin'),
}))

function setupRouter(rootRole?: string[]) {
  const component = { render: () => null }
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'RLogin', component },
      { path: '/dashboard', component, meta: { role: rootRole } },
      { path: '/allowed', component, meta: { role: ['admin'] } },
      { path: '/denied', component, meta: { role: ['editor'] } },
      {
        path: '/docs',
        name: 'RayTemplateDoc',
        component,
        meta: { role: ['editor'] },
      },
    ],
  })

  permissionRouter(router)

  return router
}

describe('Router 5 permission guard', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('redirects unauthenticated protected navigation to login', async () => {
    const router = setupRouter()

    await router.push('/allowed')

    expect(router.currentRoute.value.path).toBe('/')
  })

  it('redirects authenticated login to the configured home', async () => {
    setStorage(APP_CATCH_KEY.token, 'demo-token', 'localStorage')
    const router = setupRouter()

    await router.push('/')

    expect(router.currentRoute.value.path).toBe('/dashboard')
  })

  it('allows permitted roles and authenticated whitelist routes', async () => {
    setStorage(APP_CATCH_KEY.token, 'demo-token', 'localStorage')
    const router = setupRouter()

    await router.push('/allowed')

    expect(router.currentRoute.value.path).toBe('/allowed')

    await router.push('/docs')

    expect(router.currentRoute.value.path).toBe('/docs')
  })

  it('redirects a denied role to home', async () => {
    setStorage(APP_CATCH_KEY.token, 'demo-token', 'localStorage')
    const router = setupRouter()

    await router.push('/denied')

    expect(router.currentRoute.value.path).toBe('/dashboard')
  })

  it('cancels when home itself is denied instead of redirecting forever', async () => {
    const router = setupRouter(['editor'])

    await router.push('/')
    setStorage(APP_CATCH_KEY.token, 'demo-token', 'localStorage')
    await router.push('/denied')

    expect(router.currentRoute.value.path).toBe('/')
  })
})
