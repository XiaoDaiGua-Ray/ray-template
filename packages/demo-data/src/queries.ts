import type {
  DemoCharts,
  DemoOrder,
  DemoOrderQuery,
  OwnerOptions,
  RoutePeopleQuery,
  RoutePeopleResult,
} from '@ray-template/api-contracts/demo'
import charts from './charts.json' with { type: 'json' }
import { getOrderLabels, orderMatchesQuery, orders, owners } from './orders.ts'
import { routeDemoPeople } from './route-people.ts'

export function getDemoCharts(refresh = false): DemoCharts {
  if (!refresh) return charts

  return {
    ...charts,
    lines: charts.lines.map((line) => ({
      ...line,
      values: line.values.map(() => Math.floor((Math.random() + 1) * 100)),
    })),
  }
}

export function listRouteDemoPeople({
  page = 1,
  pageSize = 10,
  name,
}: RoutePeopleQuery): RoutePeopleResult {
  const matches = routeDemoPeople.filter(
    (person) => name === void 0 || person.name === name,
  )

  return {
    items: matches.slice((page - 1) * pageSize, page * pageSize),
    total: matches.length,
  }
}

export function searchDemoOwners(
  organization: string,
  keyword: string,
  locale: string,
): OwnerOptions {
  const copy = getOrderLabels(locale)
  const search = keyword.trim().toLowerCase()

  return owners.flatMap(({ id, orgId }, index) =>
    orgId === organization && copy.people[index].toLowerCase().includes(search)
      ? [{ label: copy.people[index], value: id }]
      : [],
  )
}

export function searchDemoOrders(query: DemoOrderQuery, locale: string) {
  const copy = getOrderLabels(locale)
  const matches = orders
    .map(
      ({
        productIndex,
        statusIndex,
        ownerIndex,
        warehouseIndex,
        ...row
      }): DemoOrder => ({
        ...row,
        product: copy.products[productIndex],
        statusLabel: copy.statuses[statusIndex],
        organization: copy.teams[row.orgId === 'north' ? 0 : 1],
        owner: copy.people[ownerIndex],
        warehouse: copy.warehouses[warehouseIndex],
        deliveryLabel: copy.deliveries[row.delivery === 'express' ? 1 : 0],
      }),
    )
    .filter((row) => orderMatchesQuery(row, query))
  const { page = 1, pageSize = 5 } = query

  return {
    items: matches.slice((page - 1) * pageSize, page * pageSize),
    total: matches.length,
  }
}
