import type { AnyFn, AppMenuKey, AppMenuOption, MenuTagOptions } from '@/types'

export interface MenuState {
  menuKey: AppMenuKey
  options: AppMenuOption[]
  collapsed: boolean
  menuTagOptions: MenuTagOptions[]
  breadcrumbOptions: AppMenuOption[]
  currentMenuOption: AppMenuOption | null
}
