# 缓存与兼容加密

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

## 交互示例

<AdminExample path="/cache-demo" title="缓存的写入、读取和删除" />

::: details 查看示例源码
<<< @/../admin/src/views/demo/cache-demo/index.tsx
:::

## Web Storage

默认使用 `sessionStorage`，传 `'localStorage'` 跨刷新保存。所有读写值按 JSON 序列化。类型参数仅影响 TypeScript，不能确认缓存格式。

| API                                              | 行为                                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `setStorage(key, value, storageType?, options?)` | 写入可序列化值，空键、循环引用或浏览器拒绝写入时记录错误。                                  |
| `getStorage<T>(key, storageType?, options?)`     | 缺键、损坏或不可读时返回 `options.defaultValue` 或 `null`；显式 JSON `null` 仍返回 `null`。 |
| `hasStorage(key, storageType?, options?)`        | 检查键存在，存储不可访问时返回 `false`，不验证 JSON 内容。                                  |
| `removeStorage(key, storageType?, options?)`     | 删除单键。也可传 `__all__`、`__all_sessionStorage__` 或 `__all_localStorage__` 做批量删除。 |
| `prefixCacheKey(key, { customPrefix }?)`         | 拼接自定义前缀或默认 `APP_CATCH_KEY_PREFIX`，分隔符需包含在前缀内。                         |

缓存方法只有在 `options.prefix: true` 时才调用前缀函数，`prefixKey` 覆盖默认值。启用非空前缀时，批量删除只影响匹配的键；空前缀会清整个对应存储区域。读写和删除使用同一套前缀选项。Pinia 插件使用自己的持久化配置，修改工具前缀不会迁移 Pinia 的历史数据。

```ts
import { getStorage, removeStorage, setStorage } from '@/utils'

const options = { prefix: true, prefixKey: 'inventory:' }
export function saveOrderFilter(status: string) {
  setStorage('order-filter', { status }, 'sessionStorage', options)
}
export const readOrderFilter = () =>
  getStorage<{ status: string }>('order-filter', 'sessionStorage', options)
export const clearOrderFilter = () =>
  removeStorage('order-filter', 'sessionStorage', options)
```

独立包中的 `createStorage(storage, prefix?)` 为宿主提供的同步后端生成 `get`、`set`、`remove`。它使用相同的 JSON 格式；读取失败返回 `null`，写入或删除失败不向外抛错。不能序列化的值（包括 `undefined`、函数和循环引用）不会覆盖已有内容。前缀直接与键拼接。

## 兼容 AES JSON

下面的实验可以比较缓存键前缀，并用示例口令把一段 JSON 加密后还原。

<AdminExample path="/docs-storage-utils" title="缓存键与旧版 AES JSON" />

::: details 查看示例源码
<<< @/../admin/src/views/demo/docs-storage-utils.tsx
:::

`encrypt(data, key?)` 返回 JSON 密文，`decrypt(ciphertext, key?)` 解码。可用字符串口令或 CryptoJS `WordArray`，同一数据须使用同类型和内容的 key。字符串沿用 OpenSSL 兼容格式，原始密钥使用随机 IV，字符串序列化为 `IV:密文`。错误密文或密钥会记录错误并返回 `undefined`，无法 JSON 序列化的输入会使加密抛错。

`CRYPTO_KEY` 是应用公开的历史兼容常量。这个工具用于读取既有本地数据（如演示锁屏），不能保护服务端密钥或替代认证。迁移格式时先保留对历史密文的读取能力。

[缓存实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/utils/cache.ts) · [加密](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/utils/legacy-crypto/encrypt.ts) · [解密](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/utils/legacy-crypto/decrypt.ts)
