import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/types'

const r: AppRouteRecordRaw = {
  path: '/draggable-card',
  component: () => import('@/views/demo/draggable-card'),
  meta: {
    i18nKey: t('menu.DraggableCard'),
    icon: 'other',
    order: 2,
    extra: {
      label: 'drag',
    },
  },
}

export default r
