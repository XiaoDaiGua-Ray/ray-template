import type { SettingState } from '@/store/modules/setting/types'
import type { InjectionKey, Reactive } from 'vue'
import type { DebouncedFunc } from 'lodash-es'

interface SettingDrawerInjectKey extends SettingState {
  throttleSetupAppMenu: DebouncedFunc<() => void>
}

export const SETTING_DRAWER_INJECT_KEY: Reactive<
  InjectionKey<Partial<SettingDrawerInjectKey>>
> = Symbol('segmentDrawer')
