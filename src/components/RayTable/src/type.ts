import type {
  DropdownOption,
  DropdownGroupOption,
  DropdownDividerOption,
  DropdownRenderOption,
  DataTableBaseColumn,
} from 'naive-ui'
import type { ComputedRef, WritableComputedRef } from 'vue'

export interface ActionOptions extends DataTableBaseColumn {
  leftFiexActivated?: boolean // 向左固定
  rightFiexActivated?: boolean // 向右固定
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
