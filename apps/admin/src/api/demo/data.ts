import { adminRequest } from '@/api/admin/client'
import {
  chartsSchema,
  ordersResultSchema,
  ownerOptionsSchema,
} from './contracts'

export * from './contracts'

export const getSearchOrders = (
  query: Record<string, unknown>,
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
