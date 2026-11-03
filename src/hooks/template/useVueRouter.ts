import { router } from '@/router'

/**
 *
 * @description
 * 读取模板的共享 Router 实例，可在 Vue setup 之外调用。
 *
 * @returns Router 及其响应式 currentRoute。
 */
export const useVueRouter = () => ({ router })

export type UseVueRouterReturnType = ReturnType<typeof useVueRouter>
