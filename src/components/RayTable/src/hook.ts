import type { ExportExcelHeader } from './type'
import type { DataTableColumns } from 'naive-ui'

export const setupExportHeader = (columns: ExportExcelHeader[]) => {
  const header = columns.reduce((pre, curr) => {
    pre[curr.key] = curr.title

    return pre
  }, {} as ExportExcelHeader)

  return header
}
