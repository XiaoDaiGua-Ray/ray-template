import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const scrollReveal: AppRouteRecordRaw = {
  path: '/scroll-reveal',
  component: routeView('demo/scroll-reveal'),
  meta: {
    i18nKey: t('menu.scrollReveal'),
    icon: 'navigation/other',
    hidden: true,
  },
}

export default scrollReveal
