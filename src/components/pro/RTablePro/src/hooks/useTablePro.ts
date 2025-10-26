import { printDom } from '@/utils'

import type { Recordable } from '@/types'
import type { TableProInst, TableRequestConfig } from '../types'
import type {
  CsvOptionsType,
  FilterState,
  ScrollToOptions,
  ColumnKey,
  SortOrder,
} from '@/components/base/RTable/src/types'
import type { PrintDomOptions } from '@/utils'

/**
 *
 * @description
 * 获取 TablePro 实例上的一些方法。
 * 使用方法与 useTable 类似。
 */
export const useTablePro = () => {
  const tableInst = ref<TableProInst>()

  const register = (inst: TableProInst) => {
    if (inst) {
      tableInst.value = inst
    }
  }

  /**
   *
   * @description
   * 获取 TablePro 实例。
   */
  const getTableProInstance = () => {
    if (!tableInst.value) {
      throw new Error(
        '[useTablePro]: table instance is not ready yet. if you are using useTablePro, please make sure you have called register method in onRegister event.',
      )
    }

    return tableInst.value
  }

  /**
   *
   * @description
   * 获取 statistics, pagination 更新信息。
   */
  const getTablePagination = () =>
    getTableProInstance().getTablePagination.call(null)

  /**
   *
   * @param extraConfig 额外请求合并配置项
   * @param reset 是否重置分页请求
   *
   * @description
   * 手动触发表格请求，用于手动刷新表格。
   * 如果设置了 manual 为 true，则需要手动调用该函数。
   * 该函数会自动匹配 statistics, pagination 更新的值去请求。
   *
   * 允许手动配置 TableRequestConfig 参数，会自动合并 props tableRequestConfig 配置。
   * 并且，运行该函数会重置 pagination 为初始状态。
   */
  const runTableRequest = <
    T extends Recordable,
    ExcludeParams extends keyof T = keyof T,
  >(
    extraConfig?: TableRequestConfig<T, ExcludeParams>,
    reset?: boolean,
  ) => getTableProInstance().runTableRequest.call(null, extraConfig, reset)

  /**
   *
   * @description
   * 清空所有 filter 状态。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/data-table#filter-and-sorter
   */
  const clearFilters = () => getTableProInstance().clearFilters.call(null)

  /**
   *
   * @description
   * 清空所有 sort 状态。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/data-table#filter-and-sorter
   */
  const clearSorter = () => getTableProInstance().clearSorter.call(null)

  /**
   *
   * @param options 下载 CSV 配置项
   *
   * @description
   * 下载 CSV。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/data-table#export-csv.vue
   */
  const downloadCsv = (options?: CsvOptionsType) =>
    getTableProInstance().downloadCsv.call(null, options)

  /**
   *
   * @param filters 过滤器状态配置
   *
   * @description
   * 设定表格当前的过滤器。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/data-table#filter-and-sorter
   */
  const filters = (filters: FilterState | null) =>
    getTableProInstance().filters.call(null, filters)

  /**
   *
   * @param page 页数
   *
   * @description
   * 手动设置 page。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/data-table#DataTable-Methods
   */
  const page = (page: number) => getTableProInstance().page.call(null, page)

  /**
   *
   * @param options 滚动配置项
   *
   * @description
   * 滚动内容。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/data-table#DataTable-Methods
   */
  const scrollTo: ScrollToOptions = (options) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getTableProInstance().scrollTo(options as any)

  /**
   *
   * @param columnKey 列键
   * @param order 排序顺序
   *
   * @description
   * 设定表格的过滤状态。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/data-table#DataTable-Methods
   */
  const sort = (columnKey: ColumnKey, order: SortOrder) =>
    getTableProInstance().sort.call(null, columnKey, order)

  /**
   *
   * @param options 打印选项
   *
   * @description
   * 打印表格。
   */
  const print = (options?: PrintDomOptions) => {
    const { config } = getTableProInstance()
    const { uuidWrapper } = config ?? {}

    if (uuidWrapper) {
      const tableWrapperElement = document.getElementById(uuidWrapper)

      printDom(tableWrapperElement, options)
    }
  }

  /**
   *
   * @param extraConfig 额外请求合并配置项
   * @param excludeParams 排除的请求参数
   *
   * @description
   * 获取当前内部表格请求参数。
   */
  const getCurrentTableRequestParams = <
    T extends Recordable,
    ExcludeParams extends keyof T = keyof T,
  >(
    extraConfig?: TableRequestConfig<T, ExcludeParams>,
  ): T & Recordable =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getTableProInstance().getCurrentTableRequestParams.call(null, extraConfig)

  /**
   *
   * @param extraConfig 额外请求合并配置项
   *
   * @description
   * 重置表格分页。
   */
  const resetTablePagination = () =>
    getTableProInstance().resetTablePagination.call(null)

  /**
   *
   * @param extraConfig 额外请求合并配置项
   * @param reset 是否重置分页请求
   *
   * @description
   * 异步手动触发表格请求，用于手动刷新表格。
   */
  const runAsyncTableRequest = <
    T extends Recordable,
    ExcludeParams extends keyof T = keyof T,
  >(
    extraConfig?: TableRequestConfig<T, ExcludeParams>,
    reset?: boolean,
  ) => getTableProInstance().runAsyncTableRequest.call(null, extraConfig, reset)

  /**
   *
   * @description
   * 获取 TablePro 组件配置。
   */
  const getTableProConfig = () => getTableProInstance().config

  /**
   *
   * @description
   * 获取表格分页页码。
   */
  const getPage = () => getTableProInstance().getPage.call(null)

  /**
   *
   * @description

  /**
   *
   * @description
   * 获取表格分页每页条数。
   */
  const getPageSize = () => getTableProInstance().getPageSize.call(null)

  /**
   *
   * @description
   * 设置表格分页页码。
   */
  const setPage = (page: number) =>
    getTableProInstance().setPage.call(null, page)

  /**
   *
   * @description
   * 设置表格分页每页条数。
   */
  const setPageSize = (pageSize: number) =>
    getTableProInstance().setPageSize.call(null, pageSize)

  return [
    register,
    {
      clearFilters,
      getTableProInstance,
      clearSorter,
      downloadCsv,
      filters,
      page,
      scrollTo,
      sort,
      getTablePagination,
      runTableRequest,
      print,
      getCurrentTableRequestParams,
      resetTablePagination,
      runAsyncTableRequest,
      getTableProConfig,
      getPage,
      getPageSize,
      setPage,
      setPageSize,
    },
  ] as const
}

export type UseTableProReturn = ReturnType<typeof useTablePro>
