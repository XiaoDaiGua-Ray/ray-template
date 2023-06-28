import { t } from '@/locales/useI18n'

import type { AppRouteRecordRaw } from '@/router/type'

const precision: AppRouteRecordRaw = {
  path: '/precision',
  name: 'CalculatePrecision',
  component: () => import('@/views/precision/index'),
  meta: {
    i18nKey: t('menu.CalculatePrecision'),
    icon: 'other',
    order: 2,
  },
}

export default precision
