import type { BasicTarget } from '@ray-template/composables/types'
import type {
  CascaderProps,
  DataTableInst,
  DataTableProps,
  DatePickerProps,
  FormItemRule,
  InputNumberProps,
  InputProps,
  SelectOption,
  SelectProps,
  TimePickerProps,
  TreeSelectProps,
} from 'naive-ui'
import type { VNodeChild } from 'vue'
import type { LeafColumn } from './columns'

export interface TableProPrintOptions {
  target?: BasicTarget<HTMLElement>
  title?: string
  style?: string
  formatHeader?: (column: LeafColumn) => string
  formatCell?: (
    value: unknown,
    row: Record<string, unknown>,
    column: LeafColumn,
  ) => string
}

export interface TablePanelInst {
  getTableInstance: () => DataTableInst | null
  print: (options?: TableProPrintOptions) => Promise<boolean>
  downloadCsv: DataTableInst['downloadCsv']
}

export interface TableProParams extends Record<string, unknown> {
  page?: number
  pageSize?: number
}

export interface TableProResult {
  data: NonNullable<DataTableProps['data']>
  total: number
}

export interface TableProQueryState {
  readonly loading: boolean
  readonly failed: boolean
  readonly page: number | null
  readonly pageSize: number | null
  readonly total: number | null
}

export type TableProRequest = (
  params: TableProParams,
  signal: AbortSignal,
) => Promise<TableProResult>

type SearchKey = string | number

export type TableProSearchValue = SearchKey | boolean | readonly SearchKey[]
export type TableProSearchValues = Readonly<
  Record<string, TableProSearchValue | null | undefined>
>

export type TableProSearchField = {
  type?: undefined
  key: string
  label: string
  placeholder?: string
  options?: SelectOption[]
}

type SearchFieldBase<Value extends TableProSearchValue> = {
  key: string
  label: string
  placeholder?: string
  initialValue?: Value | null
  span?: number
  rules?: FormItemRule | FormItemRule[]
  visible?: (values: TableProSearchValues) => boolean
  dependsOn?: readonly string[]
  transform?: (
    value: Value,
    values: TableProSearchValues,
  ) => Record<string, unknown>
  getValue?: (row: Readonly<Record<string, unknown>>) => unknown
  matches?: (
    cell: unknown,
    value: Value,
    row: Readonly<Record<string, unknown>>,
  ) => boolean
}

type BindingProps =
  'value' | 'defaultValue' | 'onUpdateValue' | 'onUpdate:value'
type SearchControlProps<Props, Managed extends keyof Props = never> = Omit<
  Props,
  BindingProps | Managed
>
type SearchField<
  Type,
  Value extends TableProSearchValue,
  Props,
> = SearchFieldBase<Value> & { type: Type; fieldProps?: Props }

type SearchSelectField =
  | (SearchField<'select', SearchKey, SearchSelectProps> & { multiple?: false })
  | (SearchField<'select', readonly SearchKey[], SearchSelectProps> & {
      multiple: true
    })

type SearchSelectProps = SearchControlProps<SelectProps, 'multiple' | 'options'>

export interface TableProSearchOptionContext {
  keyword: string
  values: TableProSearchValues
  signal: AbortSignal
}

type DateFieldProps = SearchControlProps<
  DatePickerProps,
  | 'type'
  | 'formattedValue'
  | 'defaultFormattedValue'
  | 'valueFormat'
  | 'onUpdateFormattedValue'
  | 'onUpdate:formattedValue'
>

type TreeField<Type, Props> =
  | (SearchField<Type, SearchKey, Props> & { multiple?: false })
  | (SearchField<Type, readonly SearchKey[], Props> & { multiple: true })

export type TableProSearchFieldConfig =
  | TableProSearchField
  | SearchField<'text', string, SearchControlProps<InputProps, 'pair'>>
  | SearchField<'number', number, SearchControlProps<InputNumberProps>>
  | SearchField<'boolean', boolean, SearchSelectProps>
  | (SearchSelectField & {
      options?: SelectProps['options']
      loadOptions?: (
        context: TableProSearchOptionContext,
      ) => Promise<NonNullable<SelectProps['options']>>
      optionDebounce?: number
    })
  | SearchField<'date', string, DateFieldProps>
  | SearchField<'dateRange', readonly [string, string], DateFieldProps>
  | SearchField<'datetime', number, DateFieldProps>
  | SearchField<'datetimeRange', readonly [number, number], DateFieldProps>
  | SearchField<
      'time',
      string,
      SearchControlProps<
        TimePickerProps,
        | 'formattedValue'
        | 'defaultFormattedValue'
        | 'valueFormat'
        | 'onUpdateFormattedValue'
        | 'onUpdate:formattedValue'
      >
    >
  | TreeField<'cascader', SearchControlProps<CascaderProps, 'multiple'>>
  | TreeField<'treeSelect', SearchControlProps<TreeSelectProps, 'multiple'>>
  | (SearchFieldBase<TableProSearchValue> & {
      type: 'custom'
      render: (context: {
        value: TableProSearchValue | null
        setValue: (value: TableProSearchValue | null) => void
        values: TableProSearchValues
        inputId: string
        labelId: string
      }) => VNodeChild
    })

type ColumnSearchField<Field = TableProSearchFieldConfig> =
  Field extends TableProSearchFieldConfig
    ? Omit<Field, 'key' | 'label'> & Partial<Pick<Field, 'key' | 'label'>>
    : never

export type TableProColumn = NonNullable<DataTableProps['columns']>[number] & {
  search?: boolean | ColumnSearchField
  children?: TableProColumn[]
}

export interface TableProSearchSubmission {
  values: TableProSearchValues
  params: Readonly<Record<string, unknown>>
  reason: 'submit' | 'reset'
}

export interface TableProSearchActions {
  submit: () => Promise<boolean>
  reset: () => Promise<boolean>
  collapsed: boolean
  canCollapse: boolean
  setCollapsed: (value: boolean) => void
  defaultActions: VNodeChild
}

export interface TableProSearchOptions {
  fields?: readonly TableProSearchFieldConfig[]
  initialValues?: TableProSearchValues
  defaultCollapsed?: boolean
  collapsedRows?: number
  maxColumns?: number
  labelPlacement?: 'left' | 'top'
  labelWidth?: number | 'auto'
  searchText?: string
  resetText?: string
  submitMode?: 'manual' | 'change'
  debounce?: number
  renderActions?: (actions: TableProSearchActions) => VNodeChild
}

export type TableProSearchConfig =
  false | readonly TableProSearchFieldConfig[] | TableProSearchOptions

export type PropsComponentPopselectKeys = 'striped' | 'bordered'
