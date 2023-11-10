import Layout from '@/layout/index'
import { getAppRawRoutes } from './appRouteModules'
import { ROOT_ROUTE } from '@/app-config/appConfig'
import { expandRoutes } from '@/router/helper/expandRoutes'

export default async () => [
  /**
   *
   * 首页（一般为 Login 页面）
   * 整个模板默认导航地址
   */
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/login/index'),
  },
  /**
   *
   * App Layout 核心页面（一般为登陆后展示的页面）
   */
  {
    path: '/',
    name: 'layout',
    redirect: ROOT_ROUTE.path,
    component: Layout,
    children: expandRoutes(getAppRawRoutes()),
  },
]
