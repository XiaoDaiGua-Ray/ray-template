import LOGO from '@/assets/images/ray.svg'
import { NButton, NCard, NFlex } from 'naive-ui'
import { Vue3NextQrcode } from 'vue3-next-qrcode'
import type { QRCodeInst, QRCodeStatus } from 'vue3-next-qrcode'

export default defineComponent({
  name: 'RQRCodeDemo',
  setup() {
    const qrcodeText = ref('ray template yes')
    const qrcodeStatus = ref<QRCodeStatus | undefined>()
    const rayQRCodeRef = ref<QRCodeInst>()

    return {
      qrcodeText,
      qrcodeStatus,
      rayQRCodeRef,
    }
  },
  render() {
    return (
      <NFlex>
        <NCard>
          <h2>
            基于 awesome-qr 进行封装，支持 LOGO、gif、backgroundImage 等属性。
          </h2>
          <h2>该组件会自动监听文本内容变化，然后重新渲染（watchText）</h2>
          <h2>具体使用请参考 props 配置项</h2>
        </NCard>
        <NCard title="基础二维码">
          <NFlex>
            <Vue3NextQrcode text="ray template yes" />
            <Vue3NextQrcode text="ray template yes" logoImage={LOGO} />
            <Vue3NextQrcode
              text="ray template yes"
              gifBackgroundURL="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
              dotScale={0.5}
              colorDark="#64d9d6"
            />
          </NFlex>
        </NCard>
        <NCard title="状态二维码">
          <NFlex>
            <Vue3NextQrcode
              text="ray template yes"
              logoImage={LOGO}
              status="error"
              onReload={() => {
                window.$message.info('reload event')
              }}
            />
            <Vue3NextQrcode
              text="ray template yes"
              logoImage={LOGO}
              status="loading"
            />
          </NFlex>
        </NCard>
        <NCard title="监听内容变化">
          <NFlex vertical>
            <NFlex>
              <NButton
                onClick={() => {
                  this.qrcodeStatus = 'loading'

                  setTimeout(() => {
                    this.qrcodeText = 'text updated: ' + new Date().getTime()
                    this.qrcodeStatus = void 0
                  }, 1000)
                }}
              >
                更新二维码内容
              </NButton>
              <NButton
                onClick={() => {
                  this.rayQRCodeRef?.downloadQRCode()
                }}
              >
                下载二维码
              </NButton>
            </NFlex>
            <NFlex>
              <Vue3NextQrcode
                text={this.qrcodeText}
                status={this.qrcodeStatus}
                logoImage={LOGO}
                ref="rayQRCodeRef"
              />
              当前二维码内容：{this.qrcodeText}
            </NFlex>
          </NFlex>
        </NCard>
      </NFlex>
    )
  },
})
