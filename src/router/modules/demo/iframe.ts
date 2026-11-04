import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import type { AppRouteRecordRaw } from '@/router/types'

const iframe: AppRouteRecordRaw = {
  path: '/iframe',
  component: routeView('demo/iframe'),
  meta: {
    icon: 'navigation/other',
    order: 2,
    noLocalTitle: 'iframe',
  },
}

export default iframe
