import type { AppMenuOption, MenuTagOptions, AppMenuKey } from '@/types'

export interface MenuState {
  menuKey: AppMenuKey
  options: AppMenuOption[]
  collapsed: boolean
  menuTagOptions: MenuTagOptions[]
  breadcrumbOptions: AppMenuOption[]
  currentMenuOption: AppMenuOption | null
}
