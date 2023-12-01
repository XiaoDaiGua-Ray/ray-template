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
import { useI18n } from '@/hooks/web'

export const useTheme = () => {
  /**
   *
   * 获取当前主题色与主题色描述
   * 并且描述会根据当前语言环境自动切换
   *
   * @example
   * getAppTheme() // { theme: true, themeLabel: '暗色' | 'Dark' }
   * getAppTheme() // { theme: false, themeLabel: '亮色' | 'Light' }
   */
  const getAppTheme = () => {
    const { getAppTheme } = useSettingGetters()
    const { t } = useI18n()

    return {
      theme: getAppTheme.value,
      themeLabel: getAppTheme.value
        ? t('headerSettingOptions.ThemeOptions.Dark')
        : t('headerSettingOptions.ThemeOptions.Light'),
    }
  }

  /**
   *
   * 切换至暗色主题
   *
   * @example
   * changeDarkTheme()
   */
  const changeDarkTheme = () => {
    const { updateSettingState } = useSettingActions()

    updateSettingState('appTheme', true)
  }

  /**
   *
   * 切换至明色主题
   *
   * @example
   * changeLightTheme()
   */
  const changeLightTheme = () => {
    const { updateSettingState } = useSettingActions()

    updateSettingState('appTheme', false)
  }

  /**
   *
   * @param theme 当前主题色
   *
   * 当前主题有明暗两套
   *
   * @example
   * 假设当前主题为暗色主题
   * toggleTheme() // 切换至明色主题
   * 假设当前主题为明色主题
   * toggleTheme() // 切换至暗色主题
   */
  const toggleTheme = () => {
    const { theme } = getAppTheme()
    const { updateSettingState } = useSettingActions()

    updateSettingState('appTheme', !theme)
  }

  return {
    changeDarkTheme,
    changeLightTheme,
    toggleTheme,
    getAppTheme,
  }
}

export type UseThemeReturnType = ReturnType<typeof useTheme>
