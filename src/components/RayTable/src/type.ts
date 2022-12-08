import type {
  DropdownOption,
  DropdownGroupOption,
  DropdownDividerOption,
  DropdownRenderOption,
  DataTableColumns,
} from 'naive-ui'

export interface ActionOptions extends DataTableColumns {}

export type DropdownMixedOption =
  | DropdownOption
  | DropdownGroupOption
  | DropdownDividerOption
  | DropdownRenderOption
