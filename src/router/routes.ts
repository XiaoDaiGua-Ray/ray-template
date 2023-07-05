import Layout from '@/layout/index'
import { getAppRawRoutes } from './routeModules'
import { ROOT_ROUTE } from '@/appConfig/appConfig'
import { expandRoutes } from '@/router/helper/expandRoutes'

const { path } = ROOT_ROUTE

export default () => [
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
    children: expandRoutes(getAppRawRoutes()),
  },
  {
    path: '/:catchAll(.*)',
    name: 'errorPage',
    component: Layout,
    redirect: '/error',
  },
]
