import type { SettingState } from '@/store/modules/setting/types'
import type { DebouncedFunc } from 'lodash-es'
import type { InjectionKey, Reactive } from 'vue'

interface SettingDrawerInjectKey extends SettingState {
  throttleSetupAppMenu: DebouncedFunc<() => Promise<void>>
}

export const SETTING_DRAWER_INJECT_KEY: Reactive<
  InjectionKey<Partial<SettingDrawerInjectKey>>
> = Symbol('segmentDrawer')
