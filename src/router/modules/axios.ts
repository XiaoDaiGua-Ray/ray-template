import type { AppRouteRecordRaw } from '@/router/type'

const axios: AppRouteRecordRaw = {
  path: '/axios',
  name: 'Axios',
  component: () => import('@/views/axios/index'),
  meta: {
    i18nKey: 'Axios',
    icon: 'axios',
    order: 3,
    keepAlive: true,
  },
}

export default axios
