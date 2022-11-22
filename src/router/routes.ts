import Layout from '@/layout/index'
import childrenRoutes from './modules/index'

export const constantRoutes = [
  {
    path: '/',
    name: 'layout',
    redirect: '/dashboard',
    component: Layout,
    children: childrenRoutes,
  },
]

/**
 *
 * 主路由表配置
 * 例如: `login` `layout` 等
 */
