import { t } from '@/hooks'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/types'

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
