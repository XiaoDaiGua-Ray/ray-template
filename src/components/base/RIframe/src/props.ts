import type { MaybeArray } from '@/types'
import type { SpinProps } from 'naive-ui'
import type { PropType } from 'vue'
import type { Lazy } from './types'

const props = {
  src: {
    /** iframe url */
    type: String,
    required: true,
  },
  iframeWrapperClass: {
    /** 自定义类名 */
    type: String,
    default: null,
  },
  frameborder: {
    /** 边框尺寸, 0 则不显示 */
    type: Number,
    default: 0,
  },
  width: {
    /** iframe 宽度 */
    type: [String, Number],
    default: '100%',
  },
  height: {
    /** iframe 高度 */
    type: [String, Number],
    default: '100%',
  },
  allow: {
    /**
     *
     * iframe 特征策略
     *
     * ```
     * 全屏激活: allow = 'fullscreen'
     * 允许跨域: allow = 'payment'
     * ```
     *
     * 但是该配置属性受到浏览器安全策略影响, 使用前请仔细阅读文档
     */
    type: String,
    default: null,
  },
  name: {
    /** iframe 定位嵌入的浏览上下文的名称 */
    type: String,
    default: null,
  },
  title: {
    /** 标识 iframe 的主要内容 */
    type: String,
    default: null,
  },
  onSuccess: {
    /**
     *
     * iframe 加载成功回调
     * 返回值: iframe 对象, Event
     */
    type: [Function, Array] as PropType<
      MaybeArray<(el: HTMLIFrameElement, e: Event) => void>
    >,
    default: null,
  },
  onError: {
    /**
     *
     * iframe 加载失败回调
     * 返回值: iframe 对象, Event
     */
    type: [Function, Array] as PropType<MaybeArray<(e: Event) => void>>,
    default: null,
  },
  customSpinProps: {
    type: Object as PropType<SpinProps>,
    default: () => ({}),
  },
  lazy: {
    /** 是否延迟加载 iframe */
    type: [Boolean, String] as PropType<boolean | Lazy>,
    default: true,
  },
  iframeClass: {
    type: String,
    default: null,
  },
}

export default props
