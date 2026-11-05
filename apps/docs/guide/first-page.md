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

先在 `apps/admin/src/router/config/views.ts` 的 `views` 中登记组件白名单：

```ts
orders: { load: () => import('@/views/orders'), name: 'Orders' },
```

在 Mock 初始路由 JSON `apps/admin/src/mocks/data/routes.json` 中加入以下记录，或由自己的路由接口返回：

```json
{
  "path": "/orders",
  "name": "Orders",
  "component": "orders",
  "meta": { "i18nKey": "menu.Orders", "icon": "navigation/table", "order": 20 }
}
```

在中英文 `menu.json` 中加入 `Orders` 翻译。已有浏览器修改过路由时，进入路由管理载入初始配置并保存到接口，或直接在管理页添加该记录；重新加载后，从菜单、直接地址和刷新三条路径检查页面。

现成的「系统管理 → 用户管理」已演示组织筛选、远端查询、新增编辑、详情、批量操作和接口权限。可先对照这条完整流程，再接入自己的业务。其 API 与数据结构见[标准契约](./backend)。

## 接入 API

在 `apps/admin/src/api` 写订单请求函数，将 TablePro 的分页、筛选条件映射成后端的字段，并把 `data` 替换成 `request={loadOrders}`。接口需返回当前页数据和筛选后的总数。参照[远端 TablePro 在线示例](../reference/table-pro-examples#远端查询与失败恢复)接入排序、取消和错误重试。

下一步：[TablePro](../reference/table-pro) · [路由与权限](./routing) · [接口约定](./requests)
