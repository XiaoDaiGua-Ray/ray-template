import { t } from '@/hooks/web/useI18n'
import type { AppRouteRecordRaw } from '@/router/types'

const iframe: AppRouteRecordRaw = {
  path: '/iframe',
  component: () => import('@/views/demo/iframe/index'),
  meta: {
    icon: 'other',
    order: 2,
    noLocalTitle: 'iframe',
  },
}

export default iframe
