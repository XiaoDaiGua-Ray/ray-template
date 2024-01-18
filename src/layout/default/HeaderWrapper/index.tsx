/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-08-09
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NFlex } from 'naive-ui'
import SiderBar from '@/layout/components/SiderBar'

export default defineComponent({
  name: 'LayoutHeaderWrapper',
  setup() {
    return {}
  },
  render() {
    return (
      <NFlex size={[0, 0]}>
        <SiderBar />
      </NFlex>
    )
  },
})
