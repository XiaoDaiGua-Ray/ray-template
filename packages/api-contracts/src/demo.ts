import * as v from 'valibot'

const paginationEntries = {
  page: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
  pageSize: v.optional(
    v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100)),
  ),
}
const identifier = () => v.pipe(v.string(), v.minLength(1), v.maxLength(80))
const optionalFilter = () => v.optional(v.nullable(identifier()))

export const personSchema = v.object({
  id: v.string(),
  name: v.string(),
  age: v.number(),
  address: v.string(),
  createDate: v.string(),
  email: v.string(),
})
export type Person = v.InferOutput<typeof personSchema>
export const personListQuerySchema = v.object({
  ...paginationEntries,
  name: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(80))),
  email: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(120))),
  sortAge: v.optional(v.picklist(['ascend', 'descend'])),
  fail: v.optional(v.boolean()),
})
export type PersonListParams = v.InferInput<typeof personListQuerySchema>
export const peopleResultSchema = v.object({
  items: v.array(personSchema),
  total: v.pipe(v.number(), v.integer(), v.minValue(0)),
})
export type PeopleResult = v.InferOutput<typeof peopleResultSchema>
export const requestFixtureSchema = v.object({
  ticket: v.object({ id: v.string(), title: v.string(), status: v.string() }),
  cities: v.record(
    v.string(),
    v.object({ temperature: v.number(), humidity: v.number() }),
  ),
})
export type RequestFixture = v.InferOutput<typeof requestFixtureSchema>
export const orderSchema = v.object({
  id: v.number(),
  orderNo: v.string(),
  productId: v.string(),
  status: v.string(),
  createdAt: v.string(),
  orgId: v.string(),
  ownerId: v.string(),
  warehouseId: v.string(),
  amount: v.number(),
  invoiced: v.boolean(),
  delivery: v.string(),
  deliveryAt: v.number(),
  deliveryTime: v.string(),
  product: v.string(),
  statusLabel: v.string(),
  organization: v.string(),
  owner: v.string(),
  warehouse: v.string(),
  deliveryLabel: v.string(),
})
export type DemoOrder = v.InferOutput<typeof orderSchema>
export const ordersResultSchema = v.object({
  items: v.array(orderSchema),
  total: v.pipe(v.number(), v.integer(), v.minValue(0)),
})
export type OrdersResult = v.InferOutput<typeof ordersResultSchema>
export const orderQuerySchema = v.object({
  ...paginationEntries,
  keyword: v.optional(v.pipe(v.string(), v.maxLength(120))),
  status: v.optional(v.nullable(v.array(identifier()))),
  createdFrom: v.optional(v.nullable(v.pipe(v.string(), v.isoDate()))),
  createdTo: v.optional(v.nullable(v.pipe(v.string(), v.isoDate()))),
  orgId: optionalFilter(),
  ownerId: optionalFilter(),
  productId: optionalFilter(),
  warehouseId: optionalFilter(),
  minAmount: v.optional(v.nullable(v.pipe(v.number(), v.minValue(0)))),
  invoiced: v.optional(v.nullable(v.boolean())),
  delivery: optionalFilter(),
  deliveryFrom: v.optional(v.nullable(v.pipe(v.number(), v.integer()))),
  deliveryTo: v.optional(v.nullable(v.pipe(v.number(), v.integer()))),
  deliveryTime: v.optional(v.nullable(v.pipe(v.string(), v.isoTime()))),
})
export type DemoOrderQuery = v.InferInput<typeof orderQuerySchema>
export const orderSearchInputSchema = v.object({
  query: orderQuerySchema,
  locale: v.string(),
  fail: v.optional(v.boolean()),
})
export type OrderSearchInput = v.InferInput<typeof orderSearchInputSchema>
export const ownerSearchInputSchema = v.object({
  orgId: identifier(),
  keyword: v.pipe(v.string(), v.maxLength(120)),
  locale: v.string(),
  fail: v.optional(v.boolean()),
})
export type OwnerSearchInput = v.InferInput<typeof ownerSearchInputSchema>
export const demoOptionSchema = v.object({
  value: identifier(),
  label: v.string(),
})
export type DemoOption = v.InferOutput<typeof demoOptionSchema>
export const ownerOptionsSchema = v.array(demoOptionSchema)
export type OwnerOptions = v.InferOutput<typeof ownerOptionsSchema>

const optionGroupSchema = v.object({
  ...demoOptionSchema.entries,
  children: v.array(demoOptionSchema),
})

export const searchOptionsQuerySchema = v.object({
  locale: v.optional(v.string()),
})
export type SearchOptionsQuery = v.InferInput<typeof searchOptionsQuerySchema>
export const searchOptionsSchema = v.object({
  statuses: v.array(demoOptionSchema),
  organizations: v.array(demoOptionSchema),
  productCategories: v.array(optionGroupSchema),
  warehouseRegions: v.array(optionGroupSchema),
  deliveries: v.array(demoOptionSchema),
})
export type SearchOptions = v.InferOutput<typeof searchOptionsSchema>
export const chartsQuerySchema = v.object({ refresh: v.optional(v.boolean()) })
export type ChartsQuery = v.InferInput<typeof chartsQuerySchema>
export const chartsSchema = v.object({
  days: v.array(v.string()),
  orders: v.array(v.number()),
  visits: v.array(v.number()),
  sources: v.array(v.object({ key: v.string(), value: v.number() })),
  lines: v.array(v.object({ name: v.string(), values: v.array(v.number()) })),
})
export type DemoCharts = v.InferOutput<typeof chartsSchema>

export const routeDemoPersonSchema = v.object({
  key: v.pipe(v.number(), v.integer(), v.minValue(0)),
  name: v.string(),
  address: v.string(),
  phone: v.string(),
})
export type RouteDemoPerson = v.InferOutput<typeof routeDemoPersonSchema>
export const routePeopleQuerySchema = v.object({
  ...paginationEntries,
  name: v.optional(v.pipe(v.string(), v.maxLength(80))),
})
export type RoutePeopleQuery = v.InferInput<typeof routePeopleQuerySchema>
export const routePeopleResultSchema = v.object({
  items: v.array(routeDemoPersonSchema),
  total: v.pipe(v.number(), v.integer(), v.minValue(0)),
})
export type RoutePeopleResult = v.InferOutput<typeof routePeopleResultSchema>
