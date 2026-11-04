import { useSettingGetters } from '@/store'
import { NWatermark } from 'naive-ui'

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
      <NWatermark {...getWatermarkConfig} fullscreen />
    ) : null
  },
})
