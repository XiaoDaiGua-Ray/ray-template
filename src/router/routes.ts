import Layout from '@/layout'
import type { RouteRecordRaw } from 'vue-router'
import { appExpandRoutes } from './app-route-modules'
import { NOT_FOUND_ROUTE_PATH } from './constant'

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
      path: NOT_FOUND_ROUTE_PATH,
      name: 'RNotFound',
      component: () => import('@/views/error/views/Error404'),
      meta: {
        i18nKey: 'menu.Error',
        icon: 'status/error',
        hidden: true,
        sameLevel: true,
      },
    },
  ]
}
