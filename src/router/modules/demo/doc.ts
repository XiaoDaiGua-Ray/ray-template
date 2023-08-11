import { t } from '@/locales/useI18n'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

const doc: AppRouteRecordRaw = {
  path: '/doc',
  name: 'RDocLayout',
  component: LAYOUT,
  meta: {
    i18nKey: t('menu.Doc'),
    icon: 'doc',
    order: 5,
  },
  children: [
    {
      path: 'doc-inside',
      name: 'RDocInside',
      component: () => import('@/views/demo/doc/index'),
      meta: {
        i18nKey: t('menu.DocLocalInside'),
      },
    },
    {
      path: 'doc-outside',
      name: 'RDoc',
      component: LAYOUT,
      meta: {
        i18nKey: t('menu.Doc'),
        windowOpen: 'https://xiaodaigua-ray.github.io/ray-template-doc/',
      },
    },
    {
      path: 'doc-outside-local',
      name: 'RDocLocal',
      component: LAYOUT,
      meta: {
        i18nKey: t('menu.DocLocal'),
        windowOpen: 'https://ray-template.yunkuangao.com/ray-template-doc/',
      },
    },
  ],
}

export default doc
