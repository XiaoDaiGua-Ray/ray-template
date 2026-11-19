# Your first business page {#第一个业务页面}

Start with an order table. Use local data to check the page and menu, then connect a remote query.

## Create the page {#创建页面}

Add this code in `apps/admin/src/views/orders/index.tsx`.

```tsx
import { RTablePro } from '@ray-template/ui/table-pro'
import { defineComponent } from 'vue'

const rows = [{ id: 'ORD-001', customer: 'Demo customer' }]

export default defineComponent({
  name: 'Orders',
  setup() {
    return () => (
      <RTablePro
        columns={[
          { key: 'id', title: 'Order number' },
          { key: 'customer', title: 'Customer' },
        ]}
        data={rows}
        search={[{ key: 'customer', label: 'Customer' }]}
        columnStateKey="orders:list"
      />
    )
  },
})
```

The default row identifier comes from `id` or `key`. Pass `rowKey` to use another field. For a bilingual interface, add the column titles and search prompts to the language packs.

## Add the menu entry {#接入菜单}

Register the component in the `views` allowlist in `apps/admin/src/router/config/views.ts`.

```ts
orders: { load: () => import('@/views/orders'), name: 'Orders' },
```

Add the following record to the initial mock route file `packages/demo-data/src/routes.json`, or return it from your own route API.

```json
{
  "path": "/orders",
  "name": "Orders",
  "component": "orders",
  "meta": { "i18nKey": "menu.Orders", "icon": "navigation/table", "order": 20 }
}
```

Add the `Orders` translation to both `menu.json` language files. If the current browser already has a customized route configuration, load the initial configuration in Route Management and save it to the API, or add the record directly in the editor. After reloading, check the menu, the direct URL, and a browser refresh.

User Management under System Management already demonstrates department filtering, remote queries, create and edit flows, details, bulk actions, and API permissions. Use it as a complete example when integrating a feature. [Standard API contract](./backend)

## Connect the API {#接入-api}

Write the order query in `apps/admin/src/api`. Map TablePro pagination and filters to backend fields and replace `data` with `request={loadOrders}`. Return the current page of rows and the filtered total. Follow the [remote TablePro example](../reference/table-pro-examples#远端查询与失败恢复) for sorting, cancellation, and retry.

[TablePro](../reference/table-pro) · [Routes and permissions](./routing) · [Request conventions](./requests)
