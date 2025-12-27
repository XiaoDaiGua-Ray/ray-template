import { useTheme } from '../../src/hooks/template/useTheme'
import setupMiniApp from '../utils/setupMiniApp'

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

    const { theme: _darkTheme, themeLabel: _darkThemeLabel } = getAppTheme()

    expect(_darkTheme).toBe(true)
    expect(_darkThemeLabel).toBe('Dark')

    lightTheme()

    const { theme: __lightTheme, themeLabel: __lightThemeLabel } = getAppTheme()

    expect(__lightTheme).toBe(false)
    expect(__lightThemeLabel).toBe('Light')
  })
})
