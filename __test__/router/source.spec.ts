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

it('activates the read-only legacy source from a local preference without publishing a draft', async () => {
  vi.stubEnv('VITE_ROUTE_CONFIG_URL', 'https://example.com/routes.json')
  localStorage.setItem(
    'rayRouteConfig.v1',
    JSON.stringify({ source: 'local', local: { version: 1, routes: [] } }),
  )
  const request = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify({ version: 1, routes: [] })))
  const reload = vi.spyOn(location, 'reload').mockImplementation(() => {})

  try {
    const { activateRemoteRouteSource, remoteRoutesReadOnly } =
      await import('@/router/config/source')

    expect(remoteRoutesReadOnly).toBe(true)
    await activateRemoteRouteSource()
    expect(request).toHaveBeenCalledTimes(1)
    expect(request.mock.calls[0]?.[1]?.method ?? 'GET').toBe('GET')
    expect(
      JSON.parse(localStorage.getItem('rayRouteConfig.v1')!),
    ).toMatchObject({ source: 'remote' })
    expect(reload).toHaveBeenCalledOnce()
  } finally {
    request.mockRestore()
    reload.mockRestore()
  }
})
