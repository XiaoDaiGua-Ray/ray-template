import { axiosCanceler } from '@/axios/utils/interceptor'

const AppRequestCancelerProvider = defineComponent({
  name: 'AppRequestCancelerProvider',
  setup(_, { expose }) {
    onBeforeRouteUpdate(() => {
      axiosCanceler.cancelAllRequest()
    })

    expose()
  },
  render() {
    return <div class="app-style-provider"></div>
  },
})

export default AppRequestCancelerProvider
