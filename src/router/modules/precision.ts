import type { AppRouteRecordRaw } from '@/router/type'

const precision: AppRouteRecordRaw = {
  path: '/precision',
  name: 'CalculatePrecision',
  component: () => import('@/views/precision/index'),
  meta: {
    i18nKey: 'CalculatePrecision',
    icon: 'rely',
    order: 2,
  },
}

export default precision
