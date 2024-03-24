import { useAppNavigation } from '../../src/hooks/template/useAppNavigation'
import { useMenuGetters } from '../../src/store'
import setupMiniApp from '../utils/setupMiniApp'

describe('useAppNavigation', async () => {
  await setupMiniApp()

  const { navigationTo } = useAppNavigation()
  const { getMenuOptions } = useMenuGetters()

  it('navigationTo', () => {
    const [dashboard] = getMenuOptions.value

    expect(navigationTo(dashboard.fullPath)).toBeUndefined()
    expect(navigationTo(dashboard)).toBeUndefined()
    expect(navigationTo(0)).toBeUndefined()
  })
})
