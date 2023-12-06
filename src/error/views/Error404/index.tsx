/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-02
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import PageResult from '@/error'

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
