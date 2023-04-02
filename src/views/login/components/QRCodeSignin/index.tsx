/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-04-02
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import QRCode from 'qrcode.vue'

/**
 *
 * 二维码登陆
 *
 * 可以根据业务需求自行更改
 */

const QRCodeSignin = defineComponent({
  name: 'QRCodeSignin',
  setup() {
    const qrcodeState = reactive({
      qrcodeValue: 'https://github.com/XiaoDaiGua-Ray/xiaodaigua-ray.github.io',
    })

    return {
      ...toRefs(qrcodeState),
    }
  },
  render() {
    return (
      <div class="qrcode-signin">
        <QRCode value={this.qrcodeValue} size={200} />
      </div>
    )
  },
})

export default QRCodeSignin
