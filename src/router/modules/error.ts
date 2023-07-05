import { t } from '@/locales/useI18n'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

const error: AppRouteRecordRaw = {
  path: '/error',
  name: 'ErrorPage',
  component: () => import('@/error/views/Error404/index'),
  meta: {
    i18nKey: t('menu.Error'),
    icon: 'error',
    hidden: true,
  },
}

export default error
