import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import type { AppRouteRecordRaw } from '@/router/types'

export default {
  path: '/examples/assets',
  meta: { i18nKey: t('menu.DemoAssets'), icon: 'navigation/icons', order: 30 },
  children: [
    {
      path: '/svg-icons',
      component: routeView('demo/svg-icons'),
      meta: {
        i18nKey: t('menu.SvgIcon'),
        icon: 'navigation/icons',
      },
    },
    {
      path: '/qrcode',
      component: routeView('demo/qrcode'),
      meta: {
        i18nKey: t('menu.QRCode'),
        icon: 'navigation/qr_code',
      },
    },
    {
      path: '/barcode',
      component: routeView('demo/barcode-demo'),
      meta: {
        i18nKey: t('menu.Barcode'),
        icon: 'navigation/barcode',
        extra: {
          label: 'new',
        },
      },
    },
  ],
} satisfies AppRouteRecordRaw
