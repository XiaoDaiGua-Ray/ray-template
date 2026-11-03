import { useSettingActions, useSettingGetters } from '@/store'

export const useWatermark = () => {
  /**
   *
   * @param content 非空水印文本
   *
   * @description
   * 空字符串保留现有文本。
   */
  const setWatermarkContent = (content: string) => {
    if (!content) return

    const { getWatermarkConfig } = useSettingGetters()
    const assignWatermark = Object.assign({}, getWatermarkConfig.value, {
      content,
    })
    const { updateSettingState } = useSettingActions()

    updateSettingState('watermarkConfig', assignWatermark)
  }

  /**
   *
   * @description
   * 显示水印。
   */
  const showWatermark = () => {
    const { updateSettingState } = useSettingActions()

    updateSettingState('watermarkSwitch', true)
  }

  /**
   *
   * @description
   * 隐藏水印。
   */
  const hiddenWatermark = () => {
    const { updateSettingState } = useSettingActions()

    updateSettingState('watermarkSwitch', false)
  }

  /**
   *
   * @description
   * 按当前共享状态切换水印显隐。
   */
  const toggleWatermark = () => {
    const { getWatermarkSwitch } = useSettingGetters()
    const { updateSettingState } = useSettingActions()

    updateSettingState('watermarkSwitch', !getWatermarkSwitch.value)
  }

  return {
    setWatermarkContent,
    showWatermark,
    hiddenWatermark,
    toggleWatermark,
  }
}

export type UseWatermarkReturnType = ReturnType<typeof useWatermark>
