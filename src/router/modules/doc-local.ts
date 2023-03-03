export default {
  path: '/doc',
  name: 'doc',
  component: () => import('@/views/doc/index'),
  meta: {
    i18nKey: 'DocLocal',
    icon: 'doc',
    windowOpen: 'https://ray-template.yunkuangao.com/ray-template-doc/',
  },
}
