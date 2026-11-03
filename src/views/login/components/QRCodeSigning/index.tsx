import './index.scss'
import LOGO from '@/assets/images/ray.svg'
import { Vue3NextQrcode } from 'vue3-next-qrcode'

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
