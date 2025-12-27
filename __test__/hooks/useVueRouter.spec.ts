import { useVueRouter } from '../../src/hooks/web/useVueRouter'
import setupMiniApp from '../utils/setupMiniApp'

describe('useVueRouter', async () => {
  await setupMiniApp()

  const { router } = useVueRouter()

  it('should get push and replace methods', () => {
    const { push, replace } = router

    assert.isFunction(push)
    assert.isFunction(replace)
  })
})
