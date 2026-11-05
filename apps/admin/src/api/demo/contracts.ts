import * as v from 'valibot'

export const personSchema = v.object({
  id: v.string(),
  name: v.string(),
  age: v.number(),
  address: v.string(),
  createDate: v.string(),
  email: v.string(),
})
export const peopleResultSchema = v.object({
  items: v.array(personSchema),
  total: v.number(),
})
export const requestFixtureSchema = v.object({
  ticket: v.object({ id: v.string(), title: v.string(), status: v.string() }),
  cities: v.record(
    v.string(),
    v.object({ temperature: v.number(), humidity: v.number() }),
  ),
})
export const orderSchema = v.object({
  id: v.number(),
  orderNo: v.string(),
  productIndex: v.number(),
  productId: v.string(),
  statusIndex: v.number(),
  status: v.string(),
  createdAt: v.string(),
  orgId: v.string(),
  ownerId: v.string(),
  ownerIndex: v.number(),
  warehouseIndex: v.number(),
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
})
export type DemoOrder = v.InferOutput<typeof orderSchema>
export const ordersResultSchema = v.object({
  items: v.array(orderSchema),
  total: v.number(),
})
export const ownerOptionsSchema = v.array(
  v.object({ value: v.string(), label: v.string() }),
)
export const chartsSchema = v.object({
  days: v.array(v.string()),
  orders: v.array(v.number()),
  visits: v.array(v.number()),
  sources: v.array(v.object({ key: v.string(), value: v.number() })),
  lines: v.array(v.object({ name: v.string(), values: v.array(v.number()) })),
})
export type DemoCharts = v.InferOutput<typeof chartsSchema>
