import type { AppRouteRecordRaw } from '@/router/type'

const echart: AppRouteRecordRaw = {
  path: '/echart',
  name: 'Echart',
  component: () => import('@/views/echart/index'),
  meta: {
    i18nKey: 'Echart',
    icon: 'echart',
    order: 1,
  },
}

export default echart
