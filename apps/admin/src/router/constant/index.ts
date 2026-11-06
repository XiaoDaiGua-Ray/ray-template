export const LAYOUT = () => import('@/layout/default/ContentWrapper')

export const NOT_FOUND_ROUTE_PATH = '/:catchAll(.*)'

export const WELCOME_ROUTE_PATH = '/welcome'
export const FORBIDDEN_ROUTE_PATH = '/403'
export const NOT_FOUND_PAGE_PATH = '/404'
export const SERVER_ERROR_ROUTE_PATH = '/500'
export const ACCOUNT_PROFILE_PATH = '/account/profile'
export const ACCOUNT_PROFILE_NAME = 'AccountProfile'
export const SYSTEM_ROUTE_PATHS = [
  WELCOME_ROUTE_PATH,
  FORBIDDEN_ROUTE_PATH,
  NOT_FOUND_PAGE_PATH,
  SERVER_ERROR_ROUTE_PATH,
] as const
export const SYSTEM_ROUTE_NAMES = [
  'RWelcome',
  'ErrorPage403',
  'ErrorPage404',
  'ErrorPage500',
  'RNotFound',
] as const

/**
 *
 * @param route 已解析的路由或路由记录
 *
 * @returns 是否属于不进入业务菜单、标签和缓存的工作区状态页。
 */
export const isSystemRoute = (route: { name?: unknown; path?: string }) =>
  SYSTEM_ROUTE_NAMES.some((name) => name === route.name) ||
  SYSTEM_ROUTE_PATHS.some((path) => path === route.path) ||
  route.path === NOT_FOUND_ROUTE_PATH
export const ROUTE_MANAGEMENT_PATH = '/route-management'
export const ROUTE_MANAGEMENT_JSON_PATH = `${ROUTE_MANAGEMENT_PATH}/json`
