/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-07-14
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { RIframe } from '@/components'

const RTemplateDoc = defineComponent({
  name: 'RTemplateDoc',
  setup() {
    return {}
  },
  render() {
    return (
      <RIframe
        width="100%"
        height="100%"
        src="https://xiaodaigua-ray.github.io/ray-template-doc/"
        lazy
      ></RIframe>
    )
  },
})

export default RTemplateDoc
