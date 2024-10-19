import PageResult from '@/views/error'

const ErrorPage500 = defineComponent({
  name: 'ErrorPage500',
  setup() {
    return {}
  },
  render() {
    return <PageResult status="500" />
  },
})

export default ErrorPage500
