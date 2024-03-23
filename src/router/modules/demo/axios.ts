import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/types'

const axios: AppRouteRecordRaw = {
  path: '/axios',
  name: 'RAxios',
  component: () => import('@/views/demo/axios/index'),
  meta: {
    i18nKey: t('menu.Axios'),
    icon: 'axios',
    order: 3,
    keepAlive: true,
  },
}

export default axios
