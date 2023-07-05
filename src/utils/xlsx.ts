/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-01-15
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { utils, writeFileXLSX } from 'xlsx'
import dayjs from 'dayjs'

import type { DataTableBaseColumn } from 'naive-ui'
import type { Range, WorkSheet } from 'xlsx'

export interface ExportExcelHeader extends DataTableBaseColumn {}

export type RowData = Record<string, unknown>

export interface ExportXLSXConfig {
  filename?: string
}

/**
 *
 * @param columns table columns
 * @returns 处理后的表头
 */
const setupSheetHeader = (columns: ExportExcelHeader[]) => {
  const header = columns.reduce((pre, curr) => {
    pre[curr.key] = curr.title

    return pre
  }, {} as ExportExcelHeader)

  return header
}

/**
 *
 * @param range table range
 * @param sheetData sheet data
 * @param sheetHeader table header
 *
 * @remark 替换表头
 * @remark 由于暂未想到更好的方法, 如果有好的想法可以戳我
 */
const transformSheetHeader = (
  range: Range,
  sheetData: WorkSheet,
  sheetHeader: ExportExcelHeader,
) => {
  for (let c = range.s.c; c <= range.e.c; c++) {
    const header = utils.encode_col(c) + '1'

    sheetData[header].v = sheetHeader[sheetData[header].v]
  }
}

/**
 *
 * @param dataSource 表格数据源
 * @param columns 表头
 * @param config xlsx 输出配置
 *
 * @remark 导出数据为 xlsx
 * @remark 如果不设置表头, 则会使用 dataSource 第一行数据为默认表头
 */
export const exportFileToXLSX = async (
  dataSource: RowData[],
  columns?: ExportExcelHeader[],
  config: ExportXLSXConfig = {},
) => {
  await new Promise<void>((resolve, reject) => {
    if (Array.isArray(dataSource)) {
      if (dataSource.length) {
        const sheetHeader = setupSheetHeader(columns ?? []) // 获取所有列(设置为 `excel` 表头)
        const sheetData = utils.json_to_sheet(dataSource) // 将所有数据转换为表格数据类型
        const workBook = utils.book_new()
        const filename = config.filename
          ? config.filename + '.xlsx'
          : dayjs().format('YYYY-MM-DD') + '导出表格.xlsx'

        utils.book_append_sheet(workBook, sheetData, 'Data')

        const range = utils.decode_range(sheetData['!ref'] as string) // 获取所有单元格

        if (columns?.length) {
          transformSheetHeader(range, sheetData, sheetHeader)
        }

        writeFileXLSX(workBook, filename) // 输出表格

        resolve()
      } else {
        resolve()
      }
    } else {
      reject()
    }
  })
}
