/* eslint-disable @typescript-eslint/no-explicit-any */
import { effectDispose } from '@/utils'

import type { Recordable } from '@/types'
import type { MaybeRef } from '@vueuse/core'
import type { DataTableColumns, DataTableSelectionColumn } from 'naive-ui'

export type RowKey = string | number

export type Action =
  | 'check'
  | 'uncheck'
  | 'checkAll'
  | 'uncheckAll'
  | 'multipleCheck'

export interface UseCheckedRowKeysOptions<T = unknown> {
  /**
   *
   * @description
   * 绑定在 DataTable 组件的唯一关键字段，用于标识每一行数据。
   * 在该组件中，默认使用 key 作为关键字段，你可以通过该属性来自定义。
   */
  rowKey: string
  /**
   *
   * @param keys 选中的 keys
   * @param rows 选中的 rows
   * @param meta 当前操作的元数据
   *
   * @description
   * 每当 keys 变化时，会触发该回调函数。
   */
  onChange?: (
    keys: RowKey[],
    rows: T[],
    meta: { row: T | undefined; action: Action },
  ) => void
}

/**
 *
 * @param tableData DataTable data
 * @param bindRowKey DataTable rowKey
 * @param key target key
 *
 * @description
 * 递归查找指定 key 的行数据。
 * 因为 DataTable data 允许树结构，所以需要递归查找。
 */
const findRow = (
  tableData: Recordable[],
  bindRowKey: string,
  key: RowKey,
): Recordable | undefined => {
  if (!tableData.length) {
    return void 0
  }

  for (const curr of tableData) {
    if (curr[bindRowKey] === key) {
      return curr
    }

    if (curr?.children?.length) {
      const foundRow = findRow(curr.children, bindRowKey, key)

      if (foundRow) {
        return foundRow
      }
    }
  }

  return void 0
}

const isMultiple = (columns: MaybeRef<DataTableColumns<any> | undefined>) => {
  const unrefColumns = unref(columns)

  if (unrefColumns) {
    const idx = unrefColumns.findIndex((column) => {
      const { type, multiple } = column as DataTableSelectionColumn

      if (
        type === 'selection' &&
        (multiple === void 0 || multiple === null || multiple === true)
      ) {
        return true
      }
    })

    return idx !== -1
  }

  return true
}

const matchRowsBySelectionKeys = <T extends Recordable>(
  data: MaybeRef<T[] | undefined>,
  keys: RowKey[],
  currentRows: MaybeRef<T[]>,
  bindRowKey: string,
) => {
  const unrefData = unref(data)

  if (!unrefData) {
    return currentRows
  }

  return keys.reduce((pre, key) => {
    const findByCurrentRows = unref(currentRows).findIndex(
      (f) => f[bindRowKey] === key,
    )

    if (findByCurrentRows !== -1) {
      pre.push(unref(currentRows)[findByCurrentRows])

      return pre
    }

    const findByData = unrefData.findIndex((f) => f[bindRowKey] === key)

    if (findByData !== -1) {
      pre.push(unrefData[findByData])

      return pre
    }

    return pre
  }, [] as T[])
}

/**
 *
 * @param data 当前 DataTable 组件的数据
 * @param options 配置项
 *
 * @description
 * 该方法用于便捷的管理 checkedRowKeys。
 *
 * 该方法依赖 rowKey，该字段用于标识每一行数据，与组件的约定保持一致。
 *
 * 如果需要该方法去接管 onUpdateCheckedRowKeys 事件，需要手动去注册 checkedRowKeysBind 方法。
 * 并且在使用的时候，需要手动绑定 v-model:checkedRowKeys。
 *
 * @example
 * <template>
 *   <RDataTable
 *     v-model:checkedRowKeys="checkedRowKeys"
 *     onUpdateCheckedRowKeys="checkedRowKeysBind"
 *     :data="data"
 *     :columns="columns"
 *   />
 * </template>
 * <script lang="ts" setup>
 * import { useCheckedRowKeys } from '@/components'
 *
 * const data = ref([{ ...table data }])
 * const columns = [{ ...table columns }]
 * const [checkedRowKeys, { checkedRowKeysBind }] = useCheckedRowKeys(data, { rowKey: 'key' }, multiple: true)
 * </script>
 */
const useCheckedRowKeys = <
  T extends Recordable,
  C extends DataTableColumns<any>,
>(
  data: MaybeRef<T[] | undefined>,
  columns: MaybeRef<C | undefined>,
  options?: UseCheckedRowKeysOptions<T>,
) => {
  const keysRef = ref<RowKey[]>([])
  const rowsRef = ref<any[]>([])
  const { rowKey: bindRowKey = 'key', onChange } = options || {}
  const currentColumnIsMultiple = computed(() => isMultiple(columns))

  /**
   *
   * @param keys 选中 keys 数据
   * @param rows 选中 rows 数据
   * @param meta 当前选中元数据与操作类型
   *
   * @description
   * 用于绑定 onUpdateCheckedRowKeys 事件。
   */
  const bind = (
    keys: RowKey[],
    rows: Recordable[],
    meta: {
      row: Recordable | undefined
      action: Action
    },
  ) => {
    keysRef.value = keys
    rowsRef.value = unref(
      matchRowsBySelectionKeys(data, keys, rowsRef, bindRowKey),
    )

    onChange?.(
      keys,
      rowsRef.value,
      meta as {
        row: any | undefined
        action: Action
      },
    )

    isMultiple(columns)
  }

  /**
   *
   * @description
   * 获取所有已选择行的 key。
   * key 为你手动绑定的唯一关键字段，与 DataTable 组件需要的 rowKey 保持一致。
   */
  const getKeys = () => keysRef.value

  /**
   *
   * @description
   * 获取所有已选择行的数据。
   */
  const getRows = () => rowsRef.value as T[]

  /**
   *
   * @description
   * 清理所有已选择行的 key 和 rows。
   */
  const clearAll = () => {
    keysRef.value = []
    rowsRef.value = []

    onChange?.(keysRef.value, rowsRef.value, {
      row: void 0,
      action: 'uncheckAll',
    })
  }

  /**
   *
   * @param key 需要清理的 key
   * @param rowKey 绑定 key 的字段，默认为 'key'，与 DataTable 组件需要的 rowKey 保持一致
   *
   * @description
   * 清理指定 key。
   *
   * 实际上，在 naive ui 中，key 与 rows 是关联起来的。
   * 所以，为了避免歧义的存在，当你清理掉某个 key 时，对应的 rows 也会被清理掉。
   */
  const clearKey = (key: RowKey) => {
    if (key === null || key === void 0) {
      return
    }

    let _row!: Recordable<T>

    keysRef.value = keysRef.value.filter((curr) => curr !== key)
    rowsRef.value = rowsRef.value.filter((curr) => {
      if (curr[bindRowKey] === key) {
        _row = curr

        return false
      }

      return true
    })

    onChange?.(keysRef.value, rowsRef.value, {
      row: _row as any,
      action: 'uncheck',
    })
  }

  /**
   *
   * @param keys 选中的 keys
   *
   * @description
   * 选中指定的 keys。
   * 当你调用该方法时，会将 keys 与 data 中的 rows 进行比对，将匹配的 rows 添加到已选中的 rows 中。
   *
   * 如果 multiple 为 false，那么只会选中一个 key；重复的选择，将会以最后一次绑定的 key 为准。
   * 所以，如果你需要选中多个 key，需要将 multiple 设置为 true。
   */
  const selectKey = (key: RowKey) => {
    if (keysRef.value.includes(key)) {
      return
    }

    const multiple = !currentColumnIsMultiple.value && keysRef.value.length >= 1
    const row = findRow(unref(data) || [], bindRowKey, key)

    multiple ? (keysRef.value = [key]) : keysRef.value.push(key)

    if (row) {
      multiple ? (rowsRef.value = [row]) : rowsRef.value.push(row)

      onChange?.(keysRef.value, rowsRef.value, {
        row: row as any,
        action: 'check',
      })
    }
  }

  effectDispose(() => {
    clearAll()
  })

  return [
    keysRef,
    {
      checkedRows: rowsRef as Ref<T[]>,
      checkedRowKeysBind: bind,
      getKeys,
      getRows,
      clearAll,
      clearKey,
      selectKey,
    },
  ] as const
}

export type UseCheckedRowKeysReturn = ReturnType<typeof useCheckedRowKeys>

export default useCheckedRowKeys
