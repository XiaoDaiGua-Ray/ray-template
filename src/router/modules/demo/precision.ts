import { t } from '@/hooks/web'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/type'

const precision: AppRouteRecordRaw = {
  path: '/precision',
  name: 'CalculatePrecision',
  component: () => import('@/views/demo/precision/index'),
  meta: {
    i18nKey: t('menu.CalculatePrecision'),
    icon: 'other',
    order: 2,
  },
}

export default precision
