import type {
  DropdownOption,
  DropdownGroupOption,
  DropdownDividerOption,
  DropdownRenderOption,
  DataTableBaseColumn,
} from 'naive-ui'
import type { ComputedRef, WritableComputedRef } from 'vue'

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

export interface RayTableProvider {
  modelRightClickMenu: RightClickMenu
  modelColumns: SettingOptions
}
