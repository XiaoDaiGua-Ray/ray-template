import { useTheme } from '../../apps/admin/src/hooks/template/useTheme'
import {
  useSettingActions,
  useSettingGetters,
} from '../../apps/admin/src/store'
import setupMiniApp from '../utils/setupMiniApp'

describe('useTheme', async () => {
  await setupMiniApp()

  const { darkTheme, lightTheme, toggleTheme, getAppTheme, syncSystemTheme } =
    useTheme()

  it('should change to dark theme', () => {
    darkTheme()

    expect(getAppTheme().theme).toBe(true)
  })

  it('should change to light theme', () => {
    lightTheme()

    expect(getAppTheme().theme).toBe(false)
  })

  it('should toggle theme', () => {
    lightTheme()

    expect(getAppTheme().theme).toBe(false)

    toggleTheme()

    expect(getAppTheme().theme).toBe(true)
  })

  it('should return current theme', () => {
    darkTheme()

    const { theme: _darkTheme, themeLabel: _darkThemeLabel } = getAppTheme()

    expect(_darkTheme).toBe(true)
    expect(_darkThemeLabel).toBe('Dark')

    lightTheme()

    const { theme: __lightTheme, themeLabel: __lightThemeLabel } = getAppTheme()

    expect(__lightTheme).toBe(false)
    expect(__lightThemeLabel).toBe('Light')
  })

  it('keeps a reused hook reactive to language and theme changes', () => {
    const { updateLocale } = useSettingActions()
    const previousLocale = useSettingGetters().getLocaleLanguage.value

    try {
      darkTheme()
      updateLocale('en-US')
      expect(getAppTheme().themeI18nLabel).toBe('Dark')
      updateLocale('zh-CN')
      expect(getAppTheme().themeI18nLabel).toBe('暗色')
      lightTheme()
      expect(getAppTheme()).toMatchObject({
        theme: false,
        themeLabel: 'Light',
        themeI18nLabel: '明亮',
      })
    } finally {
      updateLocale(previousLocale)
      lightTheme()
    }
  })

  it('selects auto mode and applies the system color preference', () => {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches

    try {
      syncSystemTheme()
      expect(getAppTheme()).toMatchObject({
        theme: dark,
        themeLabel: dark ? 'Dark' : 'Light',
      })
      expect(useSettingGetters().getAppThemeStr.value).toBe('auto')
    } finally {
      lightTheme()
    }
  })
})
