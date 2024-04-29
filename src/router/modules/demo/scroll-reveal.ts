/**
 *
 * 由于还未找到如何解决 scrollReveal 插件问题
 * 所以暂时隐藏该页面
 */

import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/types'

const scrollReveal: AppRouteRecordRaw = {
  path: '/scroll-reveal',
  component: () => import('@/views/demo/scroll-reveal/index'),
  meta: {
    i18nKey: t('menu.scrollReveal'),
    icon: 'scroll_reveal',
    hidden: true,
  },
}

export default scrollReveal
