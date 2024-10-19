import PageResult from '@/views/error'

const ErrorPage404 = defineComponent({
  name: 'ErrorPage404',
  setup() {
    return {}
  },
  render() {
    return <PageResult status="404" />
  },
})

export default ErrorPage404
