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

export const buildPrintableTable = (
  doc: Document,
  columns: DataTableColumn[],
  rows: Record<string, unknown>[],
  { formatHeader, formatCell }: TableProPrintOptions = {},
) => {
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

const cloneRegion = (target: HTMLElement) => {
  const clone = target.cloneNode(true) as HTMLElement

  clone
    .querySelectorAll('script, iframe, object, embed, link, base, meta')
    .forEach((node) => node.remove())

  for (const node of [clone, ...clone.querySelectorAll('*')]) {
    for (const name of node.getAttributeNames()) {
      if (name.startsWith('on')) node.removeAttribute(name)
    }
  }

  return clone
}

export const resolvePrintContent = (
  options: TableProPrintOptions,
  defaultTable: () => HTMLElement | null,
) => {
  if (options.target == null) return defaultTable()

  const target = unrefElement(options.target)

  return target instanceof HTMLElement ? cloneRegion(target) : null
}

export const printTableContent = async (
  content: HTMLElement,
  options: TableProPrintOptions,
) => {
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

    doc.documentElement.lang = document.documentElement.lang
    doc.title = options.title ?? ''
    const style = doc.createElement('style')

    style.textContent = printStyles + (options.style ?? '')
    doc.head.append(style)
    doc.body.append(content)

    const images = [...doc.images]

    if (images.length) {
      let imageTimer: ReturnType<typeof setTimeout> | undefined

      await Promise.race([
        Promise.allSettled(images.map((img) => img.decode())),
        new Promise<void>((resolve) => {
          imageTimer = setTimeout(resolve, 1500)
        }),
      ]).finally(() => clearTimeout(imageTimer))
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
