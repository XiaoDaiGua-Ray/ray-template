import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const barcode: AppRouteRecordRaw = {
  path: 'barcode',
  component: routeView('demo/barcode-demo'),
  meta: {
    i18nKey: t('menu.Barcode'),
    icon: 'navigation/other',
    order: 2,
    extra: {
      label: 'new',
    },
  },
}

export default barcode
