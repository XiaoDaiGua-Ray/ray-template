import { version as mswVersion } from 'msw/package.json'

const { installGuard, setupWorker } = vi.hoisted(() => ({
  installGuard: vi.fn<(guard: (url: string) => Promise<void>) => void>(),
  setupWorker: vi.fn(),
}))

vi.mock('msw/browser', () => ({ setupWorker }))
vi.mock('@/axios/instance', () => ({ installMockRequestGuard: installGuard }))
vi.mock('@/api/admin/client', () => ({
  apiMockEnabled: true,
  apiUrl: (path: string) => `http://localhost/ray-template/api/${path}`,
}))

beforeEach(() => {
  vi.resetModules()
  installGuard.mockClear()
  setupWorker.mockReset()
})

afterEach(() => vi.restoreAllMocks())

it('starts on the first API request and shares repeated concurrent recoveries', async () => {
  const worker = { start: vi.fn(async () => {}), stop: vi.fn(async () => {}) }

  setupWorker.mockReturnValue(worker)

  const { registerApiMock } = await import('@/mocks/register')

  registerApiMock()
  registerApiMock()
  expect(installGuard).toHaveBeenCalledOnce()

  const guard = installGuard.mock.calls[0]![0]
  const probe = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(
      new Response(null, { headers: { 'x-ray-mock': 'active' } }),
    )

  await guard('http://localhost/unrelated')
  expect(probe).not.toHaveBeenCalled()
  expect(setupWorker).not.toHaveBeenCalled()

  await Promise.all([
    guard('http://localhost/ray-template/api/admin/auth/session'),
    guard('http://localhost/ray-template/api/admin/routes'),
  ])
  expect(worker.start).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js?v=${mswVersion}`,
        options: { scope: import.meta.env.BASE_URL },
      },
    }),
  )

  for (let attempt = 0; attempt < 2; attempt++) {
    probe.mockResolvedValueOnce(new Response(null, { status: 404 }))
    await Promise.all([
      guard('http://localhost/ray-template/api/admin/demo/people'),
      guard('http://localhost/ray-template/api/admin/demo/search-options'),
    ])
  }

  expect(worker.stop).toHaveBeenCalledTimes(2)
  expect(worker.start).toHaveBeenCalledTimes(3)
  expect(probe).toHaveBeenCalledTimes(5)
  expect(setupWorker).toHaveBeenCalledOnce()
})

it('blocks API requests if startup fails and retries the same client', async () => {
  const worker = {
    start: vi.fn(async () => {}).mockRejectedValueOnce(new Error('offline')),
    stop: vi.fn(async () => {}),
  }

  setupWorker.mockReturnValue(worker)
  const probe = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(
      new Response(null, { headers: { 'x-ray-mock': 'active' } }),
    )
  const { registerApiMock } = await import('@/mocks/register')

  registerApiMock()
  const guard = installGuard.mock.calls[0]![0]
  const url = 'http://localhost/ray-template/api/admin/auth/login'

  await expect(guard(url)).rejects.toThrow('offline')
  expect(probe).not.toHaveBeenCalled()
  await expect(guard(url)).resolves.toBeUndefined()
  expect(probe).toHaveBeenCalledOnce()
  expect(worker.stop).toHaveBeenCalledOnce()
  expect(worker.start).toHaveBeenCalledTimes(2)
  expect(setupWorker).toHaveBeenCalledOnce()
})
