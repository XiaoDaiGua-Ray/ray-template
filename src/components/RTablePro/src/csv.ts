import { get } from 'lodash-es'
import type { DataTableColumn, DataTableProps } from 'naive-ui'
import { getLeafColumns } from './columns'

const encodeCell = (value: unknown) => {
  const text = value == null ? '' : String(value)
  const formula =
    typeof value !== 'number' &&
    typeof value !== 'bigint' &&
    /^[\s\uFEFF]*[=+\-@＝＋－＠]|^[\t\r\n]/u.test(text)

  return `"${formula ? "'" : ''}${text.replaceAll('"', '""')}"`
}

export const buildTableCsv = (
  columns: DataTableColumn[],
  data: Record<string, unknown>[],
  getCell?: DataTableProps['getCsvCell'],
  getHeader?: DataTableProps['getCsvHeader'],
) => {
  const leaves = getLeafColumns(columns).filter(
    (column) => column.allowExport !== false,
  )
  const header = leaves
    .map((column) =>
      encodeCell(
        getHeader?.(column) ??
          (typeof column.title === 'string' ? column.title : column.key),
      ),
    )
    .join(',')

  return [
    header,
    ...data.map((row) =>
      leaves
        .map((column) => {
          const value = get(row, column.key)

          return encodeCell(getCell ? getCell(value, row, column) : value)
        })
        .join(','),
    ),
  ].join('\r\n')
}

export const downloadTableCsv = (csv: string, fileName = 'data.csv') => {
  const url = URL.createObjectURL(
    new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }),
  )
  const link = document.createElement('a')

  link.href = url
  link.download = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`
  document.body.append(link)

  try {
    link.click()
  } finally {
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }
}
