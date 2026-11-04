import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const r: AppRouteRecordRaw = {
  path: '/flow',
  component: routeView('demo/flow-demo'),
  meta: {
    i18nKey: t('menu.Flow'),
    icon: 'navigation/other',
    order: 2,
  },
}

export default r
