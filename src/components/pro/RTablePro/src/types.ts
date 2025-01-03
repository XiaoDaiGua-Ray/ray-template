import type { TableProps, RTableInst } from '@/components'
import type { UsePaginationReturn } from '@/hooks'
import type { Recordable } from '@/types'

export type FormatRangeTime = {
  /**
   *
   * @description
   * 请求参数中需要格式化的时间参数字段。
   */
  key: string | number
  /**
   *
   * @description
   * 后端接口中需要的起止时间参数字段。
   */
  target: [string | number, string | number]
}

/**
 *
 * @description
 * Pagination 分页配置。
 */
export type TablePagination = Pick<
  UsePaginationReturn[1],
  'getItemCount' | 'getPage' | 'getPageSize'
>

export interface TableRequestConfig<Params = Recordable> {
  /**
   *
   * @description
   * 请求参数。
   * @default undefined
   */
  params?: Params
  /**
   *
   * @description
   * 格式化时间范围，该字段用于格式化时间范围。
   * 并且仅支持 NDatePicker range 模式。
   * 如果在请求的参数中，有时间段的字段，且需要格式化时间段，则需要配置该字段。
   *
   * @default undefined
   */
  formatRangeTime?: FormatRangeTime[]
}

export type TableProProps = Omit<TableProps, 'pagination'>

export interface TableProInst extends Omit<RTableInst, 'getTableInstance'> {
  /**
   *
   * @description
   * 获取 pagination 更新值。
   */
  getTablePagination: () => TablePagination
  /**
   *
   * @description
   * 手动触发表格请求，用于手动刷新表格。
   */
  runTableRequest: (extraConfig?: TableRequestConfig) => void
  /**
   *
   * @param extraConfig 额外请求合并配置项
   *
   * @description
   * 获取当前内部表格请求参数。
   */
  getCurrentTableRequestParams: <T = Recordable>(
    extraConfig?: TableRequestConfig<T>,
  ) => TableRequestConfig<T>['params'] & Recordable
  /**
   *
   * @description
   * 重置表格分页。
   */
  resetTablePagination: () => void
}
