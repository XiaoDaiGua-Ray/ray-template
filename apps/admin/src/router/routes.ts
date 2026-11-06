import Layout from '@/layout'
import type { RouteRecordRaw } from 'vue-router'
import { appExpandRoutes } from './app-route-modules'
import {
  ACCOUNT_PROFILE_NAME,
  ACCOUNT_PROFILE_PATH,
  FORBIDDEN_ROUTE_PATH,
  NOT_FOUND_PAGE_PATH,
  NOT_FOUND_ROUTE_PATH,
  ROUTE_MANAGEMENT_JSON_PATH,
  ROUTE_MANAGEMENT_PATH,
  SERVER_ERROR_ROUTE_PATH,
  WELCOME_ROUTE_PATH,
} from './constant'

const legacyRedirects = [
  { path: '/tables', redirect: '/tables/basic' },
  { path: '/table', redirect: '/tables/basic' },
  { path: '/table-pro', redirect: '/tables/remote' },
  { path: '/mock-demo', redirect: '/tables/remote' },
  { path: '/table-auto-height', redirect: '/tables/auto-height' },
]

export const constantRoutes: RouteRecordRaw[] = [
  { path: '/', name: 'RLogin', component: () => import('@/views/login') },
  { path: '/', name: 'RLayout', component: Layout },
]

export function getLayoutRoutes(): RouteRecordRaw[] {
  const routes = appExpandRoutes()
  const occupiedPaths = new Set(
    routes.flatMap(({ path, alias }) => [
      path.toLowerCase(),
      ...[alias ?? []].flat().map((entry) => entry.toLowerCase()),
    ]),
  )

  return [
    ...(routes as unknown as RouteRecordRaw[]),
    ...legacyRedirects.filter(
      ({ path, redirect }) =>
        !occupiedPaths.has(path) && occupiedPaths.has(redirect),
    ),
    {
      path: ROUTE_MANAGEMENT_PATH,
      redirect: ROUTE_MANAGEMENT_JSON_PATH,
      meta: { requiredPermission: 'routes:write' },
    },
  ]
}

export function getAccountProfileRoute(): RouteRecordRaw {
  return {
    path: ACCOUNT_PROFILE_PATH,
    name: ACCOUNT_PROFILE_NAME,
    component: () => import('@/views/account-profile'),
    meta: { i18nKey: 'account.profile', hidden: true },
  }
}

/**
 *
 * @returns 不进入业务菜单与标签的工作区状态路由，供应用与隔离文档示例复用。
 */
export const getSystemRoutes = (): RouteRecordRaw[] => [
  {
    path: WELCOME_ROUTE_PATH,
    name: 'RWelcome',
    component: () => import('@/views/welcome'),
    meta: { i18nKey: 'workspaceStates.welcome.title', hidden: true },
  },
  {
    path: FORBIDDEN_ROUTE_PATH,
    name: 'ErrorPage403',
    component: () => import('@/views/error/views/Error403'),
    meta: { i18nKey: 'workspaceStates.forbidden.title', hidden: true },
  },
  {
    path: NOT_FOUND_PAGE_PATH,
    name: 'ErrorPage404',
    component: () => import('@/views/error/views/Error404'),
    meta: { i18nKey: 'workspaceStates.notFound.title', hidden: true },
  },
  {
    path: SERVER_ERROR_ROUTE_PATH,
    name: 'ErrorPage500',
    component: () => import('@/views/error/views/Error500'),
    meta: { i18nKey: 'workspaceStates.serverError.title', hidden: true },
  },
  {
    path: NOT_FOUND_ROUTE_PATH,
    name: 'RNotFound',
    redirect: (to) => ({
      path: NOT_FOUND_PAGE_PATH,
      query: { from: to.fullPath },
    }),
  },
]
