import { t } from '@/hooks'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/types'

const cacheDemo: AppRouteRecordRaw = {
  path: '/cache-demo',
  name: 'CacheDemo',
  component: () => import('@/views/demo/cache-demo/index'),
  meta: {
    i18nKey: t('menu.CacheDemo'),
    icon: 'other',
    order: 3,
    extra: {
      label: 'new',
    },
  },
}

export default cacheDemo
