import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import type { AppRouteRecordRaw } from '@/router/types'

export default {
  path: '/web-hooks',
  name: 'WebHooks',
  component: routeView('demo/hooks/web-hooks'),
  meta: { i18nKey: t('menu.WebHooks'), icon: 'action/mouse', order: 1 },
} satisfies AppRouteRecordRaw
