import { useSettingActions, useSettingGetters } from '@/store'
import { useI18n } from './useI18n'

export type ThemeLabel = 'Dark' | 'Light'

export interface AppThemeInfo {
  /** true 表示暗色主题。 */
  theme: boolean
  /** 固定英文标签 Dark 或 Light。 */
  themeLabel: ThemeLabel
  /** 随语言切换的主题标签。 */
  themeI18nLabel: string
}

export const useTheme = () => {
  /**
   *
   * @returns 当前主题、固定英文标签和随语言切换的翻译标签。
   */
  const getAppTheme = (): AppThemeInfo => {
    const { getAppTheme } = useSettingGetters()
    const { t } = useI18n()

    return {
      theme: getAppTheme.value,
      themeI18nLabel: getAppTheme.value
        ? t('headerSettingOptions.ThemeOptions.Dark')
        : t('headerSettingOptions.ThemeOptions.Light'),
      themeLabel: getAppTheme.value ? 'Dark' : 'Light',
    }
  }

  /**
   *
   * @description
   * 切换至暗色主题
   */
  const darkTheme = () => {
    const { updateSettingState } = useSettingActions()

    updateSettingState('appTheme', 'dark')
  }

  /**
   *
   * @description
   * 切换至明色主题
   */
  const lightTheme = () => {
    const { updateSettingState } = useSettingActions()

    updateSettingState('appTheme', 'light')
  }

  /**
   *
   * @description
   * 同步系统主题。
   */
  const syncSystemTheme = () => {
    const { updateSettingState } = useSettingActions()

    updateSettingState('appTheme', 'auto')
  }

  /**
   *
   * @description
   * 切换到与当前相反的手动主题。
   */
  const toggleTheme = () => {
    const { getAppTheme } = useSettingGetters()
    const theme = getAppTheme.value
    const { updateSettingState } = useSettingActions()

    updateSettingState('appTheme', !theme ? 'dark' : 'light')
  }

  return {
    darkTheme,
    lightTheme,
    toggleTheme,
    getAppTheme,
    syncSystemTheme,
  }
}

export type UseThemeReturnType = ReturnType<typeof useTheme>
