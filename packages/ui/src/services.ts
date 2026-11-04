import type { IconName } from '@ray-template/icons'
import type { createStorage } from '@ray-template/utils/storage'
import { hasInjectionContext, inject, provide } from 'vue'
import type { InjectionKey } from 'vue'

export interface UiServices {
  locale?: () => string
  dark?: () => boolean
  chartTheme?: string
  translate?: (key: string, params?: Record<string, unknown>) => string
  columnStorage?: ReturnType<typeof createStorage>
  reportError?: (message: string) => void
  iconUrl?: (name: IconName, prefix: string) => string
}

const servicesKey: InjectionKey<UiServices> = Symbol('ray-ui-services')

export const provideUiServices = (services: UiServices) =>
  provide(servicesKey, services)
export const useUiServices = () =>
  hasInjectionContext() ? inject(servicesKey, {}) : {}
