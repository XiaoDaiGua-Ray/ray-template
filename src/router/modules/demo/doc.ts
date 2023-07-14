import { t } from '@/locales/useI18n'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

const doc: AppRouteRecordRaw = {
  path: '',
  name: 'RDocLayout',
  component: LAYOUT,
  meta: {
    i18nKey: t('menu.Doc'),
    icon: 'doc',
    order: 5,
  },
  children: [
    {
      path: '/doc',
      name: 'RDocInside',
      component: () => import('@/views/doc/index'),
      meta: {
        i18nKey: t('menu.DocLocalInside'),
      },
    },
    {
      path: '',
      name: 'RDoc',
      component: LAYOUT,
      meta: {
        i18nKey: t('menu.Doc'),
        windowOpen: 'https://xiaodaigua-ray.github.io/ray-template-doc/',
      },
    },
    {
      path: '',
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
