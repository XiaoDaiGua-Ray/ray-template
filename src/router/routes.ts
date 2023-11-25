import Layout from '@/layout'
import { appExpandRoutes } from './appRouteModules'
import { useRootRoute } from '@/hooks/template'

export default async () => {
  const { getRootPath } = useRootRoute()

  return [
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
      redirect: getRootPath.value,
      component: Layout,
      children: appExpandRoutes,
    },
  ]
}
