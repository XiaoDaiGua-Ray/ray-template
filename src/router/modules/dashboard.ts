import type { AppRouteRecordRaw } from '@/router/type'

const dashboard: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/views/dashboard/index'),
  meta: {
    i18nKey: 'Dashboard',
    icon: 'dashboard',
  },
}

export default dashboard
