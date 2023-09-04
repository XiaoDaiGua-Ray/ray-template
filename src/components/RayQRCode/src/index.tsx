/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-08-29
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import { NButton, NSpin } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'

import props from './props'
import { AwesomeQR } from 'awesome-qr'
import { isValueType, downloadBase64File } from '@use-utils/hook'
import { call } from '@/utils/vue/index'

import type { QRCodeRenderResponse } from './type'

const readGIFAsArrayBuffer = (
  url: string,
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.responseType = 'blob'

    xhr.onload = () => {
      const reader = new FileReader()

      reader.onloadend = () => {
        resolve(reader.result)
      }
      reader.onerror = (e) => {
        reject(e)
      }
      reader.onabort = (e) => {
        reject(e)
      }

      reader.readAsArrayBuffer(xhr.response)
    }

    xhr.open('GET', url)
    xhr.send()
  })
}

const RayQRcode = defineComponent({
  name: 'RayQRcode',
  props,
  setup(props, ctx) {
    const { expose } = ctx

    const qrcodeURL = ref<QRCodeRenderResponse>()
    const spinOverrides = {
      opacitySpinning: '0.1',
    }
    let gifBuffer: string | ArrayBuffer | null

    const getGIFImageByURL = async () => {
      const { gifBackgroundURL } = props

      if (!gifBackgroundURL) {
        return
      }

      try {
        gifBuffer = await readGIFAsArrayBuffer(gifBackgroundURL)
      } catch (e) {
        console.error(e)
      }
    }

    const renderQRCode = () => {
      const { gifBackgroundURL, gifBackground, ...ops } = props

      new AwesomeQR({
        ...ops,
        gifBackground: (gifBuffer as ArrayBuffer) ?? undefined,
      })
        .draw()
        .then((res) => {
          const { onSuccess } = props

          if (onSuccess) {
            call(onSuccess, res)
          }

          qrcodeURL.value = res
        })
        .catch((err) => {
          const { onError } = props

          if (onError) {
            call(onError, err)
          }
        })
    }

    const errorActionClick = () => {
      if (ctx.slots.errorAction) {
        return
      }

      const { onReload } = props

      if (onReload) {
        call(onReload)
      }
    }

    const downloadQRCode = (fileName?: string) => {
      if (qrcodeURL.value && isValueType<string>(qrcodeURL.value, 'String')) {
        downloadBase64File(qrcodeURL.value, fileName)
      }
    }

    watchEffect(() => {
      if (props.watchText) {
        nextTick().then(() => {
          renderQRCode()
        })
      }
    })

    expose({
      downloadQRCode,
    })

    onMounted(async () => {
      await getGIFImageByURL()
      renderQRCode()
    })

    return {
      qrcodeURL,
      spinOverrides,
      errorActionClick,
    }
  },
  render() {
    return (
      <div class="ray-qrcode">
        <NSpin
          show={this.status === 'loading'}
          themeOverrides={this.spinOverrides}
        >
          <img src={this.qrcodeURL as string | undefined} />
        </NSpin>
        {this.status === 'error' ? (
          <div class="ray-qrcode__error">
            <div class="ray-qrcode__error-content">
              {isValueType<string>(this.errorDescription, 'String')
                ? this.errorDescription
                : () => this.errorDescription}
            </div>
            <div
              class="ray-qrcode__error-btn"
              onClick={this.errorActionClick.bind(this)}
            >
              {this.$slots.errorAction ? (
                this.$slots.errorAction()
              ) : (
                <>
                  <NButton text color="#ffffff">
                    {{
                      default: () => this.errorActionDescription,
                      icon: () => (
                        <RayIcon name="reload" size="16" color="#ffffff" />
                      ),
                    }}
                  </NButton>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    )
  },
})

export default RayQRcode
