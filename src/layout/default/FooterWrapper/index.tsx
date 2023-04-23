/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-04-21
 *
 * @workspace ray-template-mine
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

const FooterWrapper = defineComponent({
  name: 'FooterWrapper',
  setup() {
    const {
      layout: { copyright },
    } = __APP_CFG__

    return {
      copyright,
    }
  },
  render() {
    return this.copyright ? (
      <div class="layout-footer-wrapper">{this.copyright}</div>
    ) : (
      <></>
    )
  },
})

export default FooterWrapper
