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

import type { QRCodeStatus, QRCodeLevel } from './type'
import type { PropType, VNode } from 'vue'
import type { MaybeArray } from '@/types'
import type { Options } from 'awesome-qr'

const props = {
  loadingDescription: {
    /**
     *
     * Loading status description label
     *
     * @default undefined
     */
    type: String,
  },
  watchText: {
    /**
     *
     * Auto watch QR code text
     * If update text, then re-render QR code
     *
     * @default true
     */
    type: Boolean,
    default: true,
  },
  status: {
    /**
     *
     * QR code status
     *
     * @default undefined
     */
    type: String as PropType<QRCodeStatus>,
  },
  errorDescription: {
    /**
     *
     * QR code error description label
     *
     * @default 二维码已过期
     */
    type: [String, Object] as PropType<string | VNode>,
    default: '二维码已过期',
  },
  errorActionDescription: {
    /**
     *
     * QR code error action description label
     *
     * @default 重新加载
     */
    type: String,
    default: '重新加载',
  },
  text: {
    /**
     *
     * Text to be encoded in the QR code
     */
    type: String,
    required: true,
  },
  size: {
    /**
     *
     * Size of the QR code in pixel.
     *
     * @default 160
     */
    type: Number,
    default: 160,
  },
  margin: {
    /**
     *
     * Size of margins around the QR code body in pixel.
     *
     * @default 12
     */
    type: Number,
    default: 12,
  },
  correctLevel: {
    /**
     *
     * Error correction level of the QR code
     * Accepts a value provided by _QRErrorCorrectLevel_
     *
     * @default 1
     */
    type: Number as PropType<QRCodeLevel>,
    default: 1,
    validator: (value: unknown) => [0, 1, 2, 3].includes(value as number),
  },
  maskPattern: {
    /**
     *
     * Specify the mask pattern to be used in QR code encoding
     * Accepts a value provided by _QRMaskPattern_
     */
    type: Number,
  },
  version: {
    /**
     *
     * Specify the version to be used in QR code encoding
     * Accepts an integer in range [1, 40]
     */
    type: Number,
  },
  components: {
    /**
     *
     * Options to control components in the QR code.
     *
     * @default {data:{scale...},...}
     */
    type: Object as PropType<Options['components']>,
    default: () => ({
      data: {
        scale: 1,
      },
      timing: {
        scale: 1,
        protectors: false,
      },
      alignment: {
        scale: 1,
        protectors: false,
      },
      cornerAlignment: {
        scale: 1,
        protectors: true,
      },
    }),
  },
  colorDark: {
    /**
     *
     * Color of the blocks on the QR code
     * Accepts a CSS &lt;color&gt;
     *
     * @default #000000
     */
    type: String,
    default: '#000000',
  },
  colorLight: {
    /**
     *
     * Color of the blocks on the QR code
     * Accepts a CSS &lt;color&gt;
     *
     * @default #ffffff
     */
    type: String,
    default: '#ffffff',
  },
  autoColor: {
    /**
     *
     * Automatically calculate the _colorLight_ value from the QR code's background
     *
     * @default true
     */
    type: Boolean,
    default: true,
  },
  backgroundImage: {
    /**
     *
     * Background image to be used in the QR code
     * Accepts a `data:` string in web browsers or a Buffer in Node.js
     *
     * @default undefined
     */
    type: String,
  },
  backgroundDimming: {
    /**
     *
     * Color of the dimming mask above the background image
     * Accepts a CSS &lt;color&gt;
     *
     * @default rgba(0, 0, 0, 0)
     */
    type: String,
    default: 'rgba(0, 0, 0, 0)',
  },
  gifBackgroundURL: {
    /**
     *
     * GIF background image to be used in the QR code
     *
     * @default undefined
     */
    type: String,
  },
  gifBackground: {
    /**
     *
     * GIF background image to be used in the QR code
     *
     * @default undefined
     */
    type: ArrayBuffer,
  },
  whiteMargin: {
    /**
     *
     * Use a white margin instead of a transparent one which reveals the background of the QR code on margins
     *
     * @default true
     */
    type: Boolean,
    default: true,
  },
  logoImage: {
    /**
     *
     * Logo image to be displayed at the center of the QR code
     * Accepts a `data:` string in web browsers or a Buffer in Node.js
     * When set to `undefined` or `null`, the logo is disabled
     *
     * @default undefined
     */
    type: String,
  },
  logoScale: {
    /**
     *
     * Ratio of the logo size to the QR code size
     *
     * @default 0.4
     */
    type: Number,
    default: 0.4,
  },
  logoMargin: {
    /**
     *
     * Size of margins around the logo image in pixels
     *
     * @default 6
     */
    type: Number,
    default: 6,
  },
  logoCornerRadius: {
    /**
     * Corner radius of the logo image in pixels.
     *
     * @default 8
     */
    type: Number,
    default: 8,
  },
  dotScale: {
    /**
     *
     * Ratio of the real size to the full size of the blocks.
     * This can be helpful when you want to make more parts of the background visible.
     *
     * @default 1
     */
    type: Number,
    default: 1,
  },
  onSuccess: {
    /**
     *
     * When the QR code is successfully generated, this callback is called
     */
    type: [Function, Array] as PropType<
      MaybeArray<(dataURL: ArrayBuffer | string | undefined) => void>
    >,
    default: null,
  },
  onError: {
    /**
     *
     * When the QR code generation fails, this callback is called
     */
    type: [Function, Array] as PropType<MaybeArray<(e: unknown) => void>>,
    default: null,
  },
  onReload: {
    /**
     *
     * When reload button is clicked, this callback is called
     * This method will not execute if the errorAction slot is used
     */
    type: [Function, Array] as PropType<MaybeArray<() => void>>,
    default: null,
  },
}

export default props
