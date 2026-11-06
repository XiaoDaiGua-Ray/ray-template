import type { App } from 'vue'
import { router, setupRouter } from '../../apps/admin/src/router'

const { load, register } = vi.hoisted(() => ({
  load: vi.fn(),
  register: vi.fn(),
}))

vi.mock('../../apps/admin/src/router/config/source', () => ({
  loadRouteConfig: load,
}))
vi.mock('../../apps/admin/src/router/routes', () => ({
  constantRoutes: [{ path: '/', component: { render: () => null } }],
  getLayoutRoutes: () => [],
}))
vi.mock('../../apps/admin/src/router/app-route-modules', () => ({
  setAppRouteModules: vi.fn(),
}))
vi.mock('../../apps/admin/src/router/utils', () => ({
  scrollViewToTop: vi.fn(),
  vueRouterRegister: register,
}))

it('retries failed initialization on remount and shares the successful retry', async () => {
  const app = { use: vi.fn() } as unknown as App<Element>

  load
    .mockRejectedValueOnce(new Error('route endpoint unavailable'))
    .mockResolvedValue(void 0)

  try {
    await expect(setupRouter(app)).rejects.toThrow('route endpoint unavailable')
    expect(register).not.toHaveBeenCalled()
    await Promise.all([setupRouter(app), setupRouter(app)])
    expect(load).toHaveBeenCalledTimes(2)
    expect(register).toHaveBeenCalledOnce()
    await setupRouter(app)
    expect(load).toHaveBeenCalledTimes(2)
    expect(register).toHaveBeenCalledOnce()
  } finally {
    router.options.history.destroy()
  }
})
