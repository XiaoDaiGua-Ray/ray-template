import setupMiniApp from '../utils/setupMiniApp'
import { useAppRoot } from '../../src/hooks/template/useAppRoot'

describe('useAppRoot', async () => {
  await setupMiniApp()

  const { setRootRoute } = useAppRoot()

  it(`should return '/test' and 'test'`, () => {
    setRootRoute({
      path: '/test',
      name: 'test',
    })

    const { getRootPath, getRootName } = useAppRoot()

    expect(getRootPath.value).toBe('/test')
    expect(getRootName.value).toBe('test')
  })

  it(`should be returned a object like: {path: /test2, name: test2}`, () => {
    const baseRootRoute = {
      path: '/test2',
      name: 'test2',
    }

    setRootRoute(baseRootRoute)

    const { getRootRoute } = useAppRoot()

    expect(getRootRoute.value).toEqual(baseRootRoute)
  })

  it('should update root route when setRootRoute is called', () => {
    const baseRootRoute = {
      path: '/test3',
      name: 'test3',
    }

    setRootRoute({
      path: '/test3',
      name: 'test3',
    })

    const { getRootPath, getRootName, getRootRoute } = useAppRoot()

    expect(getRootPath.value).toBe('/test3')
    expect(getRootName.value).toBe('test3')
    expect(getRootRoute.value).toEqual(baseRootRoute)
  })
})
