import { t } from '@/hooks'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/types'

const axios: AppRouteRecordRaw = {
  path: '/template-hooks',
  name: 'TemplateHooks',
  component: () => import('@/views/demo/template-hooks/index'),
  meta: {
    i18nKey: t('menu.TemplateHooks'),
    icon: 'other',
    order: 1,
    extra: {
      label: 'new',
    },
  },
}

export default axios
