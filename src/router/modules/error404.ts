import { t } from '@/hooks'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/type'

const error404: AppRouteRecordRaw = {
  path: '/:catchAll(.*)',
  name: 'ErrorPage',
  component: () => import('@/error/views/Error404/index'),
  meta: {
    i18nKey: t('menu.Error'),
    icon: 'error',
    hidden: true,
    sameLevel: true,
  },
}

export default error404
