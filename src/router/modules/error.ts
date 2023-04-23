import type { AppRouteRecordRaw } from '@/router/type'

const error: AppRouteRecordRaw = {
  path: '/error',
  name: 'ErrorPage',
  component: () => import('@/views/error/index'),
  meta: {
    i18nKey: 'Error',
    icon: 'error',
    hidden: true,
  },
}

export default error
