import { t } from '@/locales/useI18n'

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
