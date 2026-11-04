import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const axios: AppRouteRecordRaw = {
  path: '/axios',
  name: 'RAxios',
  component: routeView('demo/axios'),
  meta: {
    i18nKey: t('menu.Axios'),
    icon: 'logo/axios',
    order: 3,
    keepAlive: true,
  },
}

export default axios
