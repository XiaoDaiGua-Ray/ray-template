/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-11-30
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { useSettingActions, useSettingGetters } from '@/store'
import { setVariable, getVariableToRefs } from '@/global-variable'
import { cloneDeep } from 'lodash-es'

export const useWatermark = () => {
  /**
   *
   * @param content 水印内容
   *
   * 设置水印内容
   * 如果覆盖的水印内容为: '', undefined, null, 0, false, NaN，则会沿用上次一次的水印内容
   *
   * @example
   * setWatermarkContent('Ray Template Yes!')
   * setWatermarkContent('') // 沿用上次一次的水印内容
   * setWatermarkContent(undefined) // 沿用上次一次的水印内容
   */
  const setWatermarkContent = (content: string) => {
    const { getWatermarkConfig } = useSettingGetters()
    const assignWatermark = Object.assign(getWatermarkConfig.value, {
      content,
    })
    const { updateSettingState } = useSettingActions()

    updateSettingState('watermarkConfig', assignWatermark)
  }

  /**
   *
   * 显示水印
   *
   * @example
   * showWatermark()
   */
  const showWatermark = () => {
    const { updateSettingState } = useSettingActions()

    updateSettingState('watermarkSwitch', true)
  }

  /**
   *
   * 隐藏水印
   *
   * @example
   * hiddenWatermark()
   */
  const hiddenWatermark = () => {
    const { updateSettingState } = useSettingActions()

    updateSettingState('watermarkSwitch', false)
  }

  /**
   *
   * @param value 是否显示水印
   *
   * 切换水印显示状态
   *
   * @example
   * 假设当前水印显示状态为隐藏
   * toggleWatermark() // 显示水印
   * 假设当前水印显示状态为显示
   * toggleWatermark() // 隐藏水印
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
