import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import type { AppRouteRecordRaw } from '@/router/types'

export default {
  path: '/layout-demo',
  name: 'LayoutDemo',
  component: routeView('demo/layout-demo'),
  meta: { i18nKey: t('menu.LayoutDemo'), icon: 'navigation/menu', order: 1 },
} satisfies AppRouteRecordRaw
