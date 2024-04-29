import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/types'

const error404: AppRouteRecordRaw = {
  path: '/:catchAll(.*)',
  component: () => import('@/views/error/views/Error404'),
  meta: {
    i18nKey: t('menu.Error'),
    icon: 'error',
    hidden: true,
    sameLevel: true,
  },
}

export default error404
