import { t } from '@/locales/useI18n'

import type { AppRouteRecordRaw } from '@/router/type'

const axios: AppRouteRecordRaw = {
  path: '/axios',
  name: 'RAxios',
  component: () => import('@/views/axios/index'),
  meta: {
    i18nKey: t('menu.Axios'),
    icon: 'axios',
    order: 3,
    keepAlive: true,
  },
}

export default axios
