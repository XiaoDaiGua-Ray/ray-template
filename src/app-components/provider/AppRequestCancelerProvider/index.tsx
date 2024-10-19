/**
 *
 * 路由更新前，取消上一路由所有请求
 *
 * 生命周期示意图：
 * beforeRouteUpdate -> cancelAllRequest -> routeUpdate
 */

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
