import './index.scss'

import { Vue3NextQrcode } from 'vue3-next-qrcode'

import LOGO from '@/assets/images/ray.svg'

/**
 *
 * 二维码登陆
 *
 * 可以根据业务需求自行更改
 */

const QRCodeSigning = defineComponent({
  name: 'QRCodeSigning',
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
      <div class="qrcode-signing">
        <Vue3NextQrcode text="ray template yes" size={200} logoImage={LOGO} />
      </div>
    )
  },
})

export default QRCodeSigning
