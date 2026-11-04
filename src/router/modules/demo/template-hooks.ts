import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const axios: AppRouteRecordRaw = {
  path: '/template-hooks',
  name: 'TemplateHooks',
  component: routeView('demo/template-hooks'),
  meta: {
    i18nKey: t('menu.TemplateHooks'),
    icon: 'navigation/other',
    order: 1,
  },
}

export default axios
