import { get } from 'lodash-es'
import { getLeafColumns } from './columns'
import type {
  TableProColumn,
  TableProSearchConfig,
  TableProSearchFieldConfig,
  TableProSearchOptions,
  TableProSearchValue,
  TableProSearchValues,
} from './types'

type Row = Readonly<Record<string, unknown>>

/**
 *
 * @param search 搜索配置
 *
 * @returns 是否使用兼容的字段数组配置
 */
export function isSearchArray(
  search: TableProSearchConfig | undefined,
): search is readonly TableProSearchFieldConfig[] {
  return Array.isArray(search)
}

/**
 *
 * @param search 字段数组、完整配置或禁用标记
 *
 * @returns 统一的搜索配置，禁用时为 undefined
 */
export function resolveSearchOptions(
  search: TableProSearchConfig | undefined,
): TableProSearchOptions | undefined {
  return isSearchArray(search) ? { fields: search } : search || void 0
}

/**
 *
 * @param options 搜索配置
 * @param columns 完整列定义
 *
 * @description
 * 优先使用显式字段，否则从叶子列提取；重复键保留首次出现的定义。
 *
 * @returns 去重后的搜索字段
 */
export function resolveSearchFields(
  options: TableProSearchOptions,
  columns: TableProColumn[],
) {
  const fields =
    options.fields ??
    getLeafColumns(columns).flatMap((column) => {
      const { search } = column as TableProColumn

      if (!search) return []

      const key = String(column.key)
      const label = typeof column.title === 'string' ? column.title : key

      return [
        search === true
          ? { key, label }
          : { ...search, key: search.key ?? key, label: search.label ?? label },
      ]
    })
  const seen = new Set<string>()

  return fields.filter(({ key }) => {
    if (seen.has(key)) return false

    seen.add(key)

    return true
  })
}

/**
 *
 * @param values 扁平搜索值快照
 *
 * @description
 * 复制字段容器和数组型字段，防止调用方修改内部快照；标量无需深拷贝。
 *
 * @returns 独立的搜索值容器
 */
export function copySearchValues<Value>(
  values: Readonly<Record<string, Value>>,
): Record<string, Value> {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      Array.isArray(value) ? ([...value] as Value) : value,
    ]),
  )
}

/**
 *
 * @param field 当前字段定义
 * @param values 当前草稿或已应用值
 *
 * @returns 字段是否可见；兼容字段始终可见
 * @throws visible 回调异常原样传播，由表格边界处理
 */
export function isSearchFieldVisible(
  field: TableProSearchFieldConfig,
  values: TableProSearchValues,
) {
  return !field.type || (field.visible?.(values) ?? true)
}

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isKey = (value: unknown) => typeof value === 'string' || isNumber(value)

const isDay = (value: unknown) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(value)

  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  )
}

const isTimestamp = (value: unknown) =>
  isNumber(value) && Math.abs(value) <= 8.64e15

function sanitizeValue(
  field: TableProSearchFieldConfig,
  value: TableProSearchValues[string],
): TableProSearchValue | null {
  if (value == null) return null

  switch (field.type) {
    case 'text':
      return typeof value === 'string' ? value : null
    case 'number':
      return isNumber(value) ? value : null
    case 'boolean':
      return typeof value === 'boolean' ? value : null
    case 'date':
      return isDay(value) ? value : null
    case 'datetime':
      return isTimestamp(value) ? value : null
    case 'time':
      return typeof value === 'string' &&
        /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value)
        ? value
        : null
    case 'dateRange':
    case 'datetimeRange': {
      const check = field.type === 'dateRange' ? isDay : isTimestamp

      return Array.isArray(value) &&
        value.length === 2 &&
        check(value[0]) &&
        check(value[1]) &&
        value[0] <= value[1]
        ? [...value]
        : null
    }
    case 'select':
    case 'cascader':
    case 'treeSelect':
      if (field.multiple)
        return Array.isArray(value) ? value.filter(isKey) : null

      return isKey(value) ? value : null
    case 'custom':
      if (Array.isArray(value)) return value.filter(isKey)

      return typeof value === 'boolean' || isKey(value) ? value : null
    default:
      return field.options
        ? isKey(value)
          ? value
          : null
        : typeof value === 'string'
          ? value
          : null
  }
}

/**
 *
 * @param fields 当前字段定义
 * @param values 候选搜索值
 *
 * @returns 仅包含已定义字段的值，不匹配字段类型的值归一为 null
 */
export function pickSearchValues(
  fields: readonly TableProSearchFieldConfig[],
  values: TableProSearchValues,
): Record<string, TableProSearchValues[string]> {
  return Object.fromEntries(
    fields.map((field) => [field.key, sanitizeValue(field, values[field.key])]),
  )
}

/**
 *
 * @param fields 当前字段定义
 * @param options 可选初始值配置
 *
 * @returns 经字段类型校验的初始草稿，整体初始值覆盖单字段初始值
 */
export function initialSearchValues(
  fields: readonly TableProSearchFieldConfig[],
  options: TableProSearchOptions | undefined,
) {
  return pickSearchValues(fields, {
    ...Object.fromEntries(
      fields.map((field) => [
        field.key,
        field.type ? field.initialValue : null,
      ]),
    ),
    ...options?.initialValues,
  })
}

const sameValue = (
  left: TableProSearchValues[string],
  right: TableProSearchValues[string],
) =>
  left === right ||
  (Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index]))

/**
 *
 * @param fields 当前字段定义
 *
 * @returns 从上游字段键到直接依赖字段键的索引，供单次变更遍历复用
 */
export const createSearchDependencies = (
  fields: readonly TableProSearchFieldConfig[],
) => {
  const dependents = new Map<string, string[]>()

  for (const field of fields) {
    if (!field.type) continue

    for (const key of field.dependsOn ?? []) {
      const group = dependents.get(key)

      if (group) group.push(field.key)
      else dependents.set(key, [field.key])
    }
  }

  return dependents
}

/**
 *
 * @param fields 当前字段定义
 * @param previous 上一次草稿
 * @param patch 本次字段补丁
 * @param dependents 已计算的反向依赖索引
 *
 * @description
 * 校验补丁并清空受影响的下游字段；本次显式赋值优先，循环依赖不会重复遍历。
 *
 * @returns 新草稿；没有实际变化时复用 previous
 */
export function patchSearchValues(
  fields: readonly TableProSearchFieldConfig[],
  previous: TableProSearchValues,
  patch: TableProSearchValues,
  dependents: ReadonlyMap<string, readonly string[]>,
) {
  const next = pickSearchValues(fields, { ...previous, ...patch })
  const changed = new Set(
    Object.keys(next).filter(
      (key) => !sameValue(next[key], previous[key] ?? null),
    ),
  )

  if (!changed.size) return previous

  // 依赖可以跨多级，遍历时把本次被清除的字段也加入变更集合。
  for (const key of changed) {
    for (const dependent of dependents.get(key) ?? []) {
      if (changed.has(dependent) || Object.hasOwn(patch, dependent)) continue

      next[dependent] = null
      changed.add(dependent)
    }
  }

  return next
}

/**
 *
 * @param field 新字段定义
 * @param previous 旧字段定义
 *
 * @returns 字段值形状是否兼容，供动态字段保留草稿时判断
 */
export function sameSearchField(
  field: TableProSearchFieldConfig,
  previous: TableProSearchFieldConfig | undefined,
) {
  if (!previous || previous.type !== field.type) return false

  if (!previous.type && !field.type)
    return !!previous.options === !!field.options

  return (
    ('multiple' in field && field.multiple === true) ===
    ('multiple' in previous && previous.multiple === true)
  )
}

/**
 *
 * @param field 新字段定义
 * @param previous 旧字段定义
 *
 * @returns 值形状、可见性、取值、匹配与转换回调是否一致
 */
export function sameSearchBehavior(
  field: TableProSearchFieldConfig,
  previous: TableProSearchFieldConfig | undefined,
) {
  if (!sameSearchField(field, previous)) return false

  if (!field.type || !previous?.type) return true

  return (
    field.visible === previous.visible &&
    field.getValue === previous.getValue &&
    field.matches === previous.matches &&
    field.transform === previous.transform
  )
}

/**
 *
 * @param fields 当前字段定义
 * @param values 当前搜索值
 *
 * @returns 当前可见的字段，保留输入顺序
 * @throws 可见性回调异常原样传播
 */
export const visibleSearchFields = (
  fields: readonly TableProSearchFieldConfig[],
  values: TableProSearchValues,
) => fields.filter((field) => isSearchFieldVisible(field, values))

/**
 *
 * @param fields 本次应用的字段
 * @param values 候选搜索值
 *
 * @description
 * 校验字段类型、裁剪文本并移除空值；数字 0 和布尔 false 保留。
 *
 * @returns 可用于请求或本地过滤的搜索快照
 */
export function normalizeSearchValues(
  fields: readonly TableProSearchFieldConfig[],
  values: TableProSearchValues,
): TableProSearchValues {
  return Object.fromEntries(
    fields.flatMap((field) => {
      const raw = sanitizeValue(field, values[field.key])
      const value =
        (!field.type || field.type === 'text') && typeof raw === 'string'
          ? raw.trim()
          : raw

      return value == null ||
        value === '' ||
        (Array.isArray(value) && !value.length)
        ? []
        : [[field.key, value] as const]
    }),
  )
}

/**
 *
 * @param fields 搜索字段定义
 * @param values 已校验的搜索值
 *
 * @description
 * 执行字段转换并移除 page、pageSize 保留键，分页始终由表格状态提供。
 *
 * @returns 请求参数对象
 * @throws transform 回调异常原样传播
 */
export function toSearchParams(
  fields: readonly TableProSearchFieldConfig[],
  values: TableProSearchValues,
) {
  const fieldsByKey = new Map(fields.map((field) => [field.key, field]))
  const params = Object.fromEntries(
    Object.entries(values).flatMap<[string, unknown]>(([key, value]) => {
      if (value == null) return []

      const field = fieldsByKey.get(key)
      const transform = field?.type && field.transform

      // 值已由对应字段校验。遍历异构字段时，联合类型无法保留这层对应关系。
      return transform
        ? Object.entries(transform(value as never, values))
        : [[key, value]]
    }),
  )

  delete params.page
  delete params.pageSize

  return params
}

/**
 *
 * @param fields 搜索字段定义
 * @param values 已归一化的过滤值
 *
 * @description
 * 为一次搜索编译匹配函数，预先建立键索引、多选集合及文本关键词，避免逐行重复准备。
 *
 * @returns 逐行匹配函数；没有过滤条件时为 null
 */
export function createSearchPredicate(
  fields: readonly TableProSearchFieldConfig[],
  values: TableProSearchValues,
) {
  const fieldsByKey = new Map(fields.map((field) => [field.key, field]))
  const checks = Object.entries(values).flatMap(([key, value]) => {
    if (value == null) return []

    const field = fieldsByKey.get(key)
    const read = (row: Row) =>
      field?.type && field.getValue ? field.getValue(row) : get(row, key)

    if (field?.type && field.matches) {
      const matches = field.matches

      return [(row: Row) => matches(read(row), value as never, row)]
    }

    if (field?.type === 'dateRange' || field?.type === 'datetimeRange') {
      const [from, to] = value as readonly (string | number)[]

      return [
        (row: Row) => {
          const cell = read(row)

          return (
            (typeof cell === 'string' || typeof cell === 'number') &&
            typeof cell === typeof from &&
            cell >= from &&
            cell <= to
          )
        },
      ]
    }

    if (Array.isArray(value)) {
      const selected = new Set<unknown>(value)

      return [
        (row: Row) => {
          const cell = read(row)

          return Array.isArray(cell)
            ? cell.some((item: unknown) => selected.has(item))
            : selected.has(cell)
        },
      ]
    }

    if (
      typeof value === 'string' &&
      (!field || field.type === 'text' || (!field.type && !field.options))
    ) {
      const needle = value.toLowerCase()

      return [
        (row: Row) =>
          String(read(row) ?? '')
            .toLowerCase()
            .includes(needle),
      ]
    }

    return [(row: Row) => read(row) === value]
  })

  return checks.length
    ? (row: Row) => checks.every((check) => check(row))
    : null
}
