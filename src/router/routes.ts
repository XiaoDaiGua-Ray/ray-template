import Layout from '@/layout'
import { appExpandRoutes } from './app-route-modules'
import { t } from '@/hooks/web/useI18n'

export default [
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
    component: Layout,
    children: [
      ...appExpandRoutes(),
      /**
       *
       * @description
       * 404 页面一定要放在最后面，避免奇奇怪怪的问题。
       */
      {
        path: '/:catchAll(.*)',
        component: () => import('@/views/error/views/Error404'),
        meta: {
          i18nKey: t('menu.Error'),
          icon: 'error',
          hidden: true,
          sameLevel: true,
        },
      },
    ],
  },
]
