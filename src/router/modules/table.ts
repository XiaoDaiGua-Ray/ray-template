import type { AppRouteRecordRaw } from '@/router/type'

const table: AppRouteRecordRaw = {
  path: '/table',
  name: 'TableView',
  component: () => import('@/views/table/index'),
  meta: {
    i18nKey: 'Table',
    icon: 'table',
    order: 2,
  },
}

export default table
