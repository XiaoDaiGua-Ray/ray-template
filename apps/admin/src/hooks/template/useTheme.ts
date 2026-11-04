import { APP_THEME } from '@/app-config'
import { useSettingActions, useSettingGetters } from '@/store'
import { merge } from 'lodash-es'
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

const setThemeOverrides = (theme: boolean) => {
  const { getPrimaryColorOverride } = useSettingGetters()
  const { updateSettingState } = useSettingActions()

  updateSettingState(
    'primaryColorOverride',
    theme
      ? merge(
          {},
          getPrimaryColorOverride.value,
          APP_THEME.appNaiveUIThemeOverrides.dark,
        )
      : merge(
          {},
          getPrimaryColorOverride.value,
          APP_THEME.appNaiveUIThemeOverrides.light,
        ),
  )
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

    updateSettingState('_appTheme', true)
    updateSettingState('appTheme', 'dark')
    setThemeOverrides(true)
  }

  /**
   *
   * @description
   * 切换至明色主题
   */
  const lightTheme = () => {
    const { updateSettingState } = useSettingActions()

    updateSettingState('_appTheme', false)
    updateSettingState('appTheme', 'light')
    setThemeOverrides(false)
  }

  /**
   *
   * @description
   * 同步系统主题。
   */
  const syncSystemTheme = () => {
    const { getAppTheme } = useSettingGetters()
    const { updateSettingState } = useSettingActions()

    updateSettingState(
      '_appTheme',
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    )
    updateSettingState('appTheme', 'auto')
    setThemeOverrides(getAppTheme.value)
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

    updateSettingState('_appTheme', !theme)
    updateSettingState('appTheme', !theme ? 'dark' : 'light')
    setThemeOverrides(!theme)
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
