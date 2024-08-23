import { printDom } from '@/utils'

import type {
  RTableInst,
  CsvOptionsType,
  FilterState,
  ScrollToOptions,
  ColumnKey,
  SortOrder,
  UseTableRegister,
  TableProvider,
} from '../types'

/**
 *
 * @description
 * 获取 RTable 实例。
 * 让你能够便捷的调用相关的一些已封装方法。
 *
 * @warning
 * 值得注意的是，必须手动调用 register 方法，否则不能正常使用。
 * 在使用 相关 hooks 的时候，需要注意生命周期，确保 register 方法已经被调用与表格实例已经被初始化；
 * 不要在父组件 create 阶段就去调用 hook，如果需要，请使用 nextTick 包裹。
 *
 * @example
 * defineComponent({
 *   setup() {
 *     const [register, { ...Hooks }] = useTable()
 *
 *     return {
 *      register,
 *      ...Hooks,
 *     }
 *   },
 *   render() {
 *     const { register, ...Hooks } = this
 *
 *     return <RTable onRegister={register} />
 *   },
 * })
 */
const useTable = () => {
  const tableRef = ref<RTableInst>()
  let extra = {} as TableProvider

  const register: UseTableRegister = (inst, extraInfo) => {
    if (inst) {
      tableRef.value = inst
      extra = extraInfo
    }
  }

  /**
   *
   * @description
   * 获取 RTable 实例。
   */
  const getTableInstance = () => {
    if (!tableRef.value) {
      throw new Error(
        '[useTable]: table instance is not ready yet. if you are using useTable, please make sure you have called register method in onRegister event.',
      )
    }

    return tableRef.value
  }

  /**
   *
   * @description
   * 清空所有 filter 状态。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/data-table#filter-and-sorter
   */
  const clearFilters = () => getTableInstance().clearFilters.call(null)

  /**
   *
   * @description
   * 清空所有 sort 状态。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/data-table#filter-and-sorter
   */
  const clearSorter = () => getTableInstance().clearSorter.call(null)

  /**
   *
   * @description
   * 下载 CSV。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/data-table#export-csv.vue
   */
  const downloadCsv = (options?: CsvOptionsType) =>
    getTableInstance().downloadCsv.call(null, options)

  /**
   *
   * @description
   * 设定表格当前的过滤器。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/data-table#filter-and-sorter
   */
  const filters = (filters: FilterState | null) =>
    getTableInstance().filters.call(null, filters)

  /**
   *
   * @description
   * 手动设置 page。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/data-table#DataTable-Methods
   */
  const page = (page: number) => getTableInstance().page.call(null, page)

  /**
   *
   * @description
   * 滚动内容。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/data-table#DataTable-Methods
   */
  const scrollTo: ScrollToOptions = (options) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getTableInstance().scrollTo(options as any)

  /**
   *
   * @description
   * 设定表格的过滤状态。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/data-table#DataTable-Methods
   */
  const sort = (columnKey: ColumnKey, order: SortOrder) =>
    getTableInstance().sort.call(null, columnKey, order)

  /**
   *
   * @description
   * 打印表格。
   */
  const print = () => {
    const { uuidWrapper } = extra

    if (uuidWrapper) {
      const tableWrapperElement = document.getElementById(uuidWrapper)

      printDom(tableWrapperElement)
    }
  }

  return [
    register,
    {
      getTableInstance,
      clearFilters,
      clearSorter,
      downloadCsv,
      filters,
      page,
      scrollTo,
      sort,
      print,
    },
  ] as const
}

export type UseTableReturn = ReturnType<typeof useTable>

export default useTable
