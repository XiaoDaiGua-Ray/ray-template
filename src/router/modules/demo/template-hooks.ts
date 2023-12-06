import { t } from '@/hooks/web'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/type'

const axios: AppRouteRecordRaw = {
  path: '/template-hooks',
  name: 'TemplateHooks',
  component: () => import('@/views/demo/template-hooks/index'),
  meta: {
    i18nKey: t('menu.TemplateHooks'),
    icon: 'other',
    order: 1,
  },
}

export default axios
