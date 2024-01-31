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
import type { PrintDomOptions } from '@/utils'

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

export type OverridesTableColumn<T = Recordable> = C | DataTableColumn<T>

export interface TableInst extends Omit<TableProvider, 'wrapperRef'> {
  rTableInst: Omit<DataTableInst, 'clearFilter'>
}

export type PropsComponentPopselectKeys = 'striped' | 'bordered'
