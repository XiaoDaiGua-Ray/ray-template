import type { App } from 'vue'
import {
  clearAccountRoutes,
  loadAccountRoutes,
  router,
  setupRouter,
} from '../../apps/admin/src/router'

const { load, register } = vi.hoisted(() => ({
  load: vi.fn(),
  register: vi.fn(),
}))

vi.mock('../../apps/admin/src/router/config/source', () => ({
  loadRouteConfig: load,
  resetRouteSource: vi.fn(),
}))
vi.mock('../../apps/admin/src/router/routes', () => ({
  getRootRoutes: () => [
    { path: '/', name: 'RLayout', component: { render: () => null } },
  ],
  getLayoutRoutes: () => [],
  getSystemRoutes: () => [],
  getAccountProfileRoute: () => ({
    path: '/account/profile',
    component: { render: () => null },
  }),
}))
vi.mock('../../apps/admin/src/router/app-route-modules', () => ({
  setAppRouteModules: vi.fn(),
  getStaticAppRoutes: () => [],
}))
vi.mock('../../apps/admin/src/router/utils', () => ({
  scrollViewToTop: vi.fn(),
  vueRouterRegister: register,
}))

it('loads no business routes before login, then shares a retry and registers guards once', async () => {
  const app = { use: vi.fn() } as unknown as App<Element>

  load
    .mockRejectedValueOnce(new Error('route endpoint unavailable'))
    .mockResolvedValue(void 0)

  try {
    await setupRouter(app, false, { render: () => null })
    expect(load).not.toHaveBeenCalled()
    await expect(loadAccountRoutes()).rejects.toThrow(
      'route endpoint unavailable',
    )
    await Promise.all([loadAccountRoutes(), loadAccountRoutes()])
    expect(load).toHaveBeenCalledTimes(2)
    expect(register).toHaveBeenCalledOnce()
  } finally {
    clearAccountRoutes()
    router.options.history.destroy()
  }
})
