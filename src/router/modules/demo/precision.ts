import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const precision: AppRouteRecordRaw = {
  path: '/precision',
  component: () => import('@/views/demo/precision/index'),
  meta: {
    i18nKey: t('menu.CalculatePrecision'),
    icon: 'other',
    order: 2,
  },
}

export default precision
