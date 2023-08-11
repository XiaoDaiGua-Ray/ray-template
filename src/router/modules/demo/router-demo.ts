import { t } from '@/locales/useI18n'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

const routerDemo: AppRouteRecordRaw = {
  path: '/router-demo',
  name: 'RouterDemoRoot',
  component: LAYOUT,
  meta: {
    i18nKey: t('menu.RouterDemo'),
    icon: 'other',
    order: 3,
  },
  children: [
    {
      path: 'router-demo-home',
      name: 'RouterDemoHome',
      component: () =>
        import('@/views/demo/router-demo/router-demo-home/index'),
      meta: {
        noLocalTitle: '人员信息(平级模式)',
      },
    },
    {
      path: 'router-demo-detail',
      name: 'RouterDemoDetail',
      component: () =>
        import('@/views/demo/router-demo/router-demo-detail/index'),
      meta: {
        noLocalTitle: '信息详情',
        hidden: true,
        sameLevel: true,
      },
    },
  ],
}

export default routerDemo
