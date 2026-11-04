import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const previewSVGIcons: AppRouteRecordRaw = {
  path: '/svg-icons',
  component: routeView('demo/svg-icons'),
  meta: {
    i18nKey: t('menu.SvgIcon'),
    icon: 'navigation/other',
    order: 3,
  },
}

export default previewSVGIcons
