import { t } from '@/locales/useI18n'

import type { AppRouteRecordRaw } from '@/router/type'

const scrollReveal: AppRouteRecordRaw = {
  path: '/scroll-reveal',
  name: 'ScrollReveal',
  component: () => import('@/views/scroll-reveal/index'),
  meta: {
    i18nKey: t('menu.scrollReveal'),
    icon: 'scroll_reveal',
    hidden: true,
  },
}

export default scrollReveal
