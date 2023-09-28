import { t } from '@/hooks/web/index'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

const dashboard: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'RDashboard',
  component: () => import('@/views/dashboard/index'),
  meta: {
    i18nKey: t('menu.Dashboard'),
    icon: 'dashboard',
    order: 0,
  },
}

export default dashboard
