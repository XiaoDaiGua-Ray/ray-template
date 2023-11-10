/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-10-21
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 全局水印注入
 *
 * 该组件启用时，会在全局（包括首页）展示
 * 如果你不希望在登录页显示，可以手动将该组件放置于 Layout 中
 */

import { NWatermark } from 'naive-ui'

import { APP_WATERMARK_CONFIG } from '@/app-config/appConfig'
import { useSettingGetters } from '@/store'

export default defineComponent({
  name: 'AppWatermarkProvider',
  setup() {
    const { getWatermarkSwitch } = useSettingGetters()

    return {
      getWatermarkSwitch,
    }
  },
  render() {
    return this.getWatermarkSwitch ? (
      <NWatermark cross fullscreen {...APP_WATERMARK_CONFIG} />
    ) : null
  },
})
