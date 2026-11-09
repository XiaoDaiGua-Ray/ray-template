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

afterEach(() => vi.restoreAllMocks())

it('restarts the same MSW client across repeated and concurrent recoveries', async () => {
  const worker = { start: vi.fn(async () => {}), stop: vi.fn() }

  setupWorker.mockReturnValue(worker)

  const { enableApiMock } = await import('@/mocks/browser')

  await Promise.all([enableApiMock(), enableApiMock()])
  expect(installGuard).toHaveBeenCalledOnce()
  expect(worker.start).toHaveBeenCalledWith(
    expect.objectContaining({
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js?v=${mswVersion}`,
        options: { scope: import.meta.env.BASE_URL },
      },
    }),
  )

  const guard = installGuard.mock.calls[0]![0]
  const probe = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(
      new Response(null, { headers: { 'x-ray-mock': 'active' } }),
    )

  await guard('http://localhost/unrelated')
  expect(probe).not.toHaveBeenCalled()

  for (let attempt = 0; attempt < 2; attempt++) {
    probe.mockResolvedValueOnce(new Response(null, { status: 404 }))
    await Promise.all([
      guard('http://localhost/ray-template/api/admin/demo/people'),
      guard('http://localhost/ray-template/api/admin/demo/search-options'),
    ])
  }

  expect(worker.stop).toHaveBeenCalledTimes(2)
  expect(worker.start).toHaveBeenCalledTimes(3)
  expect(probe).toHaveBeenCalledTimes(4)
  expect(setupWorker).toHaveBeenCalledOnce()
})
