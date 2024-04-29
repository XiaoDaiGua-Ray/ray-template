import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/types'

const table: AppRouteRecordRaw = {
  path: '/table',
  component: () => import('@/views/demo/table/index'),
  meta: {
    i18nKey: t('menu.Table'),
    icon: 'other',
    order: 2,
    extra: {
      label: 'useTable',
    },
  },
}

export default table
