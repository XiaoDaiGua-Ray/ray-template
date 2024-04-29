import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/types'

const cacheDemo: AppRouteRecordRaw = {
  path: '/cache-demo',
  component: () => import('@/views/demo/cache-demo/index'),
  meta: {
    i18nKey: t('menu.CacheDemo'),
    icon: 'other',
    order: 3,
  },
}

export default cacheDemo
