import { createMockConnection } from '@/mocks/connection'

it('does not restart a healthy worker', async () => {
  const restart = vi.fn(async () => {})

  await createMockConnection(async () => true, restart)()
  expect(restart).not.toHaveBeenCalled()
})

it('recovers once for concurrent requests after the worker loses its client state', async () => {
  let ready = false
  const restart = vi.fn(async () => {
    ready = true
  })
  const ensure = createMockConnection(async () => ready, restart)

  await Promise.all([ensure(), ensure(), ensure()])
  expect(restart).toHaveBeenCalledTimes(1)
  await ensure()
  expect(restart).toHaveBeenCalledTimes(1)
})

it('blocks business traffic when recovery fails, then allows a later retry', async () => {
  let available = false
  const ensure = createMockConnection(
    async () => available,
    async () => {},
  )
  const write = vi.fn()

  await expect(ensure().then(write)).rejects.toThrow(
    'Mock connection could not be restored',
  )
  expect(write).not.toHaveBeenCalled()
  available = true
  await ensure().then(write)
  expect(write).toHaveBeenCalledTimes(1)
})
