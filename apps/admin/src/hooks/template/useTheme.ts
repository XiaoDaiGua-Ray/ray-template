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

/**
 *
 * @description
 * 每个 Hook 实例复用主题引用与翻译器；读取快照时仍反映当前主题和语言。
 *
 * @returns 读取当前主题快照、切换明暗模式及跟随系统主题的方法。
 */
export const useTheme = () => {
  const { getAppTheme: isDark } = useSettingGetters()
  const { updateSettingState } = useSettingActions()
  const { t } = useI18n()

  /**
   *
   * @returns 当前主题、固定英文标签和随语言切换的翻译标签。
   */
  const getAppTheme = (): AppThemeInfo => {
    return {
      theme: isDark.value,
      themeI18nLabel: isDark.value
        ? t('headerSettingOptions.ThemeOptions.Dark')
        : t('headerSettingOptions.ThemeOptions.Light'),
      themeLabel: isDark.value ? 'Dark' : 'Light',
    }
  }

  /**
   *
   * @description
   * 切换至暗色主题
   */
  const darkTheme = () => {
    updateSettingState('appTheme', 'dark')
  }

  /**
   *
   * @description
   * 切换至明色主题
   */
  const lightTheme = () => {
    updateSettingState('appTheme', 'light')
  }

  /**
   *
   * @description
   * 同步系统主题。
   */
  const syncSystemTheme = () => {
    updateSettingState('appTheme', 'auto')
  }

  /**
   *
   * @description
   * 切换到与当前相反的手动主题。
   */
  const toggleTheme = () => {
    updateSettingState('appTheme', isDark.value ? 'light' : 'dark')
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
