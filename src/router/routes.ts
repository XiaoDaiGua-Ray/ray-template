import Layout from '@/layout'
import { appExpandRoutes } from './appRouteModules'
import { useAppRoot } from '@/hooks'

export default async () => {
  const { getRootPath } = useAppRoot()

  return [
    /**
     *
     * 首页（一般为 Login 页面）
     * 整个模板默认导航地址
     */
    {
      path: '/',
      name: 'RLogin',
      component: () => import('@/views/login'),
    },
    /**
     *
     * App Layout 核心页面（一般为登陆后展示的页面）
     */
    {
      path: '/',
      name: 'RLayout',
      redirect: getRootPath.value,
      component: Layout,
      children: appExpandRoutes(),
    },
  ]
}
