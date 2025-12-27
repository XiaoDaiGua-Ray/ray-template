import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const qrcode: AppRouteRecordRaw = {
  path: '/qrcode',
  component: () => import('@/views/demo/qrcode/index'),
  meta: {
    i18nKey: t('menu.QRCode'),
    icon: 'other',
    order: 2,
  },
}

export default qrcode
