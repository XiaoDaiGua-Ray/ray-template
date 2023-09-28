import { t } from '@/hooks/web/index'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

const table: AppRouteRecordRaw = {
  path: '/table',
  name: 'TableView',
  component: () => import('@/views/demo/table/index'),
  meta: {
    i18nKey: t('menu.Table'),
    icon: 'other',
    order: 2,
  },
}

export default table
