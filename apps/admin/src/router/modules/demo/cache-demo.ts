import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const cacheDemo: AppRouteRecordRaw = {
  path: '/cache-demo',
  component: routeView('demo/cache-demo'),
  meta: {
    i18nKey: t('menu.CacheDemo'),
    icon: 'navigation/other',
    order: 3,
  },
}

export default cacheDemo
