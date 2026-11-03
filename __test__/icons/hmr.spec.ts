// @vitest-environment node
import { EventEmitter } from 'node:events'
import { join } from 'node:path'
import type { ViteDevServer } from 'vite'
import { iconManifestPlugin } from '../../vite-helper/icons'

const { generate, scan } = vi.hoisted(() => ({
  generate: vi.fn<() => Promise<void>>(),
  scan: vi.fn<() => string[]>(),
}))

vi.mock('../../scripts/icons.mjs', () => ({
  iconsRoot: '/ray/src/icons',
  generateIcons: generate,
  scanIcons: scan,
}))

function createServer() {
  return {
    watcher: Object.assign(new EventEmitter(), { add: vi.fn() }),
    httpServer: new EventEmitter(),
    config: { logger: { error: vi.fn() } },
    ws: { send: vi.fn() },
    restart: vi.fn<() => Promise<void>>().mockResolvedValue(void 0),
  }
}

function configure() {
  const plugin = iconManifestPlugin(['action'])
  const server = createServer()
  const configureServer = plugin.configureServer as (
    server: ViteDevServer,
  ) => void

  configureServer(server as unknown as ViteDevServer)

  return { plugin, server }
}

beforeEach(() => {
  generate.mockReset().mockResolvedValue(void 0)
  scan.mockReset().mockReturnValue(['action/close'])
})

it('synchronizes at build start before modules are bundled', async () => {
  const hook = iconManifestPlugin(['action']).buildStart as () => Promise<void>

  await hook()
  expect(generate).toHaveBeenCalledOnce()
})

it.each(['add', 'change', 'unlink'])(
  'synchronizes SVG %s events without restarting an existing package',
  async (event) => {
    const { server } = configure()

    server.watcher.emit(event, join('/ray/src/icons', 'action/close.svg'))
    await vi.waitFor(() => expect(generate).toHaveBeenCalledOnce())
    expect(server.restart).not.toHaveBeenCalled()
    server.httpServer.emit('close')
  },
)

it('rebuilds package configuration before generation and discards disposed work', async () => {
  const { plugin, server } = configure()
  const stages: string[] = []
  const buildStart = plugin.buildStart as () => Promise<void>

  generate.mockImplementation(async () => {
    stages.push('generate')
  })

  scan.mockReturnValue(['action/close', 'business/new'])
  server.restart.mockImplementation(async () => {
    stages.push('close')
    server.httpServer.emit('close')
    await buildStart()
  })
  server.watcher.emit('add', '/ray/src/icons/business/new.svg')
  server.watcher.emit('add', '/ray/src/icons/business/another.svg')
  await vi.waitFor(() => expect(server.restart).toHaveBeenCalledOnce())
  expect(generate).toHaveBeenCalledOnce()
  expect(stages).toEqual(['close', 'generate'])
  expect(server.ws.send).toHaveBeenCalledWith({
    type: 'full-reload',
    path: '*',
  })
  expect(server.watcher.listenerCount('change')).toBe(0)
})

it('shows generation errors in the browser and continues handling later edits', async () => {
  const { server } = configure()

  generate.mockRejectedValueOnce(new Error('invalid icon path'))
  server.watcher.emit('change', '/ray/src/icons/action/close.svg')
  await vi.waitFor(() =>
    expect(server.ws.send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        err: expect.objectContaining({ message: 'invalid icon path' }),
      }),
    ),
  )
  server.watcher.emit('change', '/ray/src/icons/action/close.svg')
  await vi.waitFor(() => expect(generate).toHaveBeenCalledTimes(2))
  server.httpServer.emit('close')
})
