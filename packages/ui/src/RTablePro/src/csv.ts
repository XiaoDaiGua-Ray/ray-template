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

/**
 *
 * @param columns 当前可见列
 * @param data 要导出的数据快照
 * @param getCell 可选单元格格式化函数
 * @param getHeader 可选表头格式化函数
 *
 * @description
 * 只导出允许导出的叶子列，统一转义引号并防护文本型公式注入，不修改输入数据。
 *
 * @returns 使用 CRLF 换行的 CSV 文本
 */
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

/**
 *
 * @param csv 已编码的 CSV 文本
 * @param fileName 下载文件名，缺少 .csv 时补齐
 *
 * @description
 * 添加 UTF-8 BOM 并触发浏览器下载，随后释放临时链接和对象 URL。
 */
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
