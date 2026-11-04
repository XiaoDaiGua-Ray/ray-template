import type { TableProParams } from '@ray-template/ui/table-pro'

export const statuses = ['pending', 'paid', 'closed'] as const
export const organizations = ['north', 'south'] as const
export const products = ['notes', 'keyboard', 'notebook', 'monitor'] as const
export const warehouses = [
  'north-main',
  'north-backup',
  'south-main',
  'south-backup',
] as const
export const owners = [
  { id: 'n1', orgId: 'north' },
  { id: 'n2', orgId: 'north' },
  { id: 's1', orgId: 'south' },
  { id: 's2', orgId: 'south' },
] as const

export const orders = Array.from({ length: 96 }, (_, index) => {
  const ownerIndex = index % owners.length
  const { orgId, id: ownerId } = owners[ownerIndex]
  const productIndex = Math.floor(index / 3) % products.length
  const statusIndex = index % statuses.length
  const warehouseIndex = Math.floor(index / 8) % warehouses.length
  const day = 1 + (index % 12)
  const hour = index % 3 === 0 ? 9 : 14

  return {
    id: index + 1,
    orderNo: `ORD-${String(index + 1).padStart(3, '0')}`,
    productIndex,
    productId: products[productIndex],
    statusIndex,
    status: statuses[statusIndex],
    createdAt: `2026-11-${String(day).padStart(2, '0')}`,
    orgId,
    ownerId,
    ownerIndex,
    warehouseIndex,
    warehouseId: warehouses[warehouseIndex],
    amount: [0, 59, 129, 199, 349, 699, 1299, 2499][index % 8],
    invoiced: Math.floor(index / 4) % 2 === 0,
    delivery: index % 3 === 0 ? 'express' : 'standard',
    deliveryAt: new Date(2026, 10, day + 1, hour).getTime(),
    deliveryTime: hour === 9 ? '09:00:00' : '14:00:00',
  }
})

export function orderMatchesQuery(
  row: (typeof orders)[number] & { product: string },
  query: TableProParams,
) {
  const {
    keyword,
    status,
    createdFrom,
    createdTo,
    orgId,
    ownerId,
    productId,
    warehouseId,
    minAmount,
    invoiced,
    delivery,
    deliveryFrom,
    deliveryTo,
    deliveryTime,
  } = query

  return (
    `${row.orderNo} ${row.product}`
      .toLowerCase()
      .includes(String(keyword ?? '').toLowerCase()) &&
    (!Array.isArray(status) || status.includes(row.status)) &&
    (typeof createdFrom !== 'string' || row.createdAt >= createdFrom) &&
    (typeof createdTo !== 'string' || row.createdAt <= createdTo) &&
    (orgId == null || row.orgId === orgId) &&
    (ownerId == null || row.ownerId === ownerId) &&
    (productId == null || row.productId === productId) &&
    (warehouseId == null || row.warehouseId === warehouseId) &&
    (typeof minAmount !== 'number' || row.amount >= minAmount) &&
    (invoiced == null || row.invoiced === invoiced) &&
    (delivery == null || row.delivery === delivery) &&
    (typeof deliveryFrom !== 'number' || row.deliveryAt >= deliveryFrom) &&
    (typeof deliveryTo !== 'number' || row.deliveryAt <= deliveryTo) &&
    (deliveryTime == null || row.deliveryTime === deliveryTime)
  )
}

export function waitForDemo(delay: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    signal.throwIfAborted()
    const abort = () => {
      clearTimeout(timer)
      reject(signal.reason)
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort)
      resolve()
    }, delay)

    signal.addEventListener('abort', abort, { once: true })
  })
}
