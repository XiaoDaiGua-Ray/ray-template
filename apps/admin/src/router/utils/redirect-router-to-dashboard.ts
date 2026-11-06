import { useVueRouter } from '@/hooks/template/useVueRouter'
import { WELCOME_ROUTE_PATH } from '@/router/constant'

/**
 *
 * @param isReplace 是否替换当前历史记录，默认 true
 *
 * @description
 * 进入没有活动业务路由的工作区，不创建或激活业务标签。
 *
 * @returns Router 导航结果。
 */
export const redirectRouterToWorkspace = (isReplace = true) => {
  const { router } = useVueRouter()

  return isReplace
    ? router.replace(WELCOME_ROUTE_PATH)
    : router.push(WELCOME_ROUTE_PATH)
}

/**
 *
 * @deprecated 兼容旧导出名；现在进入空工作区，请改用 redirectRouterToWorkspace。
 */
export const redirectRouterToDashboard = redirectRouterToWorkspace
