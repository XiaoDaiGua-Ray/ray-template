/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-08-30
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NSpace, NCard, NButton } from 'naive-ui'
import { RQRCode } from '@/components'

import LOGO from '@/assets/images/ray.svg'

import type { RQRCodeType } from '@/components'

export default defineComponent({
  name: 'RQRCodeDemo',
  setup() {
    const qrcodeText = ref('ray template yes')
    const qrcodeStatus = ref<RQRCodeType.QRCodeStatus | undefined>()
    const rayQRCodeRef = ref<RQRCodeType.QRCodeInst>()

    return {
      qrcodeText,
      qrcodeStatus,
      rayQRCodeRef,
    }
  },
  render() {
    return (
      <NSpace wrapItem={false}>
        <NCard>
          <h2>
            基于 awesome-qr 进行封装，支持 LOGO、gif、backgroundImage 等属性。
          </h2>
          <h2>该组件会自动监听文本内容变化，然后重新渲染（watchText）</h2>
          <h2>具体使用请参考 props 配置项</h2>
        </NCard>
        <NCard title="基础二维码">
          <NSpace>
            <RQRCode text="ray template yes" />
            <RQRCode text="ray template yes" logoImage={LOGO} />
            <RQRCode
              text="ray template yes"
              gifBackgroundURL="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
              dotScale={0.5}
              colorDark="#64d9d6"
            />
          </NSpace>
        </NCard>
        <NCard title="状态二维码">
          <NSpace>
            <RQRCode
              text="ray template yes"
              logoImage={LOGO}
              status="error"
              onReload={() => {
                window.$message.info('reload event')
              }}
            />
            <RQRCode
              text="ray template yes"
              logoImage={LOGO}
              status="loading"
            />
          </NSpace>
        </NCard>
        <NCard title="监听内容变化">
          <NSpace vertical>
            <NSpace>
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
            </NSpace>
            <NSpace>
              <RQRCode
                text={this.qrcodeText}
                status={this.qrcodeStatus}
                logoImage={LOGO}
                ref="rayQRCodeRef"
              />
              当前二维码内容：{this.qrcodeText}
            </NSpace>
          </NSpace>
        </NCard>
      </NSpace>
    )
  },
})
