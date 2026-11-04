import { computed, onScopeDispose, shallowRef } from 'vue'
import type { ComputedRef } from 'vue'
import type { TableProInst } from './TablePro'

export const useTablePro = () => {
  const table = shallowRef<TableProInst>()

  const register = (instance: TableProInst) => {
    table.value = instance

    // onRegister 在表格的挂载作用域内调用，卸载时只清理对应的实例。
    onScopeDispose(() => {
      if (table.value === instance) table.value = void 0
    }, true)
  }

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
    getCurrentPageData: () => getTableProInstance().getCurrentPageData(),
    getTableInstance: () => getTableProInstance().getTableInstance(),
    print: (options) => getTableProInstance().print(options),
    downloadCsv: (options) => getTableProInstance().downloadCsv(options),
  }

  return [register, actions] as const
}
