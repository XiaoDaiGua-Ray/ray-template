import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const directive: AppRouteRecordRaw = {
  path: '/directive',
  component: routeView('demo/directive'),
  meta: {
    i18nKey: t('menu.Directive'),
    icon: 'navigation/other',
    order: 2,
    extra: {
      label: 'ellipsis',
    },
  },
}

export default directive
