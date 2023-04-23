import Layout from '@/layout/index'
import childrenRoutes from './route-module'

const {
  rootRoute: { path },
} = __APP_CFG__

export const constantRoutes = [
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
    children: childrenRoutes,
  },
  {
    /** 错误页面(404) */
    path: '/:catchAll(.*)',
    name: 'error-page',
    component: Layout,
    redirect: '/error',
  },
]

/**
 *
 * 主路由表配置
 * 例如: `login` `layout` 等
 */
