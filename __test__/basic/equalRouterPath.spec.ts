import { equalRouterPath } from '../../apps/admin/src/utils/basic'

describe('equalRouterPath', () => {
  it('compare paths with parameters', () => {
    const p1 = '/a?b=1'
    const p2 = '/a?b=2'

    expect(equalRouterPath(p1, p2)).toBe(true)
  })

  it('compare paths', () => {
    const p1 = '/a'
    const p2 = '/a/'

    expect(equalRouterPath(p1, p2)).toBe(true)
  })
})

it('ignores query, hash and trailing slashes and handles an empty route', () => {
  expect(equalRouterPath('/items///?q=1#row', '/items#header')).toBe(true)
  expect(equalRouterPath('', '?')).toBe(true)
  expect(equalRouterPath('/a', '/aa')).toBe(false)
})
