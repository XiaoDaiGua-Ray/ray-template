import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const mockDemo: AppRouteRecordRaw = {
  path: '/modal-demo',
  component: routeView('demo/modal-demo'),
  meta: {
    i18nKey: t('menu.Modal'),
    icon: 'navigation/other',
    order: 3,
  },
}

export default mockDemo
