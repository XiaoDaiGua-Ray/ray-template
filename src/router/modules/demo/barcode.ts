import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/types'

const barcode: AppRouteRecordRaw = {
  path: 'barcode',
  component: () => import('@/views/demo/barcode-demo'),
  meta: {
    i18nKey: t('menu.Barcode'),
    icon: 'other',
    order: 2,
    extra: {
      label: 'new',
    },
  },
}

export default barcode
