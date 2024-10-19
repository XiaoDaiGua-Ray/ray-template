/**
 *
 * 全局水印注入
 *
 * 该组件启用时，会在全局（包括首页）展示
 * 如果你不希望在登录页显示，可以手动将该组件放置于 Layout 中
 *
 * 当然你也可以通过 useWatermark hook 自定义控制水印的显示以及内容
 */

import { NWatermark } from 'naive-ui'

import { useSettingGetters } from '@/store'

export default defineComponent({
  name: 'AppWatermarkProvider',
  setup() {
    const { getWatermarkSwitch, getWatermarkConfig } = useSettingGetters()

    return {
      getWatermarkSwitch,
      getWatermarkConfig,
    }
  },
  render() {
    const { getWatermarkConfig, getWatermarkSwitch } = this

    return getWatermarkSwitch ? (
      <NWatermark cross fullscreen {...getWatermarkConfig} />
    ) : null
  },
})
