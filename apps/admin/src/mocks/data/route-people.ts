import type { RouteDemoPerson } from '@ray-template/api-contracts/demo'

export const routeDemoPeople: RouteDemoPerson[] = Array.from(
  { length: 10 },
  (_, index) => ({
    key: index,
    name: `张三${index}`,
    address: 'New York No. 1 Lake Park',
    phone: '010-121212',
  }),
)
