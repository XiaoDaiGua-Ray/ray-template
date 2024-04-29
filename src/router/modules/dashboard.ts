import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/types'

const dashboard: AppRouteRecordRaw = {
  path: '/dashboard',
  component: () => import('@/views/dashboard'),
  meta: {
    i18nKey: t('menu.Dashboard'),
    icon: 'dashboard',
    order: 0,
  },
}

export default dashboard
