import type {
  DropdownOption,
  DropdownGroupOption,
  DropdownDividerOption,
  DropdownRenderOption,
  DataTableInst,
  DataTableColumn,
  DataTableBaseColumn,
} from 'naive-ui'
import type { VNode, VNodeChild } from 'vue'
import type PrintConfiguration from 'print-js'
import type { Recordable } from '@/types/modules/helper'

export type TableActionIcon = string | (() => VNode)

export type DropdownMixedOption =
  | DropdownOption
  | DropdownGroupOption
  | DropdownDividerOption
  | DropdownRenderOption

export interface DownloadTableOptions {
  fileName?: string
}

export interface PrintTableOptions {
  printOptions?: Omit<PrintConfiguration.Configuration, 'printable' | 'type'>
  type?: PrintConfiguration.PrintTypes
}

export interface TableProvider {
  uuidWrapper: string
  uuidTable: string
  wrapperRef: Ref<HTMLElement | null>
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

export interface TableInst extends TableProvider {
  rTableInst: Omit<DataTableInst, 'clearFilter'>
}
