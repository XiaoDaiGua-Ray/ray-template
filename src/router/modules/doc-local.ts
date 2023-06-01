import type { AppRouteRecordRaw } from '@/router/type'

const docLocal: AppRouteRecordRaw = {
  path: '/doc',
  name: 'DocLocal',
  component: () => import('@/views/doc/index'),
  meta: {
    i18nKey: 'DocLocal',
    icon: 'doc',
    windowOpen: 'https://ray-template.yunkuangao.com/ray-template-doc/',
    order: 6,
  },
}

export default docLocal
