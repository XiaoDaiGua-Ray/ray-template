import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import type { AppRouteRecordRaw } from '@/router/types'

const contextMenu: AppRouteRecordRaw = {
  path: '/context-menu',
  component: routeView('demo/context-menu'),
  meta: {
    i18nKey: t('menu.ContextMenu'),
    icon: 'navigation/other',
    order: 2,
  },
}

export default contextMenu
