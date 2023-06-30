/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-30
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NCard, NSpace } from 'naive-ui'

const RouterDemoDetail = defineComponent({
  name: 'RouterDemoDetail',

  render() {
    return (
      <NSpace wrapItem={false}>
        <NCard title="平层路由详情页面">我是平层路由详情页面</NCard>
      </NSpace>
    )
  },
})

export default RouterDemoDetail
