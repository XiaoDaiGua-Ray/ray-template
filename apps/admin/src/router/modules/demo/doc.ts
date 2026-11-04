import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import type { AppRouteRecordRaw } from '@/router/types'

export default {
  path: '/doc/doc-inside',
  name: 'RTemplateDoc',
  component: routeView('demo/doc'),
  meta: {
    i18nKey: t('menu.DocLocalInside'),
    icon: 'navigation/menu',
    order: 5,
  },
} satisfies AppRouteRecordRaw
