import type { IconName } from '@ray-template/icons'
import type { createStorage } from '@ray-template/utils/storage'
import { hasInjectionContext, inject, provide } from 'vue'
import type { InjectionKey } from 'vue'

export interface UiServices {
  locale?: () => string
  dark?: () => boolean
  chartTheme?: string | (() => string)
  translate?: (key: string, params?: Record<string, unknown>) => string
  columnStorage?: ReturnType<typeof createStorage>
  reportError?: (message: string) => void
  reportSuccess?: (message: string) => void
  iconUrl?: (name: IconName, prefix: string) => string
}

const servicesKey: InjectionKey<UiServices> = Symbol('ray-ui-services')

/**
 *
 * @param services 宿主提供的翻译、主题、图标与存储适配
 *
 * @description
 * 在当前组件作用域提供共享 UI 服务，响应式变化由传入的读取函数负责。
 */
export const provideUiServices = (services: UiServices) =>
  provide(servicesKey, services)
/**
 *
 * @description
 * 读取最近的宿主服务；独立组件或无注入上下文时使用空配置，由组件决定回退行为。
 *
 * @returns 当前 UI 服务适配
 */
export const useUiServices = () =>
  hasInjectionContext() ? inject(servicesKey, {}) : {}
