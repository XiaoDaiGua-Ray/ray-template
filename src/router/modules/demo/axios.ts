import { t } from '@/hooks/web/index'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

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
