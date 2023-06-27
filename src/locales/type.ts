import type {
  DropdownOption,
  DropdownGroupOption,
  DropdownDividerOption,
  DropdownRenderOption,
} from 'naive-ui'

export interface CurrentAppMessages {
  'zh-CN': object
  'en-US': object
}

export type AppLocalesDropdownMixedOption =
  | DropdownOption
  | DropdownGroupOption
  | DropdownDividerOption
  | DropdownRenderOption

export interface AppLocalesModules {
  default: {
    message: UnknownObjectKey
  }
}
