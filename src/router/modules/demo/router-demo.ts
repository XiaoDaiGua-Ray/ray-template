import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const routerDemo: AppRouteRecordRaw = {
  path: '/router-demo',
  component: LAYOUT,
  meta: {
    i18nKey: t('menu.RouterDemo'),
    icon: 'navigation/other',
    order: 3,
  },
  children: [
    {
      path: 'router-demo-home',
      component: routeView('demo/router-demo/router-demo-home'),
      meta: {
        noLocalTitle: '人员信息(平级模式)',
      },
    },
    {
      path: 'router-demo-detail',
      component: routeView('demo/router-demo/router-demo-detail'),
      meta: {
        noLocalTitle: '信息详情',
        sameLevel: true,
      },
    },
  ],
}

export default routerDemo
