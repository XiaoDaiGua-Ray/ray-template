import type { UserListParams } from '@/api/admin/contracts'
import { listPeople } from '@/demo-data/people'
import { searchCopy } from '@/views/demo/tables/search-copy'
import { delay, http, HttpResponse } from 'msw'
import * as v from 'valibot'
import charts from './data/charts.json'
import { orderMatchesQuery, orders, owners } from './data/orders'
import requestFixture from './data/request.json'
import { MockApiError } from './database'
import type { AdminDatabase } from './database'

export function createAdminHandlers(database: AdminDatabase, apiBase: string) {
  const url = (path: string) => `${apiBase}${path}`
  const token = (request: Request) =>
    request.headers.get('Authorization')?.replace(/^Bearer /u, '') ?? null
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
      respond(() =>
        new URL(request.url).searchParams.get('refresh') === 'true'
          ? {
              ...charts,
              lines: charts.lines.map((line) => ({
                ...line,
                values: line.values.map(() =>
                  Math.floor((Math.random() + 1) * 100),
                ),
              })),
            }
          : charts,
      ),
    ),
    http.post(url('admin/demo/owners/search'), ({ request }) =>
      respond(async () => {
        const body = v.parse(
          v.object({
            orgId: v.string(),
            keyword: v.string(),
            locale: v.string(),
            fail: v.optional(v.boolean()),
          }),
          await request.json(),
        )

        await delay(body.orgId === 'north' ? 680 : 330)

        if (body.fail) throw new MockApiError(503, 'requestFailed')

        const copy = body.locale === 'zh-CN' ? searchCopy.zh : searchCopy.en

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
        const body = v.parse(
          v.object({
            query: v.record(v.string(), v.unknown()),
            locale: v.string(),
            fail: v.optional(v.boolean()),
          }),
          await request.json(),
        )

        if (body.fail) throw new MockApiError(503, 'requestFailed')

        const copy = body.locale === 'zh-CN' ? searchCopy.zh : searchCopy.en
        const matches = orders
          .map((row) => ({
            ...row,
            product: copy.products[row.productIndex],
            statusLabel: copy.statuses[row.statusIndex],
            organization: copy.teams[row.orgId === 'north' ? 0 : 1],
            owner: copy.people[row.ownerIndex],
          }))
          .filter((row) => orderMatchesQuery(row, body.query))
        const page = Number(body.query.page ?? 1)
        const pageSize = Number(body.query.pageSize ?? 5)

        if (
          !Number.isSafeInteger(page) ||
          page < 1 ||
          !Number.isSafeInteger(pageSize) ||
          pageSize < 1 ||
          pageSize > 100
        )
          throw new MockApiError(400, 'invalid')

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
      respond(() => {
        const search = new URL(request.url).searchParams
        const params = Object.fromEntries(search) as UserListParams

        params.page = search.has('page') ? Number(search.get('page')) : 1
        params.pageSize = search.has('pageSize')
          ? Number(search.get('pageSize'))
          : 10

        return database.listUsers(params, token(request))
      }),
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
      respond(() => {
        const query = new URL(request.url).searchParams

        const result = listPeople({
          page: Number(query.get('page') ?? 1),
          pageSize: Number(query.get('pageSize') ?? 10),
          name: query.get('name') ?? void 0,
          email: query.get('email') ?? void 0,
          sortAge:
            query.get('sortAge') === 'ascend'
              ? 'ascend'
              : query.get('sortAge') === 'descend'
                ? 'descend'
                : void 0,
        })

        return { items: result.data, total: result.total }
      }),
    ),
  ]
}
