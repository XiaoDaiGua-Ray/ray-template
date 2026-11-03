import { t } from '@/hooks/web/useI18n'
import type { AppRouteRecordRaw } from '@/router/types'

export default {
  path: '/layout-demo',
  name: 'LayoutDemo',
  component: () => import('@/views/demo/layout-demo'),
  meta: { i18nKey: t('menu.LayoutDemo'), icon: 'navigation/menu', order: 1 },
} satisfies AppRouteRecordRaw
