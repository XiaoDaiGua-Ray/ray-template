import { computed, onScopeDispose, shallowRef } from 'vue'
import type { ComputedRef } from 'vue'
import type { TableProInst } from './TablePro'

/**
 *
 * @description
 * 代理 RTablePro 的实例方法与只读查询状态；绑定 onRegister 后使用，卸载时释放注册引用。
 *
 * @returns 注册函数、就绪状态与表格操作方法
 */
export const useTablePro = () => {
  const table = shallowRef<TableProInst>()

  /**
   *
   * @param instance 当前挂载的表格实例
   *
   * @description
   * 替换当前实例，并在该组件作用域销毁时清理引用；旧实例卸载不会清除新实例。
   */
  const register = (instance: TableProInst) => {
    table.value = instance

    // onRegister 在表格的挂载作用域内调用，卸载时只清理对应的实例。
    onScopeDispose(() => {
      if (table.value === instance) table.value = void 0
    }, true)
  }

  /**
   *
   * @returns 已注册的表格实例
   * @throws 尚未注册或已卸载时抛错
   */
  const getTableProInstance = () => {
    if (!table.value) {
      throw new Error(
        '[useTablePro] Table is not mounted. Bind register to onRegister.',
      )
    }

    return table.value
  }

  const actions: Omit<TableProInst, 'queryState'> & {
    isReady: ComputedRef<boolean>
    queryState: ComputedRef<TableProInst['queryState']>
    getTableProInstance: () => TableProInst
  } = {
    isReady: computed(() => table.value !== void 0),
    queryState: computed(() => table.value?.queryState ?? null),
    getTableProInstance,
    reload: (resetPage) => getTableProInstance().reload(resetPage),
    setPage: (page) => getTableProInstance().setPage(page),
    setPageSize: (pageSize) => getTableProInstance().setPageSize(pageSize),
    getSearchValues: (source) => getTableProInstance().getSearchValues(source),
    setSearchValues: (values) => getTableProInstance().setSearchValues(values),
    submitSearch: () => getTableProInstance().submitSearch(),
    resetSearch: () => getTableProInstance().resetSearch(),
    getCurrentPageData: () => getTableProInstance().getCurrentPageData(),
    getTableInstance: () => getTableProInstance().getTableInstance(),
    print: (options) => getTableProInstance().print(options),
    downloadCsv: (options) => getTableProInstance().downloadCsv(options),
    copyImage: (options) => getTableProInstance().copyImage(options),
  }

  return [register, actions] as const
}
