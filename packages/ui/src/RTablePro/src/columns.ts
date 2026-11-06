import { createStorage } from '@ray-template/utils/storage'
import type { DataTableColumn } from 'naive-ui'
import { computed, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'

export type TableColumnKey = string | number
export type KeyedColumn = Extract<DataTableColumn, { key: TableColumnKey }>
export type LeafColumn = Exclude<KeyedColumn, { children: DataTableColumn[] }>
export type ColumnLayoutPatch = Partial<
  Pick<KeyedColumn, 'fixed' | 'resizable'>
>

/**
 *
 * @param column 数据表列定义
 *
 * @returns 是否为带业务键的数据列或分组列
 */
export const hasColumnKey = (column: DataTableColumn): column is KeyedColumn =>
  'key' in column

/**
 *
 * @param columns 按展示顺序排列的列定义
 *
 * @description
 * 展开分组并跳过选择、展开等功能列；保留叶子列对象引用，供导出与可见性逻辑共用。
 *
 * @returns 按展示顺序排列的叶子列
 */
export const getLeafColumns = (columns: DataTableColumn[]): LeafColumn[] =>
  columns.flatMap((column) =>
    !hasColumnKey(column)
      ? []
      : 'children' in column
        ? getLeafColumns(column.children)
        : [column],
  )

const applyRootOrder = (
  columns: DataTableColumn[],
  order: TableColumnKey[],
) => {
  const orderedKeys = new Set(order)
  const byKey = new Map(
    columns.filter(hasColumnKey).map((column) => [column.key, column]),
  )
  const ordered = order.flatMap((key) => byKey.get(key) ?? [])
  let index = 0

  // 新列和选择/展开列保留输入的位置，已有列按 key 恢复顺序。
  return columns.map((column) =>
    hasColumnKey(column) && orderedKeys.has(column.key)
      ? ordered[index++]
      : column,
  )
}

/**
 *
 * @param column 要调整的数据列或分组列
 * @param patch 本次布局调整，fixed 显式为 undefined 表示取消固定
 *
 * @description
 * Naive UI 表体读取叶子列自身的 fixed；分组固定需同步子树，仅传播 fixed，不覆盖子列其它配置。
 *
 * @returns 独立的调整结果，未涉及的子树保留原引用
 */
const applyColumnPatch = <Column extends KeyedColumn>(
  column: Column,
  patch: ColumnLayoutPatch,
): Column => {
  if (!('children' in column) || !Object.hasOwn(patch, 'fixed'))
    return { ...column, ...patch }

  return {
    ...column,
    ...patch,
    children: column.children.map((child) =>
      applyColumnPatch(child, { fixed: patch.fixed }),
    ),
  }
}

/**
 *
 * @param columns 当前完整列定义
 * @param onUpdate 受控模式的完整列更新回调
 * @param onReset 受控模式的重置回调
 *
 * @description
 * 在受控回调与本地布局补丁间选择单一状态来源，不直接修改输入列。
 *
 * @returns 布局后的列及排序、补丁、重置方法
 */
export const useColumnLayout = (
  columns: Ref<DataTableColumn[]>,
  onUpdate: Ref<((columns: DataTableColumn[]) => void) | undefined>,
  onReset: Ref<(() => void) | undefined>,
) => {
  const order = shallowRef<TableColumnKey[]>()
  const patches = shallowRef<Map<TableColumnKey, ColumnLayoutPatch>>()

  const layoutColumns = computed(() => {
    if (onUpdate.value) return columns.value

    const arranged = order.value
      ? applyRootOrder(columns.value, order.value)
      : columns.value
    const adjustments = patches.value

    if (!adjustments?.size) return arranged

    return arranged.map((column) => {
      if (!hasColumnKey(column)) return column

      const patch = adjustments.get(column.key)

      return patch ? applyColumnPatch(column, patch) : column
    })
  })

  const reorderColumns = (keys: TableColumnKey[]) => {
    if (onUpdate.value) {
      onUpdate.value(applyRootOrder(columns.value, keys))
    } else {
      order.value = keys
    }
  }

  const patchColumn = (key: TableColumnKey, patch: ColumnLayoutPatch) => {
    if (onUpdate.value) {
      onUpdate.value(
        columns.value.map((column) =>
          hasColumnKey(column) && column.key === key
            ? applyColumnPatch(column, patch)
            : column,
        ),
      )
    } else {
      const next = new Map(patches.value)

      next.set(key, { ...next.get(key), ...patch })
      patches.value = next
    }
  }

  const layoutChanged = computed(() =>
    onUpdate.value ? !!onReset.value : !!(order.value || patches.value?.size),
  )

  const resetLayout = () => {
    if (onUpdate.value) {
      onReset.value?.()

      return
    }

    order.value = void 0
    patches.value = void 0
  }

  return {
    layoutColumns,
    reorderColumns,
    patchColumn,
    resetLayout,
    layoutChanged,
  }
}

const filterColumns = (
  columns: DataTableColumn[],
  hidden: ReadonlySet<TableColumnKey>,
): DataTableColumn[] => {
  const filtered = columns.flatMap((column): DataTableColumn[] => {
    if (!hasColumnKey(column)) return [column]

    if (!('children' in column)) return hidden.has(column.key) ? [] : [column]

    const children = filterColumns(
      column.children,
      hidden,
    ) as typeof column.children

    if (!children.length) return []

    return [children === column.children ? column : { ...column, children }]
  })

  return filtered.length === columns.length &&
    filtered.every((column, index) => column === columns[index])
    ? columns
    : filtered
}

const storageKey = (key?: string) => {
  const scope = key?.trim()

  return scope ? `table-pro:columns:v1:${scope}` : ''
}
const isColumnKey = (value: unknown): value is TableColumnKey =>
  typeof value === 'string' ||
  (typeof value === 'number' && Number.isFinite(value))

/**
 *
 * @param columns 包含隐藏列的完整列定义
 * @param scope 可选持久化标识，空值表示不写入存储
 * @param storage 隐藏列状态存储，浏览器中默认使用 localStorage
 *
 * @description
 * 按叶子列键维护可见性，忽略已删除的键并至少保留一列；未变更的分支复用原对象。
 *
 * @returns 可见列、隐藏键与切换、重置方法
 */
export const useColumnVisibility = (
  columns: Ref<DataTableColumn[]>,
  scope: Ref<string | undefined>,
  storage = typeof localStorage === 'undefined'
    ? void 0
    : createStorage(localStorage),
) => {
  const hidden = shallowRef(new Set<TableColumnKey>())
  const keys = computed(() => [
    ...new Set(getLeafColumns(columns.value).map(({ key }) => key)),
  ])

  watch(
    () => storageKey(scope.value),
    (key) => {
      const stored = key ? storage?.get(key) : null

      hidden.value = new Set(
        Array.isArray(stored) ? stored.filter(isColumnKey) : [],
      )
    },
    { immediate: true },
  )

  const hiddenKeys = computed(() => {
    if (!hidden.value.size) return hidden.value

    const active = new Set(keys.value.filter((key) => hidden.value.has(key)))

    // 列定义动态收缩时，至少保留一个可用的数据列。
    if (active.size && active.size === keys.value.length)
      active.delete(keys.value[0])

    return active
  })
  const visibleColumns = computed(() =>
    hiddenKeys.value.size
      ? filterColumns(columns.value, hiddenKeys.value)
      : columns.value,
  )
  const visibleCount = computed(() => keys.value.length - hiddenKeys.value.size)

  const persist = (next: Set<TableColumnKey>) => {
    hidden.value = next
    const key = storageKey(scope.value)

    if (!key) return

    if (next.size) storage?.set(key, [...next])
    else storage?.remove(key)
  }

  const setColumnVisible = (key: TableColumnKey, visible: boolean) => {
    if (!keys.value.includes(key) || visible !== hiddenKeys.value.has(key))
      return

    if (!visible && visibleCount.value <= 1) return

    const next = new Set(hiddenKeys.value)

    if (visible) next.delete(key)
    else next.add(key)

    persist(next)
  }

  const resetColumns = () => {
    if (hidden.value.size) persist(new Set())
  }

  return { hiddenKeys, visibleColumns, setColumnVisible, resetColumns }
}
