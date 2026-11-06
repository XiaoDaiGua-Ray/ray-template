import { iconSprites } from '@ray-template/icons/manifest'

const SVG_NS = 'http://www.w3.org/2000/svg'
const XLINK_NS = 'http://www.w3.org/1999/xlink'
const MAX_SPRITE_BYTES = 1024 * 1024
const MAX_SPRITE_SOURCES = 16
const vectorTags = new Set([
  'svg',
  'symbol',
  'g',
  'path',
  'rect',
  'circle',
  'ellipse',
  'line',
  'polyline',
  'polygon',
  'title',
  'desc',
])
const presentation = [
  'color',
  'fill',
  'fill-opacity',
  'fill-rule',
  'stroke',
  'stroke-width',
  'stroke-opacity',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-dasharray',
  'stroke-dashoffset',
  'opacity',
  'vector-effect',
  'paint-order',
  'display',
  'visibility',
  'transform',
  'transform-origin',
]
const vectorAttributes = new Set([
  ...presentation,
  'viewBox',
  'preserveAspectRatio',
  'x',
  'y',
  'x1',
  'x2',
  'y1',
  'y2',
  'width',
  'height',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'd',
  'points',
  'pathLength',
])

const safeValue = (value: string) => {
  // 静态矢量不依赖外部资源或 paint server，避免内联后引入新的请求与 ID 引用。
  if (/(?:url|var|env|attr)\s*\(|\\|\/\*/i.test(value))
    throw new Error(
      '[TablePro] Resource-dependent SVG values are not supported in snapshots.',
    )

  return value
}

/**
 *
 * @param source 已验证来源的静态 SVG 节点
 * @param document 快照所属文档
 * @param depth 当前矢量嵌套深度
 *
 * @description
 * 只复制静态几何和呈现属性；不复制 ID、事件、链接或任意样式规则。
 *
 * @returns 独立的安全矢量节点
 * @throws 非静态元素、URL 绘制依赖或过深结构出现时抛错
 */
function copyVector(
  source: Element,
  document: Document,
  depth = 0,
): SVGElement {
  if (
    source.namespaceURI !== SVG_NS ||
    !vectorTags.has(source.localName) ||
    depth > 32
  )
    throw new Error('[TablePro] Only static SVG vectors can be copied.')

  const node = document.createElementNS(
    SVG_NS,
    source.localName === 'symbol' ? 'svg' : source.localName,
  )

  for (const attribute of Array.from(source.attributes)) {
    if (vectorAttributes.has(attribute.name))
      node.setAttribute(attribute.name, safeValue(attribute.value))
  }

  const style = (source as SVGElement).style

  safeValue(source.getAttribute('style') ?? '')

  for (const property of presentation) {
    const value = style?.getPropertyValue(property)

    if (value) node.style.setProperty(property, safeValue(value))
  }

  for (const child of Array.from(source.childNodes)) {
    if (child.nodeType === Node.ELEMENT_NODE)
      node.append(copyVector(child as Element, document, depth + 1))
    else if (child.nodeType === Node.TEXT_NODE)
      node.append(document.createTextNode(child.textContent ?? ''))
  }

  return node
}

/**
 *
 * @param url 同源公共 SVG 资源地址
 * @param signal 截图取消信号
 *
 * @returns 有大小上限的 SVG XML 文档
 * @throws 请求、大小限制或 XML 校验失败时拒绝
 */
async function fetchSprite(url: string, signal: AbortSignal) {
  const response = await fetch(url, {
    signal,
    credentials: 'omit',
    redirect: 'error',
    mode: 'same-origin',
    cache: 'force-cache',
    headers: { Accept: 'image/svg+xml' },
  })

  if (
    !response.ok ||
    !response.body ||
    Number(response.headers.get('content-length')) > MAX_SPRITE_BYTES
  )
    throw new Error('[TablePro] The SVG sprite could not be read.')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  const chunks: string[] = []
  let size = 0

  try {
    while (true) {
      signal.throwIfAborted()
      const { value, done } = await reader.read()

      if (done) break

      size += value.byteLength

      if (size > MAX_SPRITE_BYTES)
        throw new Error('[TablePro] The SVG sprite is too large.')

      chunks.push(decoder.decode(value, { stream: true }))
    }
  } finally {
    await reader.cancel().catch(() => {})
    reader.releaseLock()
  }

  chunks.push(decoder.decode())
  const source = chunks.join('')

  if (
    /<!DOCTYPE/i.test(source) ||
    (source.match(/<[A-Za-z]/g)?.length ?? 0) > 10_000
  )
    throw new Error(
      '[TablePro] The SVG sprite is not a bounded static document.',
    )

  const document = new DOMParser().parseFromString(source, 'image/svg+xml')

  if (
    document.querySelector('parsererror') ||
    document.documentElement.namespaceURI !== SVG_NS ||
    document.documentElement.localName !== 'svg'
  )
    throw new Error('[TablePro] Invalid SVG sprite document.')

  return document
}

/**
 *
 * @param snapshot 已连接但不可交互的截图副本
 * @param signal 截图取消信号
 *
 * @description
 * 将 RIcon 精灵图和本地 symbol 引用展开为独立静态 SVG，每次截图内合并同源资源请求。
 * 只处理注册精灵图或 .svg 公共文件，不携带凭据或追随重定向；原页面节点保持不变。
 *
 * @throws 来源、符号、静态矢量或资源限制不满足时拒绝，不继续生成缺图 PNG
 */
export async function inlineTableSvgUses(
  snapshot: HTMLElement,
  signal: AbortSignal,
) {
  const document = snapshot.ownerDocument
  const page = new URL(document.URL)

  page.hash = ''
  const registered = new Set(
    Object.values(iconSprites).map(
      (path) => new URL(path, document.baseURI).href,
    ),
  )
  const sources = new Map<string, Promise<Document>>()

  await Promise.all(
    Array.from(snapshot.querySelectorAll<SVGUseElement>('use'), async (use) => {
      signal.throwIfAborted()
      const href =
        use.getAttribute('href') ?? use.getAttributeNS(XLINK_NS, 'href')

      if (!href) return

      const url = new URL(href, document.baseURI)
      const id = decodeURIComponent(url.hash.slice(1))

      url.hash = ''

      if (!id) throw new Error('[TablePro] SVG references require a symbol ID.')

      let source: Document

      if (href.startsWith('#') || url.href === page.href) source = document
      else {
        if (
          url.origin !== page.origin ||
          !['http:', 'https:'].includes(url.protocol) ||
          url.username ||
          url.password ||
          (!registered.has(url.href) &&
            !url.pathname.toLowerCase().endsWith('.svg'))
        )
          throw new Error(
            '[TablePro] SVG sprites must be same-origin public assets.',
          )

        let request = sources.get(url.href)

        if (!request) {
          if (sources.size >= MAX_SPRITE_SOURCES)
            throw new Error('[TablePro] Too many SVG sprite sources.')

          request = fetchSprite(url.href, signal)
          sources.set(url.href, request)
        }

        source = await request
      }

      signal.throwIfAborted()
      const symbol = source.getElementById(id)

      if (!symbol) throw new Error('[TablePro] The SVG symbol does not exist.')

      const vector = copyVector(symbol, document)
      const group = document.createElementNS(SVG_NS, 'g')
      const style = document.defaultView!.getComputedStyle(use)

      for (const property of presentation) {
        const value = style.getPropertyValue(property)

        if (value) group.style.setProperty(property, safeValue(value))
      }

      const viewport =
        vector.localName === 'svg'
          ? vector
          : document.createElementNS(SVG_NS, 'svg')

      if (viewport !== vector) {
        viewport.style.overflow = 'visible'
        viewport.append(vector)
      }

      for (const name of ['x', 'y', 'width', 'height']) {
        const value = use.getAttribute(name) ?? style.getPropertyValue(name)

        if (value && value !== 'auto') viewport.setAttribute(name, value)
        else if (name === 'width' || name === 'height')
          viewport.setAttribute(name, '100%')
      }

      group.append(viewport)
      use.replaceWith(group)
    }),
  )
}
