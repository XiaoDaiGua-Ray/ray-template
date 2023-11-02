import { t } from '@/hooks/web/index'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

const qrcode: AppRouteRecordRaw = {
  path: '/qrcode',
  name: 'RQRCode',
  component: () => import('@/views/demo/qrcode/index'),
  meta: {
    i18nKey: t('menu.QRCode'),
    icon: 'other',
    order: 3,
  },
}

export default qrcode
