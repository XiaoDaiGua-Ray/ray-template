import { iconSprites } from '@ray-template/icons/manifest'
import { inlineTableSvgUses } from '../../packages/ui/src/RTablePro/src/image-svg'

const sprite =
  '<svg xmlns="http://www.w3.org/2000/svg"><symbol id="icon-action/copy-image" viewBox="0 0 48 48" fill="none"><g id="shared-group"><path id="shared-path" d="M4 4h40v40H4z" stroke="currentColor" stroke-width="3" onload="throw 1" /></g></symbol></svg>'
const response = (source = sprite) =>
  new Response(source, { headers: { 'Content-Type': 'image/svg+xml' } })

afterEach(() => {
  document.querySelectorAll('[data-svg-test]').forEach((node) => node.remove())
  vi.unstubAllGlobals()
})

it('inlines repeated registered sprites once, retaining viewport/color without copied IDs or source mutations', async () => {
  const fetchAsset = vi.fn(async () => response())

  vi.stubGlobal('fetch', fetchAsset)
  const source = document.createElement('div')

  source.setAttribute('data-svg-test', '')
  source.innerHTML = `<svg style="color: red; width: 24px; height: 24px"><use href="${iconSprites.action}#icon-action/copy-image" width="24" height="24" /></svg><svg style="color: blue; width: 18px; height: 18px"><use href="${iconSprites.action}#icon-action/copy-image" width="18" height="18" /></svg>`
  document.body.append(source)
  const clone = source.cloneNode(true) as HTMLElement

  document.body.append(clone)
  const colors = Array.from(
    clone.querySelectorAll('use'),
    (use) => getComputedStyle(use).color,
  )

  await inlineTableSvgUses(clone, new AbortController().signal)
  expect(fetchAsset).toHaveBeenCalledOnce()
  expect(fetchAsset.mock.calls[0]).toEqual([
    new URL(iconSprites.action, document.baseURI).href,
    expect.objectContaining({
      credentials: 'omit',
      redirect: 'error',
      mode: 'same-origin',
      signal: expect.any(AbortSignal),
    }),
  ])
  expect(clone.querySelector('use, [id], [onload]')).toBeNull()
  expect(clone.querySelectorAll('path')).toHaveLength(2)
  const vectors = clone.querySelectorAll('svg svg')

  expect(vectors[0].getAttribute('viewBox')).toBe('0 0 48 48')
  expect(vectors[0].getAttribute('width')).toBe('24')
  expect(vectors[1].getAttribute('width')).toBe('18')
  expect(vectors[0].parentElement!.style.color).toBe(colors[0])
  expect(vectors[1].parentElement!.style.color).toBe(colors[1])
  expect(clone.querySelector('path')!.getAttribute('stroke')).toBe(
    'currentColor',
  )
  expect(source.querySelectorAll('use')).toHaveLength(2)
  expect(source.querySelector('path')).toBeNull()
})

it('resolves local symbols outside the captured region without a fetch', async () => {
  const fetchAsset = vi.fn()

  vi.stubGlobal('fetch', fetchAsset)
  const definitions = document.createElement('div')

  definitions.setAttribute('data-svg-test', '')
  definitions.innerHTML =
    '<svg><symbol id="local-capture-symbol" viewBox="0 0 16 16"><rect id="local-rect" width="16" height="16" fill="currentColor" /></symbol></svg>'
  const clone = document.createElement('div')

  clone.setAttribute('data-svg-test', '')
  clone.innerHTML =
    '<svg width="16" height="16"><use href="#local-capture-symbol" /></svg>'
  document.body.append(definitions, clone)

  await inlineTableSvgUses(clone, new AbortController().signal)
  expect(fetchAsset).not.toHaveBeenCalled()
  expect(clone.querySelector('rect')).not.toBeNull()
  expect(clone.querySelector('use, [id]')).toBeNull()
  expect(clone.querySelector('svg svg')!.getAttribute('viewBox')).toBe(
    '0 0 16 16',
  )
  expect(document.getElementById('local-capture-symbol')).not.toBeNull()
})

it.each(['https://outside.example/sprite.svg', '/api/admin/private'])(
  'rejects an unrelated source %s without fetching it',
  async (url) => {
    const fetchAsset = vi.fn()

    vi.stubGlobal('fetch', fetchAsset)
    const clone = document.createElement('div')

    clone.innerHTML = `<svg><use href="${url}#icon" /></svg>`
    await expect(
      inlineTableSvgUses(clone, new AbortController().signal),
    ).rejects.toThrow('same-origin public assets')
    expect(fetchAsset).not.toHaveBeenCalled()
  },
)

it.each([
  '<script>window.alert(1)</script>',
  '<foreignObject><div xmlns="http://www.w3.org/1999/xhtml">Active HTML</div></foreignObject>',
  '<image href="https://outside.example/image.png" />',
  '<path fill="url(https://outside.example/paint.svg#paint)" d="M0 0h1" />',
  '<path fill="var(--paint)" d="M0 0h1" />',
  '<path style="fill: attr(data-paint)" d="M0 0h1" />',
  '<path fill="u\\72l(https://outside.example/paint.svg#paint)" d="M0 0h1" />',
])(
  'rejects non-static SVG content before inserting it into the snapshot',
  async (content) => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        response(
          `<svg xmlns="http://www.w3.org/2000/svg"><symbol id="icon">${content}</symbol></svg>`,
        ),
      ),
    )
    const clone = document.createElement('div')

    clone.setAttribute('data-svg-test', '')
    clone.innerHTML = '<svg><use href="/public/sprite.svg#icon" /></svg>'
    document.body.append(clone)
    await expect(
      inlineTableSvgUses(clone, new AbortController().signal),
    ).rejects.toThrow()
    expect(clone.querySelector('script, foreignObject, image, path')).toBeNull()
  },
)

it('bounds streamed source size and forwards cancellation to sprite fetches', async () => {
  const clone = document.createElement('div')

  clone.innerHTML = '<svg><use href="/public/sprite.svg#icon" /></svg>'
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => response('x'.repeat(1024 * 1024 + 1))),
  )
  await expect(
    inlineTableSvgUses(clone, new AbortController().signal),
  ).rejects.toThrow('too large')

  const controller = new AbortController()
  const fetchAsset = vi.fn(
    (_url: string, options: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        options.signal!.addEventListener(
          'abort',
          () => reject(new DOMException('Cancelled', 'AbortError')),
          { once: true },
        )
      }),
  )

  vi.stubGlobal('fetch', fetchAsset)
  const pending = inlineTableSvgUses(clone, controller.signal)

  controller.abort()
  await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
  expect(fetchAsset.mock.calls[0][1].signal).toBe(controller.signal)
})
