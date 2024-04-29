import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/types'

const axios: AppRouteRecordRaw = {
  path: '/template-hooks',
  component: () => import('@/views/demo/template-hooks/index'),
  meta: {
    i18nKey: t('menu.TemplateHooks'),
    icon: 'other',
    order: 1,
  },
}

export default axios
