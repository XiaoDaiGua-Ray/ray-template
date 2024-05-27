import type { AppMenuOption, MenuTagOptions, AppMenuKey } from '@/types'

export interface MenuState {
  menuKey: AppMenuKey
  options: AppMenuOption[]
  collapsed: boolean
  menuTagOptions: MenuTagOptions[]
  breadcrumbOptions: AppMenuOption[]
  currentMenuOption: AppMenuOption | null
}

type PickUpdateKeys = 'collapsed' | 'currentMenuOption'

export type UpdateMenuState = <T extends keyof Pick<MenuState, PickUpdateKeys>>(
  key: T,
  value: MenuState[T],
) => void
