import Layout from '@/layout/index'
import childrenRoutes from './routeModules'
import { ROOT_ROUTE } from '@/appConfig/appConfig'
import { expandRoutes } from '@/router/helper/expandRoutes'

const { path } = ROOT_ROUTE

export default [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/login/index'),
  },
  {
    path: '/',
    name: 'layout',
    redirect: path,
    component: Layout,
    children: expandRoutes(childrenRoutes),
  },
  {
    /** 错误页面(404) */
    path: '/:catchAll(.*)',
    name: 'error-page',
    component: Layout,
    redirect: '/error',
  },
]
