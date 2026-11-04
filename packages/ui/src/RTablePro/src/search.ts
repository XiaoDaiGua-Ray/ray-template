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

export function isSearchArray(
  search: TableProSearchConfig | undefined,
): search is readonly TableProSearchFieldConfig[] {
  return Array.isArray(search)
}

export function resolveSearchOptions(
  search: TableProSearchConfig | undefined,
): TableProSearchOptions | undefined {
  return isSearchArray(search) ? { fields: search } : search || void 0
}

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

export function pickSearchValues(
  fields: readonly TableProSearchFieldConfig[],
  values: TableProSearchValues,
): Record<string, TableProSearchValues[string]> {
  return Object.fromEntries(
    fields.map((field) => [field.key, sanitizeValue(field, values[field.key])]),
  )
}

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

export function patchSearchValues(
  fields: readonly TableProSearchFieldConfig[],
  previous: TableProSearchValues,
  patch: TableProSearchValues,
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
    for (const field of fields) {
      if (
        !field.type ||
        changed.has(field.key) ||
        Object.hasOwn(patch, field.key)
      )
        continue

      if (!field.dependsOn?.includes(key)) continue

      next[field.key] = null
      changed.add(field.key)
    }
  }

  return next
}

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

export function normalizeSearchValues(
  fields: readonly TableProSearchFieldConfig[],
  values: TableProSearchValues,
): TableProSearchValues {
  return Object.fromEntries(
    fields.flatMap((field) => {
      if (!isSearchFieldVisible(field, values)) return []

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

export function createSearchPredicate(
  fields: readonly TableProSearchFieldConfig[],
  values: TableProSearchValues,
) {
  const fieldsByKey = new Map(fields.map((field) => [field.key, field]))
  const checks = Object.entries(values).flatMap(([key, value]) => {
    if (value == null) return []

    const field = fieldsByKey.get(key)
    const read = (row: Row) =>
      field?.type && field.getValue ? field.getValue(row) : row[key]

    return [
      (row: Row) => {
        const cell = read(row)

        if (field?.type && field.matches)
          return field.matches(cell, value as never, row)

        if (field?.type === 'dateRange' || field?.type === 'datetimeRange') {
          const [from, to] = value as readonly (string | number)[]

          return (
            (typeof cell === 'string' || typeof cell === 'number') &&
            typeof cell === typeof from &&
            cell >= from &&
            cell <= to
          )
        }

        if (Array.isArray(value)) {
          return Array.isArray(cell)
            ? cell.some((item: unknown) => value.includes(item))
            : value.includes(cell)
        }

        return typeof value === 'string' &&
          (!field
            ? true
            : field.type === 'text' || (!field.type && !field.options))
          ? String(cell ?? '')
              .toLowerCase()
              .includes(value.toLowerCase())
          : cell === value
      },
    ]
  })

  return checks.length
    ? (row: Row) => checks.every((check) => check(row))
    : null
}
