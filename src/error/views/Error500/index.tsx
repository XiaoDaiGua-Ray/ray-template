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
