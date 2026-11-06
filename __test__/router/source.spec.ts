const getRoutes = vi.fn()

beforeEach(() => {
  vi.resetModules()
  getRoutes.mockRejectedValue(new Error('Route backend unavailable'))
  vi.doMock('@/api/admin', () => ({
    getAdminRoutes: getRoutes,
    updateAdminRoutes: vi.fn(),
  }))
  localStorage.removeItem('rayRouteConfig.v1')
})

afterEach(() => {
  vi.doUnmock('@/api/admin')
  vi.unstubAllEnvs()
  localStorage.removeItem('rayRouteConfig.v1')
})

it('fails startup when the configured real route API is unavailable', async () => {
  vi.stubEnv('VITE_API_MOCK', 'false')
  const { loadRouteConfig, routeSourceStatus } =
    await import('@/router/config/source')

  await expect(loadRouteConfig()).rejects.toThrow('Route backend unavailable')
  expect(routeSourceStatus.error).toBe('Route backend unavailable')
})

it('retains the Mock recovery path after a failed route request', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true')
  const { loadRouteConfig, routeSourceStatus } =
    await import('@/router/config/source')

  await expect(loadRouteConfig()).resolves.toBeUndefined()
  expect(routeSourceStatus.active).toBe('static')
})

it('ignores previously saved static routes when the backend owns runtime routes', async () => {
  vi.stubEnv('VITE_API_MOCK', 'false')
  localStorage.setItem(
    'rayRouteConfig.v1',
    JSON.stringify({ source: 'static' }),
  )
  const { loadRouteConfig } = await import('@/router/config/source')

  await expect(loadRouteConfig()).rejects.toThrow('Route backend unavailable')
  expect(getRoutes).toHaveBeenCalled()
})
