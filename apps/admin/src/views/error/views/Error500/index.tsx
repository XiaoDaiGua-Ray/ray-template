import PageResult from '@/views/error'

export default defineComponent({
  name: 'ErrorPage500',
  setup: () => () => <PageResult status="500" />,
})
