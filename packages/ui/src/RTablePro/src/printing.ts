import { unrefElement } from '@ray-template/composables/vue/unref-element'
import { get } from 'lodash-es'
import type { DataTableColumn } from 'naive-ui'
import { getLeafColumns, hasColumnKey } from './columns'
import type { TableProPrintOptions } from './types'

const printStyles = `
  @page { margin: 12mm; }
  :root { color-scheme: light; }
  body { margin: 0; background: white; color: #171717; font: 9pt/1.4 system-ui, sans-serif; }
  table { width: 100%; border-collapse: collapse; }
  thead { display: table-header-group; }
  tr { break-inside: avoid; }
  th, td { padding: 3pt 5pt; border: 1px solid #b7bec6; text-align: start; overflow-wrap: anywhere; vertical-align: top; }
  th { font-weight: 650; background: #f1f3f5; word-break: keep-all; overflow-wrap: break-word; }
  img, svg { max-width: 100%; }
  [data-print-ignore] { display: none !important; }
`

const displayText = (value: unknown): string => {
  if (value == null) return ''

  if (Array.isArray(value)) return value.map(displayText).join(', ')

  if (value instanceof Date) return value.toLocaleString()

  return ['string', 'number', 'boolean', 'bigint'].includes(typeof value)
    ? String(value)
    : ''
}

/**
 *
 * @param doc 打印表格所属文档
 * @param columns 当前可见列
 * @param rows 当前页数据快照
 * @param options 表头与单元格格式化选项
 *
 * @description
 * 生成保留分组表头的独立表格，文本通过 textContent 写入，不执行数据中的 HTML。
 *
 * @returns 尚未插入文档的表格元素
 */
export const buildPrintableTable = (
  doc: Document,
  columns: DataTableColumn[],
  rows: Record<string, unknown>[],
  options: TableProPrintOptions = {},
) => {
  const { formatHeader, formatCell } = options
  const table = doc.createElement('table')
  const leaves = getLeafColumns(columns)
  const header = table.createTHead()
  const depth = (items: DataTableColumn[]): number =>
    Math.max(
      0,
      ...items
        .filter(hasColumnKey)
        .map((column) =>
          'children' in column
            ? getLeafColumns(column.children).length
              ? 1 + depth(column.children)
              : 0
            : 1,
        ),
    )
  const headers = Array.from({ length: depth(columns) }, () =>
    header.insertRow(),
  )

  const appendHeaders = (items: DataTableColumn[], level: number) => {
    for (const column of items.filter(hasColumnKey)) {
      const children =
        'children' in column ? getLeafColumns(column.children) : null

      if (children && !children.length) continue

      const cell = doc.createElement('th')

      cell.textContent =
        (children
          ? void 0
          : formatHeader?.(column as (typeof leaves)[number])) ??
        (typeof column.title === 'string' ? column.title : String(column.key))

      if ('children' in column) {
        cell.colSpan = children!.length
        cell.scope = 'colgroup'
        appendHeaders(column.children, level + 1)
      } else {
        cell.rowSpan = headers.length - level
        cell.scope = 'col'
      }

      headers[level].append(cell)
    }
  }

  appendHeaders(columns, 0)
  const body = table.createTBody()

  for (const row of rows) {
    const tr = body.insertRow()

    for (const column of leaves) {
      const value = get(row, column.key)

      tr.insertCell().textContent =
        formatCell?.(value, row, column) ?? displayText(value)
    }
  }

  return table
}

const omittedElements = 'script, iframe, object, embed, link, base, meta'

const cloneRegion = (target: HTMLElement) => {
  if (target.matches(omittedElements)) return null

  const clone = target.cloneNode(true) as HTMLElement
  const sources = [target, ...target.querySelectorAll('*')]
  const copies = [clone, ...clone.querySelectorAll('*')]

  for (const [index, node] of copies.entries()) {
    if (node.matches(omittedElements)) {
      node.remove()
      continue
    }

    for (const name of node.getAttributeNames()) {
      if (name.startsWith('on')) node.removeAttribute(name)
    }

    const source = sources[index]

    if (
      source instanceof HTMLInputElement &&
      node instanceof HTMLInputElement
    ) {
      node.value =
        source.type === 'password' || source.type === 'file' ? '' : source.value
      node.defaultValue = node.value
      node.checked = source.checked
      node.indeterminate = source.indeterminate
    } else if (
      source instanceof HTMLTextAreaElement &&
      node instanceof HTMLTextAreaElement
    ) {
      node.value = source.value
      node.defaultValue = source.value
    } else if (
      source instanceof HTMLOptionElement &&
      node instanceof HTMLOptionElement
    ) {
      node.selected = source.selected
      node.defaultSelected = source.selected
    } else if (
      source instanceof HTMLCanvasElement &&
      node instanceof HTMLCanvasElement
    ) {
      try {
        node.getContext('2d')?.drawImage(source, 0, 0)
      } catch {
        // 无法读取的画布仍保留尺寸和替代内容。
      }
    }
  }

  return clone
}

const copyStyleContext = (source: HTMLElement, destination: HTMLElement) => {
  destination.className = source.className
  destination.dir = source.dir

  for (const name of Array.from(source.style)) {
    if (name.startsWith('--'))
      destination.style.setProperty(name, source.style.getPropertyValue(name))
  }
}

const copyPageStyles = (source: Document, destination: Document) => {
  const base = destination.createElement('base')

  base.href = source.baseURI
  destination.head.append(base)
  copyStyleContext(source.documentElement, destination.documentElement)
  copyStyleContext(source.body, destination.body)

  const links: Promise<void>[] = []

  for (const stylesheet of source.querySelectorAll<
    HTMLStyleElement | HTMLLinkElement
  >('style, link[rel~="stylesheet"]')) {
    if (stylesheet.sheet?.disabled) continue

    if (stylesheet.tagName === 'LINK') {
      const link = stylesheet as HTMLLinkElement

      if (link.disabled) continue

      const copy = destination.createElement('link')

      copy.rel = 'stylesheet'
      copy.href = link.href
      copy.media = link.media

      if (link.crossOrigin !== null) copy.crossOrigin = link.crossOrigin

      if (link.integrity) copy.integrity = link.integrity

      if (link.referrerPolicy) copy.referrerPolicy = link.referrerPolicy

      links.push(
        new Promise<void>((resolve) => {
          copy.onload = () => resolve()
          copy.onerror = () => resolve()
        }),
      )
      destination.head.append(copy)
    } else {
      const style = stylesheet as HTMLStyleElement
      const copy = destination.createElement('style')

      copy.media = style.media

      if (style.nonce) copy.nonce = style.nonce

      copy.textContent = style.sheet
        ? Array.from(style.sheet.cssRules, (rule) => rule.cssText).join('\n')
        : style.textContent
      destination.head.append(copy)
    }
  }

  return links
}

/**
 *
 * @param options 可选打印目标与样式配置
 * @param defaultTable 未指定目标时创建默认表格的工厂
 *
 * @description
 * 自定义目标会复制为独立节点，并去除脚本、嵌入内容、内联事件与敏感表单值。
 *
 * @returns 可打印节点；目标不存在或不可打印时为 null
 */
export const resolvePrintContent = (
  options: TableProPrintOptions,
  defaultTable: () => HTMLElement | null,
) => {
  if (options.target == null) return defaultTable()

  const target = unrefElement(options.target)

  return target instanceof HTMLElement ? cloneRegion(target) : null
}

/**
 *
 * @param content 待插入打印 iframe 的独立内容节点
 * @param options 标题、样式及页面样式继承选项
 * @param signal 可选取消信号，只在调起浏览器打印前取消
 *
 * @description
 * 在沙箱 iframe 中等待图片、样式与字体（最多 2 秒），再调起浏览器打印。
 * iframe 在打印完成、失败或兜底超时后释放；返回成功只表示已请求打印。
 *
 * @returns 是否已调起浏览器打印，提前取消时为 false
 * @throws 文档不可用或浏览器打印调用失败时抛错
 */
export const printTableContent = async (
  content: HTMLElement,
  options: TableProPrintOptions,
  signal?: AbortSignal,
) => {
  if (signal?.aborted) return false

  const source = content.ownerDocument
  const frame = document.createElement('iframe')

  frame.tabIndex = -1
  frame.setAttribute('sandbox', 'allow-same-origin allow-modals')
  frame.setAttribute('aria-hidden', 'true')
  frame.title = options.title || 'TablePro print'
  frame.style.cssText = 'position:fixed;inset:0;width:0;height:0;border:0;'
  document.body.append(frame)

  let cleanupTimer: ReturnType<typeof setTimeout> | undefined
  const cleanup = () => {
    clearTimeout(cleanupTimer)
    frame.remove()
  }

  try {
    const doc = frame.contentDocument
    const view = frame.contentWindow

    if (!doc || !view) throw new Error('Print document is unavailable.')

    doc.documentElement.lang = source.documentElement.lang
    doc.title = options.title ?? ''
    const links =
      options.target != null && options.includePageStyles !== false
        ? copyPageStyles(source, doc)
        : []
    const style = doc.createElement('style')

    style.textContent = printStyles + (options.style ?? '')
    doc.head.append(style)
    doc.body.append(content)

    let assetTimer: ReturnType<typeof setTimeout> | undefined
    const cancelAssets = Promise.withResolvers<void>()
    const stopWaiting = () => cancelAssets.resolve()

    signal?.addEventListener('abort', stopWaiting, { once: true })

    try {
      const images = Array.from(doc.querySelectorAll('img'), (img) => {
        img.loading = 'eager'

        return img.decode()
      })
      const stylesAndFonts = Promise.all(links).then(async () => {
        await doc.fonts?.ready
      })

      await Promise.race([
        Promise.allSettled([...images, stylesAndFonts]),
        cancelAssets.promise,
        new Promise<void>((resolve) => {
          assetTimer = setTimeout(resolve, 2000)
        }),
      ])
    } finally {
      clearTimeout(assetTimer)
      signal?.removeEventListener('abort', stopWaiting)
    }

    if (signal?.aborted) {
      cleanup()

      return false
    }

    view.addEventListener('afterprint', cleanup, { once: true })
    // 浏览器未派发 afterprint 时，兜底释放打印文档。
    cleanupTimer = setTimeout(cleanup, 120_000)
    view.focus()
    view.print()

    return true
  } catch (error) {
    cleanup()
    throw error
  }
}
