/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-07-21
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 路由更新前，取消上一路由所有请求
 *
 * 生命周期示意图：
 * beforeRouteUpdate -> cancelAllRequest -> routerUpdate
 */

import { axiosCanceler } from '@/axios/helper/interceptor'

const AppRequestCanceler = defineComponent({
  name: 'AppRequestCanceler',
  setup() {
    onBeforeRouteUpdate(() => {
      axiosCanceler.cancelAllRequest()
    })
  },
  render() {
    return (
      <div
        style={{
          display: 'none',
        }}
      ></div>
    )
  },
})

export default AppRequestCanceler
