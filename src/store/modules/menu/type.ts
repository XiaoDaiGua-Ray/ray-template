import type {
  AppMenuOption,
  MenuTagOptions,
  AppMenuKey,
} from '@/types/modules/app'

export interface MenuState {
  menuKey: AppMenuKey
  options: AppMenuOption[]
  collapsed: boolean
  menuTagOptions: MenuTagOptions[]
  breadcrumbOptions: AppMenuOption[]
  currentMenuOption: AppMenuOption | null
}
