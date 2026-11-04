import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const qrcode: AppRouteRecordRaw = {
  path: '/qrcode',
  component: routeView('demo/qrcode'),
  meta: {
    i18nKey: t('menu.QRCode'),
    icon: 'navigation/other',
    order: 2,
  },
}

export default qrcode
