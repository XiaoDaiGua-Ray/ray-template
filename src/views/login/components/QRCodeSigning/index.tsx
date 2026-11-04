import './index.scss'
import LOGO from '@/assets/images/ray.svg'
import { Vue3NextQrcode } from 'vue3-next-qrcode'

export default defineComponent({
  name: 'QRCodeSigning',
  render() {
    return (
      <figure class="qrcode-signing">
        <Vue3NextQrcode
          text="https://github.com/XiaoDaiGua-Ray/ray-template"
          size={160}
          logoImage={LOGO}
        />
        <figcaption>{this.$t('views.login.index.QRHint')}</figcaption>
      </figure>
    )
  },
})
