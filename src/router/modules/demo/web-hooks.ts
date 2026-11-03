import { t } from '@/hooks/web/useI18n'
import type { AppRouteRecordRaw } from '@/router/types'

export default {
  path: '/web-hooks',
  name: 'WebHooks',
  component: () => import('@/views/demo/hooks/web-hooks'),
  meta: { i18nKey: t('menu.WebHooks'), icon: 'action/mouse', order: 1 },
} satisfies AppRouteRecordRaw
