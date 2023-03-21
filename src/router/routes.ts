import Layout from '@/layout/index'
import childrenRoutes from './modules/index'

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
    path: '/:catchAll(.*)',
    name: 'error-page',
    component: () => import('@/views/error/index'),
  },
]

/**
 *
 * 主路由表配置
 * 例如: `login` `layout` 等
 */
