import PageResult from '@/views/error'

export default defineComponent({
  name: 'ErrorPage404',
  setup: () => () => <PageResult status="404" />,
})
