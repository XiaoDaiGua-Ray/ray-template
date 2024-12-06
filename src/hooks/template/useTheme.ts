import { useSettingActions, useSettingGetters } from '@/store'
import { useI18n } from '@/hooks'
import { APP_THEME } from '@/app-config'
import { useColorMode } from '@vueuse/core'
import { merge } from 'lodash-es'

export type ThemeLabel = 'Dark' | 'Light'

export interface AppThemeInfo {
  /**
   *
   * @description
   * 当前主题状态，true 为暗色主题，false 为明色主题
   */
  theme: boolean
  /**
   *
   * @description
   * 当前主题描述，默认描述。
   */
  themeLabel: ThemeLabel
  /**
   *
   * @description
   * 当前主题描述，国际化描述，会根据当前语言环境自动切换。
   */
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
   * @description
   * 获取当前主题色与主题色描述
   * 并且描述会根据当前语言环境自动切换
   *
   * @example
   * getAppTheme() // { theme: true, themeLabel: '暗色' | 'Dark' }
   * getAppTheme() // { theme: false, themeLabel: '亮色' | 'Light' }
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
   *
   * @example
   * darkTheme()
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
   *
   * @example
   * lightTheme()
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
   *
   * @example
   * syncSystemTheme()
   */
  const syncSystemTheme = () => {
    const { getAppTheme } = useSettingGetters()
    const { updateSettingState } = useSettingActions()
    const { system } = useColorMode()

    updateSettingState('_appTheme', system.value === 'dark')
    updateSettingState('appTheme', 'auto')
    setThemeOverrides(getAppTheme.value)
  }

  /**
   *
   * @param theme 当前主题色
   *
   * @description
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
