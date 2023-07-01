import { t } from '@/locales/useI18n'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

const table: AppRouteRecordRaw = {
  path: '/table',
  name: 'TableView',
  component: () => import('@/views/table/index'),
  meta: {
    i18nKey: t('menu.Table'),
    icon: 'other',
    order: 2,
  },
}

export default table
