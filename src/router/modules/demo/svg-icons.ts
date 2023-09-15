import { t } from '@/hooks/web/index'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

const previewSVGIcons: AppRouteRecordRaw = {
  path: '/svg-icons',
  name: 'PreviewSVGIcons',
  component: () => import('@/views/demo/svg-icons/index'),
  meta: {
    noLocalTitle: 'SVG图标',
    icon: 'other',
    order: 3,
  },
}

export default previewSVGIcons
