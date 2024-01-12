import { t } from '@/hooks'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/type'

const directive: AppRouteRecordRaw = {
  path: '/directive',
  name: 'RDirective',
  component: () => import('@/views/demo/directive/index'),
  meta: {
    i18nKey: t('menu.Directive'),
    icon: 'other',
    order: 2,
  },
}

export default directive
