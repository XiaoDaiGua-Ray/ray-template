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
