import { adminRequest } from '@/api/admin/client'
import {
  getDemoCharts,
  getRouteDemoPeople,
  getRouteDemoPerson,
  getSearchOptions,
  getSearchOrders,
  getSearchOwners,
} from '@/api/demo/data'
import { getPersonList } from '@/api/demo/mock/person'
import { getRequestFixture, getWeather } from '@/api/demo/test'
import {
  chartsSchema,
  ordersResultSchema,
  peopleResultSchema,
} from '@ray-template/api-contracts/demo'

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
  expect(result.items[0]).toMatchObject({
    warehouse: expect.any(String),
    deliveryLabel: expect.any(String),
  })
  expect(result.items[0]).not.toHaveProperty('warehouseIndex')
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

it('loads route demo lists, details and legacy name links through HTTP', async () => {
  const first = await getRouteDemoPeople({ page: 1, pageSize: 2 })
  const second = await getRouteDemoPeople({ page: 2, pageSize: 2 })

  expect(first).toMatchObject({ total: 10, items: [{ key: 0 }, { key: 1 }] })
  expect(second.items.map(({ key }) => key)).toEqual([2, 3])
  expect(await getRouteDemoPerson(String(first.items[0].key))).toEqual(
    first.items[0],
  )
  expect(
    (await getRouteDemoPeople({ name: first.items[0].name })).items,
  ).toEqual([first.items[0]])
  await expect(getRouteDemoPerson('999')).rejects.toMatchObject({
    code: 404,
    key: 'notFound',
  })
})

it('serves localized business options that can be used directly in order filters', async () => {
  const english = await getSearchOptions('en-US')
  const chinese = await getSearchOptions('zh-CN')

  expect(english.organizations).toEqual([
    { value: 'north', label: 'North' },
    { value: 'south', label: 'South' },
  ])
  expect(chinese.organizations[0].label).toBe('北区')
  const warehouse = english.warehouseRegions[0].children[0]
  const result = await getSearchOrders(
    { warehouseId: warehouse.value, pageSize: 100 },
    'en-US',
  )

  expect(result.total).toBeGreaterThan(0)
  expect(
    result.items.every(
      (row) =>
        row.warehouseId === warehouse.value &&
        row.warehouse === warehouse.label,
    ),
  ).toBe(true)
})

it('rejects invalid demo inputs at the HTTP boundary and exposes simulated failures as responses', async () => {
  for (const params of [
    { page: 0 },
    { pageSize: 101 },
    { sortAge: 'invalid' },
  ]) {
    await expect(
      adminRequest('demo/people', peopleResultSchema, {
        method: 'get',
        params,
      }),
    ).rejects.toMatchObject({ code: 400, key: 'invalid' })
  }

  for (const query of [
    { page: 1.5 },
    { status: 'pending' },
    { minAmount: -1 },
    { createdFrom: 'yesterday' },
  ]) {
    await expect(
      adminRequest('demo/orders/search', ordersResultSchema, {
        method: 'post',
        data: { query, locale: 'en-US' },
      }),
    ).rejects.toMatchObject({ code: 400, key: 'invalid' })
  }

  await expect(
    adminRequest('demo/charts', chartsSchema, {
      method: 'get',
      params: { refresh: 'invalid' },
    }),
  ).rejects.toMatchObject({ code: 400 })
  await expect(getPersonList({ fail: true })).rejects.toMatchObject({
    code: 503,
    key: 'requestFailed',
  })
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
