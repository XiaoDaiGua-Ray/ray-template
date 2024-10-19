import type { AppMenuOption, MenuTagOptions, AppMenuKey, AnyFC } from '@/types'

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
  value: Partial<MenuState[T]>,
  cb?: AnyFC,
) => void
