import type {
  DemoOrder,
  DemoOrderQuery,
  SearchOptions,
} from '@ray-template/api-contracts/demo'

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

const labels = {
  'zh-CN': {
    teams: ['北区', '南区'],
    people: ['陈晨', '林岚', '周宁', '王雨'],
    statuses: ['待处理', '已支付', '已关闭'],
    products: ['便签', '键盘', '笔记本', '显示器'],
    groups: ['办公用品', '电子设备'],
    warehouses: ['北区主仓', '北区备仓', '南区主仓', '南区备仓'],
    deliveries: ['普通', '加急'],
  },
  'en-US': {
    teams: ['North', 'South'],
    people: ['Chen', 'Lin', 'Zhou', 'Wang'],
    statuses: ['Pending', 'Paid', 'Closed'],
    products: ['Notes', 'Keyboard', 'Notebook', 'Monitor'],
    groups: ['Office supplies', 'Electronics'],
    warehouses: ['North main', 'North backup', 'South main', 'South backup'],
    deliveries: ['Standard', 'Express'],
  },
}

export const getOrderLabels = (locale: string) =>
  labels[locale === 'zh-CN' ? 'zh-CN' : 'en-US']

export function getOrderOptions(locale: string): SearchOptions {
  const copy = getOrderLabels(locale)

  return {
    statuses: statuses.map((value, index) => ({
      value,
      label: copy.statuses[index],
    })),
    organizations: organizations.map((value, index) => ({
      value,
      label: copy.teams[index],
    })),
    productCategories: copy.groups.map((label, group) => ({
      value: `category-${group}`,
      label,
      children: products
        .slice(group * 2, group * 2 + 2)
        .map((value, index) => ({
          value,
          label: copy.products[group * 2 + index],
        })),
    })),
    warehouseRegions: organizations.map((value, region) => ({
      value,
      label: copy.teams[region],
      children: warehouses
        .slice(region * 2, region * 2 + 2)
        .map((value, index) => ({
          value,
          label: copy.warehouses[region * 2 + index],
        })),
    })),
    deliveries: ['standard', 'express'].map((value, index) => ({
      value,
      label: copy.deliveries[index],
    })),
  }
}

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

export function orderMatchesQuery(row: DemoOrder, query: DemoOrderQuery) {
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
    (!status?.length || status.includes(row.status)) &&
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
