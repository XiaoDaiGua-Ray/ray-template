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
import { RIcon } from '@/components'

import props from './props'
import { AwesomeQR } from 'awesome-qr'
import { isValueType, downloadAnyFile, call } from '@/utils'

import type {
  QRCodeRenderResponse,
  GIFBuffer,
  DownloadFilenameType,
} from './types'
import type { WatchStopHandle } from 'vue'

const readGIFAsArrayBuffer = (url: string): Promise<GIFBuffer> => {
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

export default defineComponent({
  name: 'RayQRcode',
  props,
  setup(props, ctx) {
    const { expose } = ctx

    const qrcodeURL = ref<QRCodeRenderResponse>()
    let gifBuffer: GIFBuffer
    let watchCallback!: WatchStopHandle

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
      const { gifBackground, ...ops } = props

      new AwesomeQR({
        ...ops,
        gifBackground: (gifBuffer as ArrayBuffer) ?? void 0,
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

    const downloadQRCode = (fileName?: DownloadFilenameType) => {
      if (qrcodeURL.value && isValueType<string>(qrcodeURL.value, 'String')) {
        return downloadAnyFile(
          qrcodeURL.value,
          fileName || new Date().getTime() + '.png',
        )
      } else {
        return Promise.reject()
      }
    }

    watchEffect(() => {
      if (props.watchText) {
        watchCallback = watch(
          () => props.text,
          () => renderQRCode(),
        )
      } else {
        watchCallback?.()
      }
    })

    expose({
      downloadQRCode,
    })

    onMounted(async () => {
      await getGIFImageByURL()
      renderQRCode()
    })
    onBeforeUnmount(() => {
      watchCallback?.()
    })

    return {
      qrcodeURL,
      errorActionClick,
    }
  },
  render() {
    const {
      qrcodeURL,
      status,
      loadingDescription,
      errorDescription,
      $slots,
      errorActionDescription,
    } = this
    const { errorActionClick } = this

    return (
      <div class={['ray-qrcode', `ray-qrcode--${status}`]}>
        <NSpin show={status === 'loading'} description={loadingDescription}>
          <img class="r-qr-code__image" src={qrcodeURL as string | undefined} />
        </NSpin>
        {status === 'error' ? (
          <div class="ray-qrcode__error">
            <div class="ray-qrcode__error-content">
              {isValueType<string>(errorDescription, 'String')
                ? errorDescription
                : () => errorDescription}
            </div>
            <div
              class="ray-qrcode__error-btn"
              onClick={errorActionClick.bind(this)}
            >
              {$slots.errorAction ? (
                $slots.errorAction()
              ) : (
                <>
                  <NButton text type="primary" color="#ffffff">
                    {{
                      default: () => errorActionDescription,
                      icon: () => (
                        <RIcon name="reload" size="16" color="#ffffff" />
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
