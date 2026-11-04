import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const echart: AppRouteRecordRaw = {
  path: '/echart',
  component: routeView('demo/echart'),
  meta: {
    i18nKey: t('menu.Echart'),
    icon: 'navigation/echart',
    order: 1,
    extra: {
      label: 'useChart',
    },
  },
}

export default echart
