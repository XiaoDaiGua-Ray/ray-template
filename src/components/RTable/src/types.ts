import type {
  DropdownOption,
  DropdownGroupOption,
  DropdownDividerOption,
  DropdownRenderOption,
  DataTableInst,
  DataTableColumn,
  DataTableBaseColumn,
} from 'naive-ui'
import type { VNode } from 'vue'
import type { Recordable } from '@/types'
import type { PrintDomOptions } from '@/utils/dom'

export type TableActionIcon = string | (() => VNode)

export type DropdownMixedOption =
  | DropdownOption
  | DropdownGroupOption
  | DropdownDividerOption
  | DropdownRenderOption

export interface DownloadCsvTableOptions {
  fileName?: string
  keepOriginalData?: boolean
}

export interface PrintTableOptions extends PrintDomOptions {}

export interface TableProvider {
  uuidWrapper: string
  uuidTable: string
  wrapperRef: Ref<HTMLElement | undefined>
}

export interface C extends DataTableBaseColumn {
  leftFixedActivated?: boolean
  rightFixedActivated?: boolean
  resizable?: boolean
  isResizable?: boolean
  isLeftFixedActivated?: boolean
  isRightFixedActivated?: boolean
  children?: C[]
}

export interface RTableInst extends Omit<DataTableInst, 'clearFilter'> {}

export type OverridesTableColumn<T = Recordable> = C | DataTableColumn<T>

export interface TableInst extends Omit<TableProvider, 'wrapperRef'> {
  rTableInst: RTableInst
}

export type PropsComponentPopselectKeys = 'striped' | 'bordered'

type DownloadCsvParameters = Parameters<RTableInst['downloadCsv']>

export type CsvOptionsType = DownloadCsvParameters[0]

type FiltersParameters = Parameters<RTableInst['filters']>

export type FilterState = FiltersParameters[0]

export type ScrollToOptions = RTableInst['scrollTo']

type SortParameters = Parameters<RTableInst['sort']>

export type ColumnKey = SortParameters[0]

export type SortOrder = SortParameters[1]
