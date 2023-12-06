import { t } from '@/hooks/web'

import type { AppRouteRecordRaw } from '@/router/type'

const contextMenu: AppRouteRecordRaw = {
  path: '/context-menu',
  name: 'ContextMenuDemo',
  component: () => import('@/views/demo/context-menu/index'),
  meta: {
    i18nKey: t('menu.ContextMenu'),
    icon: 'other',
    order: 2,
  },
}

export default contextMenu
