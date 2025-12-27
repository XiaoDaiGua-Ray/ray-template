import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const segment: AppRouteRecordRaw = {
  path: '/segment',
  component: () => import('@/views/demo/segment'),
  meta: {
    i18nKey: t('menu.Segment'),
    icon: 'other',
    order: 3,
    extra: {
      label: 'segment',
    },
  },
}

export default segment
