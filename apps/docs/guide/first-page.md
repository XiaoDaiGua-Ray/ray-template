# 第一个业务页面

从一张订单表开始：先用本地数据验证页面与菜单，再改为远端查询。

## 创建页面

在 `apps/admin/src/views/orders/index.tsx` 添加：

```tsx
import { RTablePro } from '@ray-template/ui/table-pro'
import { defineComponent } from 'vue'

const rows = [{ id: 'ORD-001', customer: '演示客户' }]

export default defineComponent({
  name: 'Orders',
  setup() {
    return () => (
      <RTablePro
        columns={[
          { key: 'id', title: '订单号' },
          { key: 'customer', title: '客户' },
        ]}
        data={rows}
        search={[{ key: 'customer', label: '客户' }]}
        columnStateKey="orders:list"
      />
    )
  },
})
```

默认行标识取 `id` 或 `key`。自定义标识字段时传 `rowKey`。示例中的列标题为中文，提供中英文界面时也要将列标题和查询提示加入语言包。

## 接入菜单

在 `apps/admin/src/router/modules/orders.ts` 添加：

```ts
import type { AppRouteRecordRaw } from '@/router/types'

const orders: AppRouteRecordRaw = {
  path: '/orders',
  name: 'Orders',
  component: () => import('@/views/orders'),
  meta: {
    i18nKey: 'menu.Orders',
    icon: 'navigation/table',
    order: 20,
  },
}

export default orders
```

在 `apps/admin/src/locales/lang/zh-CN/menu.json` 和 `apps/admin/src/locales/lang/en-US/menu.json` 分别加入 `Orders` 的翻译。重新加载工作台，从菜单打开订单页，再刷新一次，确认路由可恢复。

## 接入 API

在 `apps/admin/src/api` 写订单请求函数，将 TablePro 的分页、筛选条件映射成后端的字段，并把 `data` 替换成 `request={loadOrders}`。接口需返回当前页数据和筛选后的总数。参照[远端 TablePro 示例](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/views/demo/tables/remote.tsx)接入排序、取消和错误重试。

下一步：[TablePro](../reference/table-pro) · [路由与权限](./routing) · [接口约定](./requests)
