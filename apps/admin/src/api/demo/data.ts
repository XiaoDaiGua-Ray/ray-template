import { adminRequest } from '@/api/admin/client'
import {
  chartsSchema,
  ordersResultSchema,
  ownerOptionsSchema,
  routeDemoPersonSchema,
  routePeopleResultSchema,
  searchOptionsSchema,
} from './contracts'
import type { DemoOrderQuery, RoutePeopleQuery } from './contracts'

export * from './contracts'

export const getSearchOrders = (
  query: DemoOrderQuery,
  locale: string,
  signal?: AbortSignal,
  fail = false,
) =>
  adminRequest('demo/orders/search', ordersResultSchema, {
    method: 'post',
    data: { query, locale, fail },
    signal,
  })
export const getSearchOwners = (
  orgId: string,
  keyword: string,
  locale: string,
  signal: AbortSignal,
  fail = false,
) =>
  adminRequest('demo/owners/search', ownerOptionsSchema, {
    method: 'post',
    data: { orgId, keyword, locale, fail },
    signal,
  })
export const getDemoCharts = (refresh = false, signal?: AbortSignal) =>
  adminRequest('demo/charts', chartsSchema, {
    method: 'get',
    params: { refresh },
    signal,
  })

export const getSearchOptions = (locale: string, signal?: AbortSignal) =>
  adminRequest('demo/search-options', searchOptionsSchema, {
    method: 'get',
    params: { locale },
    signal,
  })

export const getRouteDemoPeople = (
  params: RoutePeopleQuery = {},
  signal?: AbortSignal,
) =>
  adminRequest('demo/route-people', routePeopleResultSchema, {
    method: 'get',
    params,
    signal,
  })

export const getRouteDemoPerson = (id: string, signal?: AbortSignal) =>
  adminRequest(
    `demo/route-people/${encodeURIComponent(id)}`,
    routeDemoPersonSchema,
    {
      method: 'get',
      signal,
    },
  )
