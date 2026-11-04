import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const rely: AppRouteRecordRaw = {
  path: 'rely-about',
  component: routeView('demo/rely/views/rely-about'),
  meta: {
    i18nKey: t('menu.RelyAbout'),
    icon: 'navigation/rely',
    order: 999,
  },
}

export default rely
