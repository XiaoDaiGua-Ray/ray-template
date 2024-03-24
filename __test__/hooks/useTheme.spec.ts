import setupMiniApp from '../utils/setupMiniApp'
import { useTheme } from '../../src/hooks/template/useTheme'

describe('useTheme', async () => {
  await setupMiniApp()

  const { changeDarkTheme, changeLightTheme, toggleTheme, getAppTheme } =
    useTheme()

  it('should change to dark theme', () => {
    changeDarkTheme()

    expect(getAppTheme().theme).toBe(true)
  })

  it('should change to light theme', () => {
    changeLightTheme()

    expect(getAppTheme().theme).toBe(false)
  })

  it('should toggle theme', () => {
    changeLightTheme()

    expect(getAppTheme().theme).toBe(false)

    toggleTheme()

    expect(getAppTheme().theme).toBe(true)
  })

  it('should return current theme', () => {
    changeDarkTheme()

    const { theme: darkTheme, themeLabel: darkThemeLabel } = getAppTheme()

    expect(darkTheme).toBe(true)
    expect(darkThemeLabel).toBe('暗色')

    changeLightTheme()

    const { theme: lightTheme, themeLabel: lightThemeLabel } = getAppTheme()

    expect(lightTheme).toBe(false)
    expect(lightThemeLabel).toBe('明亮')
  })
})
