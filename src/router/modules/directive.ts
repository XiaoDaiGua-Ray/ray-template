import { t } from '@/locales/useI18n'

import type { AppRouteRecordRaw } from '@/router/type'

const directive: AppRouteRecordRaw = {
  path: '/directive',
  name: 'RDirective',
  component: () => import('@/views/directive/index'),
  meta: {
    i18nKey: t('menu.Directive'),
    icon: 'rely',
    order: 3,
  },
}

export default directive
