import type { RTableInst, TableProps } from '@/components'
import type { UsePaginationOptions } from '@/hooks'
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

export interface BasePagination {
  page: number
  pageSize: number
  itemCount: number
}

/**
 *
 * @description
 * Pagination 分页配置。
 */
export type TablePagination = BasePagination

export type TablePaginationUpdate = (
  pagination: Readonly<TablePagination>,
) => void

export type PaginationPrefix = UsePaginationOptions['prefix']

export interface TableRequestConfig<
  Params = Recordable,
  ExcludeParams extends keyof Params = keyof Params,
> {
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
  /**
   *
   * @description
   * 排除的请求参数，该字段用于排除请求参数。
   *
   * @default undefined
   */
  excludeParams?: ExcludeParams[]
  /**
   *
   * @description
   * 是否自动移除重复的请求参数。
   *
   * @default true
   */
  autoDeleteDuplicateKeys?: boolean
}

export type TableProProps = Omit<TableProps, 'pagination'>

export interface TableProInst extends Omit<RTableInst, 'getTableInstance'> {
  /**
   *
   * @description
   * 获取 pagination 更新值。
   *
   * @example
   * const [register, { getTablePagination }] = useTablePro()
   *
   * // 获取当前 pagination 的值
   * const pagination = getTablePagination()
   */
  getTablePagination: () => TablePagination
  /**
   *
   * @param extraConfig 额外请求合并配置项
   * @param reset 是否重置分页请求
   *
   * @description
   * 手动触发表格请求，用于手动刷新表格。
   *
   * @example
   * const [register, { runTableRequest }] = useTablePro()
   *
   * // 重置分页请求
   * runTableRequest(void 0, true)
   * runTableRequest()
   * // 不重置分页请求
   * runTableRequest(void 0, false)
   */
  runTableRequest: <
    T extends Recordable,
    ExcludeParams extends keyof T = keyof T,
  >(
    extraConfig?: TableRequestConfig<T, ExcludeParams>,
    reset?: boolean,
  ) => void
  /**
   *
   * @param extraConfig 额外请求合并配置项
   * @param reset 是否重置分页请求
   *
   * @description
   * 异步手动触发表格请求，用于手动刷新表格。
   *
   * @example
   * const [register, { runAsyncTableRequest }] = useTablePro()
   *
   * // 重置分页请求
   * runAsyncTableRequest(void 0, true)
   * runAsyncTableRequest()
   * // 不重置分页请求
   * runAsyncTableRequest(void 0, false)
   */
  runAsyncTableRequest: <
    T extends Recordable,
    ExcludeParams extends keyof T = keyof T,
  >(
    extraConfig?: TableRequestConfig<T, ExcludeParams>,
    reset?: boolean,
  ) => Promise<void>
  /**
   *
   * @param extraConfig 额外请求合并配置项
   *
   * @description
   * 获取当前内部表格请求参数。
   *
   * @example
   * const [register, { getCurrentTableRequestParams }] = useTablePro()
   *
   * // 获取当前内部表格请求参数
   * const params = getCurrentTableRequestParams()
   */
  getCurrentTableRequestParams: <
    T extends Recordable,
    ExcludeParams extends keyof T = keyof T,
  >(
    extraConfig?: TableRequestConfig<T, ExcludeParams>,
  ) => TableRequestConfig<T, ExcludeParams>['params'] & Recordable
  /**
   *
   * @description
   * 重置表格分页。
   *
   * @example
   * const [register, { resetTablePagination }] = useTablePro()
   *
   * // 重置表格分页为初始化状态，即第 1 页，每页 10 条数据
   * resetTablePagination()
   */
  resetTablePagination: () => void
  /**
   *
   * @description
   * 设置表格分页页码。
   *
   * @example
   * const [register, { setPage }] = useTablePro()
   *
   * // 设置表格分页页码为 2
   * setPage(2)
   */
  setPage: (page: number) => void
  /**
   *
   * @description
   * 设置表格分页每页条数。
   *
   * @example
   * const [register, { setPageSize }] = useTablePro()
   *
   * // 设置表格分页每页条数为 20
   * setPageSize(20)
   */
  setPageSize: (pageSize: number) => void
  /**
   *
   * @description
   * 获取表格分页页码。
   *
   * @example
   * const [register, { getPage }] = useTablePro()
   *
   * // 获取表格分页页码
   * const page = getPage()
   */
  getPage: () => number
  /**
   *
   * @description
   * 获取表格分页每页条数。
   *
   * @example
   * const [register, { getPageSize }] = useTablePro()
   *
   * // 获取表格分页每页条数
   * const pageSize = getPageSize()
   */
  getPageSize: () => number
}

export interface TableProFieldNames {
  /**
   *
   * @description
   * 分页器页码字段。
   *
   * @default 'page'
   */
  page: string
  /**
   *
   * @description
   * 分页器每页条数字段。
   *
   * @default 'pageSize'
   */
  pageSize: string
  /**
   *
   * @description
   * 分页器总条数字段。
   *
   * @default 'itemCount'
   */
  itemCount: string
}
