import { userListQuerySchema } from '@/api/admin/contracts'
import { listPeople } from '@/demo-data/people'
import {
  chartsQuerySchema,
  orderSchema,
  orderSearchInputSchema,
  ownerSearchInputSchema,
  personListQuerySchema,
  routeDemoPersonSchema,
  routePeopleQuerySchema,
  searchOptionsQuerySchema,
} from '@ray-template/api-contracts/demo'
import { delay, http, HttpResponse } from 'msw'
import * as v from 'valibot'
import charts from './data/charts.json'
import {
  getOrderLabels,
  getOrderOptions,
  orderMatchesQuery,
  orders,
  owners,
} from './data/orders'
import requestFixture from './data/request.json'
import { routeDemoPeople } from './data/route-people'
import { MockApiError } from './database'
import type { AdminDatabase } from './database'

export function createAdminHandlers(database: AdminDatabase, apiBase: string) {
  const url = (path: string) => `${apiBase}${path}`
  const token = (request: Request) =>
    request.headers.get('Authorization')?.replace(/^Bearer /u, '') ?? null
  const readQuery = <Schema extends v.GenericSchema>(
    request: Request,
    schema: Schema,
  ) => {
    const query: Record<string, unknown> = Object.fromEntries(
      new URL(request.url).searchParams,
    )

    for (const key of ['page', 'pageSize']) {
      if (key in query) query[key] = Number(query[key])
    }

    for (const key of ['refresh', 'fail']) {
      if (query[key] === 'true') query[key] = true
      else if (query[key] === 'false') query[key] = false
    }

    return v.parse(schema, query)
  }
  const respond = async (action: () => unknown | Promise<unknown>) => {
    await delay(120)

    try {
      return HttpResponse.json({ code: 200, msg: 'OK', data: await action() })
    } catch (error) {
      const failure =
        error instanceof MockApiError ? error : new MockApiError(400, 'invalid')

      return HttpResponse.json(
        {
          code: failure.status,
          msg: failure.key,
          data: null,
          error: { key: failure.key },
        },
        { status: failure.status },
      )
    }
  }

  return [
    http.get(url('admin/mock-health'), () =>
      HttpResponse.json(
        { code: 200, msg: 'OK', data: { ready: true } },
        { headers: { 'x-ray-mock': 'active' } },
      ),
    ),
    http.get(url('admin/demo/request'), () => respond(() => requestFixture)),
    http.get(url('admin/demo/charts'), ({ request }) =>
      respond(() => {
        const { refresh } = readQuery(request, chartsQuerySchema)

        return refresh
          ? {
              ...charts,
              lines: charts.lines.map((line) => ({
                ...line,
                values: line.values.map(() =>
                  Math.floor((Math.random() + 1) * 100),
                ),
              })),
            }
          : charts
      }),
    ),
    http.get(url('admin/demo/search-options'), ({ request }) =>
      respond(() =>
        getOrderOptions(
          readQuery(request, searchOptionsQuerySchema).locale ?? 'zh-CN',
        ),
      ),
    ),
    http.get(url('admin/demo/route-people'), ({ request }) =>
      respond(() => {
        const {
          page = 1,
          pageSize = 10,
          name,
        } = readQuery(request, routePeopleQuerySchema)
        const matches = routeDemoPeople.filter(
          (person) => name === void 0 || person.name === name,
        )

        return {
          items: matches.slice((page - 1) * pageSize, page * pageSize),
          total: matches.length,
        }
      }),
    ),
    http.get(url('admin/demo/route-people/:id'), ({ params }) =>
      respond(() => {
        const id = v.parse(routeDemoPersonSchema.entries.key, Number(params.id))
        const person = routeDemoPeople.find(({ key }) => key === id)

        if (!person) throw new MockApiError(404, 'notFound')

        return person
      }),
    ),
    http.post(url('admin/demo/owners/search'), ({ request }) =>
      respond(async () => {
        const body = v.parse(ownerSearchInputSchema, await request.json())

        await delay(body.orgId === 'north' ? 680 : 330)

        if (body.fail) throw new MockApiError(503, 'requestFailed')

        const copy = getOrderLabels(body.locale)

        return owners.flatMap(({ id, orgId }, index) =>
          orgId === body.orgId &&
          copy.people[index]
            .toLowerCase()
            .includes(body.keyword.trim().toLowerCase())
            ? [{ label: copy.people[index], value: id }]
            : [],
        )
      }),
    ),
    http.post(url('admin/demo/orders/search'), ({ request }) =>
      respond(async () => {
        const body = v.parse(orderSearchInputSchema, await request.json())

        if (body.fail) throw new MockApiError(503, 'requestFailed')

        const copy = getOrderLabels(body.locale)
        const matches = orders
          .map((row) =>
            v.parse(orderSchema, {
              ...row,
              product: copy.products[row.productIndex],
              statusLabel: copy.statuses[row.statusIndex],
              organization: copy.teams[row.orgId === 'north' ? 0 : 1],
              owner: copy.people[row.ownerIndex],
              warehouse: copy.warehouses[row.warehouseIndex],
              deliveryLabel:
                copy.deliveries[row.delivery === 'express' ? 1 : 0],
            }),
          )
          .filter((row) => orderMatchesQuery(row, body.query))
        const { page = 1, pageSize = 5 } = body.query

        return {
          items: matches.slice((page - 1) * pageSize, page * pageSize),
          total: matches.length,
        }
      }),
    ),
    http.post(url('admin/auth/login'), ({ request }) =>
      respond(async () => database.login(await request.json())),
    ),
    http.get(url('admin/auth/session'), ({ request }) =>
      respond(() => database.authorize(token(request))),
    ),
    http.post(url('admin/auth/logout'), ({ request }) =>
      respond(() => database.logout(token(request))),
    ),
    http.get(url('admin/route-config'), () =>
      respond(() => database.getRoutes()),
    ),
    http.put(url('admin/route-config'), ({ request }) =>
      respond(async () =>
        database.saveRoutes(await request.json(), token(request)),
      ),
    ),
    http.get(url('admin/users/options'), ({ request }) =>
      respond(() => database.getOptions(token(request))),
    ),
    http.post(url('admin/users/batch-delete'), ({ request }) =>
      respond(async () =>
        database.deleteUsers(await request.json(), token(request)),
      ),
    ),
    http.patch(url('admin/users/status'), ({ request }) =>
      respond(async () =>
        database.changeStatus(await request.json(), token(request)),
      ),
    ),
    http.post(url('admin/users/reset'), ({ request }) =>
      respond(() => database.resetUsers(token(request))),
    ),
    http.get(url('admin/users'), ({ request }) =>
      respond(() =>
        database.listUsers(
          readQuery(request, userListQuerySchema),
          token(request),
        ),
      ),
    ),
    http.post(url('admin/users'), ({ request }) =>
      respond(async () =>
        database.saveUser(await request.json(), token(request)),
      ),
    ),
    http.get(url('admin/users/:id'), ({ request, params }) =>
      respond(() => database.getUser(String(params.id), token(request))),
    ),
    http.put(url('admin/users/:id'), ({ request, params }) =>
      respond(async () =>
        database.saveUser(
          await request.json(),
          token(request),
          String(params.id),
        ),
      ),
    ),
    http.get(url('admin/demo/people'), ({ request }) =>
      respond(async () => {
        const query = readQuery(request, personListQuerySchema)

        await delay(530)

        if (query.fail) throw new MockApiError(503, 'requestFailed')

        const result = listPeople({
          ...query,
          page: query.page ?? 1,
          pageSize: query.pageSize ?? 10,
        })

        return { items: result.data, total: result.total }
      }),
    ),
  ]
}
