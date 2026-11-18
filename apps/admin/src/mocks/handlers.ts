import { editRevision, userListQuerySchema } from '@/api/admin/contracts'
import {
  chartsQuerySchema,
  orderSearchInputSchema,
  ownerSearchInputSchema,
  personListQuerySchema,
  routeDemoPersonSchema,
  routePeopleQuerySchema,
  searchOptionsQuerySchema,
} from '@ray-template/api-contracts/demo'
import {
  getDemoCharts,
  getOrderOptions,
  listRouteDemoPeople,
  requestFixture,
  searchDemoOrders,
  searchDemoOwners,
} from '@ray-template/demo-data'
import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import * as v from 'valibot'
import { routeDemoPeople } from './data/route-people'
import { MockApiError } from './database'
import type { AdminDatabase } from './database'

export function createAdminHandlers(transact: AdminDatabase, apiBase: string) {
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
  const respond = async (
    action: () => unknown | Promise<unknown>,
    revisioned = false,
  ) => {
    await delay(120)

    try {
      const data = await action()
      const revision = revisioned ? await editRevision(data) : void 0

      return HttpResponse.json(
        { code: 200, msg: 'OK', data, ...(revision ? { revision } : {}) },
        revision ? { headers: { ETag: `"${revision}"` } } : void 0,
      )
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

  const respondAdmin = (
    action: Parameters<AdminDatabase>[0],
    revisioned = false,
  ) => respond(() => transact(action), revisioned)
  const checkRevision = async (request: Request, current: unknown) => {
    const match = request.headers.get('If-Match')

    if (match !== null && match !== `"${await editRevision(current)}"`)
      throw new MockApiError(412, 'editConflict')
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
        getDemoCharts(readQuery(request, chartsQuerySchema).refresh),
      ),
    ),
    http.get(url('admin/demo/search-options'), ({ request }) =>
      respond(() =>
        getOrderOptions(
          readQuery(request, searchOptionsQuerySchema).locale ?? 'zh-CN',
        ),
      ),
    ),
    http.get(url('admin/demo/route-people'), ({ request }) =>
      respond(() =>
        listRouteDemoPeople(readQuery(request, routePeopleQuerySchema)),
      ),
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

        return searchDemoOwners(body.orgId, body.keyword, body.locale)
      }),
    ),
    http.post(url('admin/demo/orders/search'), ({ request }) =>
      respond(async () => {
        const body = v.parse(orderSearchInputSchema, await request.json())

        if (body.fail) throw new MockApiError(503, 'requestFailed')

        return searchDemoOrders(body.query, body.locale)
      }),
    ),
    http.post(url('admin/auth/login'), ({ request }) =>
      respondAdmin(async (database) => database.login(await request.json())),
    ),
    http.get(url('admin/auth/session'), ({ request }) =>
      respondAdmin((database) => database.authorize(token(request))),
    ),
    http.post(url('admin/auth/logout'), ({ request }) =>
      respondAdmin((database) => database.logout(token(request))),
    ),
    http.get(url('admin/auth/profile'), ({ request }) =>
      respondAdmin((database) => database.getProfile(token(request))),
    ),
    http.patch(url('admin/auth/profile'), ({ request }) =>
      respondAdmin(async (database) =>
        database.updateProfile(await request.json(), token(request)),
      ),
    ),
    http.patch(url('admin/auth/password'), ({ request }) =>
      respondAdmin(async (database) =>
        database.changePassword(await request.json(), token(request)),
      ),
    ),
    http.get(url('admin/route-config'), ({ request }) =>
      respondAdmin(
        (database) => {
          const view = new URL(request.url).searchParams.getAll('view')

          if (view.length && (view.length !== 1 || view[0] !== 'editor'))
            throw new MockApiError(400, 'invalid')

          return database.getRoutes(token(request), view[0] === 'editor')
        },
        new URL(request.url).searchParams.get('view') === 'editor',
      ),
    ),
    http.put(url('admin/route-config'), ({ request }) =>
      respondAdmin(async (database) => {
        if (request.headers.has('If-Match'))
          await checkRevision(request, database.getRoutes(token(request), true))

        return database.saveRoutes(await request.json(), token(request))
      }),
    ),
    http.get(url('admin/users/options'), ({ request }) =>
      respondAdmin((database) => database.getOptions(token(request))),
    ),
    http.post(url('admin/users/batch-delete'), ({ request }) =>
      respondAdmin(async (database) =>
        database.deleteUsers(await request.json(), token(request)),
      ),
    ),
    http.patch(url('admin/users/status'), ({ request }) =>
      respondAdmin(async (database) =>
        database.changeStatus(await request.json(), token(request)),
      ),
    ),
    http.post(url('admin/users/reset'), ({ request }) =>
      respondAdmin((database) => database.resetUsers(token(request))),
    ),
    http.get(url('admin/users'), ({ request }) =>
      respondAdmin((database) =>
        database.listUsers(
          readQuery(request, userListQuerySchema),
          token(request),
        ),
      ),
    ),
    http.post(url('admin/users'), ({ request }) =>
      respondAdmin(async (database) =>
        database.saveUser(await request.json(), token(request)),
      ),
    ),
    http.get(url('admin/users/:id'), ({ request, params }) =>
      respondAdmin(
        (database) => database.getUser(String(params.id), token(request)),
        true,
      ),
    ),
    http.put(url('admin/users/:id'), ({ request, params }) =>
      respondAdmin(async (database) => {
        if (request.headers.has('If-Match')) {
          database.authorize(token(request), 'users:update')
          await checkRevision(
            request,
            database.getUser(String(params.id), token(request)),
          )
        }

        return database.saveUser(
          await request.json(),
          token(request),
          String(params.id),
        )
      }),
    ),
    http.put(url('admin/users/:id/credential'), ({ request, params }) =>
      respondAdmin(async (database) =>
        database.setCredential(
          String(params.id),
          await request.json(),
          token(request),
        ),
      ),
    ),
    http.get(url('admin/demo/people'), ({ request }) =>
      respond(async () => {
        const query = readQuery(request, personListQuerySchema)

        await delay(530)

        if (query.fail) throw new MockApiError(503, 'requestFailed')

        const { listPeople } = await import('@/demo-data/people')
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
