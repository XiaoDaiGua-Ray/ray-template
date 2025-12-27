import type { Recordable } from '@/types'
import type {
  DropdownDividerOption,
  DropdownGroupOption,
  DropdownOption,
  DropdownRenderOption,
} from 'naive-ui'

export interface AppCurrentAppMessages {
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
    message: GlobalRecordable
  }
}

export type I18nModules = Record<string, { default: Recordable }>
