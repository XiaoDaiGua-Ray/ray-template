import type {
  DropdownOption,
  DropdownGroupOption,
  DropdownDividerOption,
  DropdownRenderOption,
  DataTableBaseColumn,
} from 'naive-ui'
import type { ComputedRef, WritableComputedRef, VNode } from 'vue'

export interface ActionOptions extends DataTableBaseColumn {
  leftFixedActivated?: boolean // 向左固定
  rightFixedActivated?: boolean // 向右固定
  resizeColumnActivated?: boolean // 拖拽表格列
}

export type FixedType = 'left' | 'right' | undefined

export interface TableSettingFixedPopoverIcon {
  element: ActionOptions
  name: string
  tooltip: string
  fn: Function
  index: number
  fixed: FixedType
  key: 'leftFixedActivated' | 'rightFixedActivated'
}

export type DropdownMixedOption =
  | DropdownOption
  | DropdownGroupOption
  | DropdownDividerOption
  | DropdownRenderOption

export type SettingOptions = WritableComputedRef<ActionOptions[]>

export type RightClickMenu = ComputedRef<DropdownMixedOption[]>

export interface TableSettingProvider {
  modelRightClickMenu: RightClickMenu
  modelColumns: SettingOptions
}

export interface ExportExcelProvider {
  exportTip: string
  exportType: string
  exportPositiveText: string
  exportNegativeText: string
  exportFilename: string
}

export type ColumnKey = string | number

declare type VNodeChildAtom =
  | VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | void

export declare type VNodeArrayChildren = Array<
  VNodeArrayChildren | VNodeChildAtom
>

export declare type VNodeChild = VNodeChildAtom | VNodeArrayChildren

export declare type TableColumnTitle =
  | string
  | ((column: DataTableBaseColumn) => VNodeChild)

export interface ExportExcelHeader extends DataTableBaseColumn {}
