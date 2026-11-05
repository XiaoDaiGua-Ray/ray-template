import {
  getDemoCharts,
  getSearchOrders,
  getSearchOwners,
} from '@/api/demo/data'
import { getPersonList } from '@/api/demo/mock/person'
import { getRequestFixture, getWeather } from '@/api/demo/test'

it('loads all table fixtures through the same paginated HTTP API', async () => {
  const first = await getPersonList({ page: 1, pageSize: 10 })
  const second = await getPersonList({ page: 2, pageSize: 10 })

  expect(first.total).toBe(100)
  expect(
    new Set([...first.data, ...second.data].map((row) => row.id)).size,
  ).toBe(20)
  expect(
    (await getPersonList({ email: first.data[0].email })).data,
  ).toContainEqual(first.data[0])
})

it('queries advanced search on the Mock server and localizes the returned labels', async () => {
  const result = await getSearchOrders(
    { status: ['pending'], page: 1, pageSize: 5 },
    'en-US',
  )

  expect(result.items).toHaveLength(5)
  expect(result.items.every((row) => row.status === 'pending')).toBe(true)
  expect(result.total).toBe(32)
  expect(
    (await getSearchOrders({ keyword: 'no matching order' }, 'zh-CN')).total,
  ).toBe(0)
  const owners = await getSearchOwners(
    'north',
    '',
    'en-US',
    new AbortController().signal,
  )

  expect(owners.map((item) => item.value)).toEqual(['n1', 'n2'])
  await expect(
    getSearchOrders({}, 'en-US', void 0, true),
  ).rejects.toMatchObject({ code: 503 })
})

it('aborts an in-flight HTTP search instead of applying stale results', async () => {
  const controller = new AbortController()
  const promise = getSearchOwners('north', '', 'en-US', controller.signal)

  controller.abort()
  await expect(promise).rejects.toMatchObject({ code: 'ERR_CANCELED' })
})

it('loads chart datasets, refreshes them through HTTP and keeps request examples working', async () => {
  const first = await getDemoCharts()
  const next = await getDemoCharts(true)

  expect(first.days).toHaveLength(7)
  expect(next.lines.map((item) => item.name)).toEqual(
    first.lines.map((item) => item.name),
  )
  expect(next.lines.every((item) => item.values.length === 7)).toBe(true)
  const fixture = await getRequestFixture()

  expect(fixture.ticket.id).toEqual(expect.any(String))
  expect(await getWeather('Hangzhou')).toMatchObject({
    city: 'Hangzhou',
    temperature: expect.any(Number),
  })
})
