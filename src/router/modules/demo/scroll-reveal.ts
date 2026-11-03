import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const scrollReveal: AppRouteRecordRaw = {
  path: '/scroll-reveal',
  component: () => import('@/views/demo/scroll-reveal/index'),
  meta: {
    i18nKey: t('menu.scrollReveal'),
    icon: 'navigation/other',
    hidden: true,
  },
}

export default scrollReveal
