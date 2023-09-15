import { t } from '@/hooks/web/index'
import { LAYOUT } from '@/router/constant/index'

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
