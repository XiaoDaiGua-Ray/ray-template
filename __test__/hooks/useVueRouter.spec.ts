import { useVueRouter } from '../../src/hooks/web/useVueRouter'
import { router } from '../../src/router'

it('shares the live router outside setup and exposes the current route after navigation', async () => {
  const a = useVueRouter()
  const b = useVueRouter()
  const remove = router.addRoute({ path: '/router-hook-test', component: {} })

  try {
    expect(a.router).toBe(router)
    expect(b.router.currentRoute).toBe(a.router.currentRoute)
    await a.router.push('/router-hook-test?source=spec')
    expect(b.router.currentRoute.value).toMatchObject({
      path: '/router-hook-test',
      query: { source: 'spec' },
    })
    await b.router.replace('/router-hook-test?source=replace')
    expect(a.router.currentRoute.value.query.source).toBe('replace')
  } finally {
    remove()
  }
})
