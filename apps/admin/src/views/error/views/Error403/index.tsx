import PageResult from '@/views/error'

export default defineComponent({
  name: 'ErrorPage403',
  setup: () => () => <PageResult status="403" />,
})
