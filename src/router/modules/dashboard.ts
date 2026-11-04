import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const dashboard: AppRouteRecordRaw = {
  path: '/dashboard',
  component: routeView('dashboard'),
  meta: {
    i18nKey: t('menu.Dashboard'),
    icon: 'navigation/dashboard',
    order: 0,
  },
}

export default dashboard
