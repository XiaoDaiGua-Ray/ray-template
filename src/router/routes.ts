import Layout from '@/layout/index'
import { getAppRawRoutes } from './routeModules'
import { ROOT_ROUTE } from '@/app-config/appConfig'
import { expandRoutes } from '@/router/helper/expandRoutes'

export default async () => [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/login/index'),
  },
  {
    path: '/',
    name: 'layout',
    redirect: ROOT_ROUTE.path,
    component: Layout,
    children: expandRoutes(getAppRawRoutes()),
  },
]
