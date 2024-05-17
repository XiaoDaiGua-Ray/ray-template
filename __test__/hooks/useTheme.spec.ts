import setupMiniApp from '../utils/setupMiniApp'
import { useTheme } from '../../src/hooks/template/useTheme'

describe('useTheme', async () => {
  await setupMiniApp()

  const { darkTheme, lightTheme, toggleTheme, getAppTheme } = useTheme()

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

    const { theme: darkTheme, themeLabel: darkThemeLabel } = getAppTheme()

    expect(darkTheme).toBe(true)
    expect(darkThemeLabel).toBe('暗色')

    lightTheme()

    const { theme: lightTheme, themeLabel: lightThemeLabel } = getAppTheme()

    expect(lightTheme).toBe(false)
    expect(lightThemeLabel).toBe('明亮')
  })
})
