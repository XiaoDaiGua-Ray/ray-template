# Storage and Legacy Encryption {#缓存与兼容加密}

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

## Interactive example {#交互示例}

<AdminExample path="/cache-demo" title="Write, read, and remove cached values" />

::: details View example source
<<< @/../admin/src/views/demo/cache-demo/index.tsx
:::

## Web Storage

The default is `sessionStorage`, scoped to the current tab session. Pass `'localStorage'` for persistence beyond that session. Values use JSON serialization. Type parameters affect compile-time typing. Validate the stored shape when needed.

| API                                              | Behavior                                                                                                               |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `setStorage(key, value, storageType?, options?)` | Writes a serializable value. Empty keys, circular references, and denied writes log an error.                          |
| `getStorage<T>(key, storageType?, options?)`     | Returns `options.defaultValue` or `null` when missing, malformed, or unreadable. An explicit JSON `null` stays `null`. |
| `hasStorage(key, storageType?, options?)`        | Checks for a key and returns `false` if storage is inaccessible. JSON content is not validated.                        |
| `removeStorage(key, storageType?, options?)`     | Removes a key. `__all__`, `__all_sessionStorage__`, and `__all_localStorage__` perform bulk removal.                   |
| `prefixCacheKey(key, { customPrefix }?)`         | Prepends the custom prefix or `APP_CATCH_KEY_PREFIX`. Include any separator in the prefix.                             |

Storage methods call the prefix helper only with `options.prefix: true`. `prefixKey` overrides the default. A nonempty prefix limits bulk removal to matching keys. With an empty prefix, removal clears the corresponding storage area. Use the same prefix options for reads, writes, and removal. Pinia has its own persistence settings, so changing this utility prefix leaves old Pinia data in place.

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

The shared package's `createStorage(storage, prefix?)` builds `get`, `set`, and `remove` on a host-provided synchronous store. It uses the same JSON format. Failed reads return `null` and failed writes or removals are contained. Unserializable values such as `undefined`, functions, and circular objects leave existing data intact. The prefix is concatenated directly with the key.

## Legacy AES JSON {#兼容-aes-json}

This example compares cache key prefixes and uses a sample passphrase to encrypt and recover JSON.

<AdminExample path="/docs-storage-utils" title="Cache keys and legacy AES JSON" />

::: details View example source
<<< @/../admin/src/views/demo/docs-storage-utils.tsx
:::

`encrypt(data, key?)` returns serialized JSON ciphertext and `decrypt(ciphertext, key?)` decodes it. Use a passphrase string or CryptoJS `WordArray`. Encryption and decryption require the same key type and contents. Passphrases use the OpenSSL-compatible format. Raw keys use a random IV and serialize to `IV:ciphertext`. An invalid ciphertext or key logs an error and returns `undefined`. Unserializable input throws during encryption.

`CRYPTO_KEY` is a public compatibility constant for existing local data, such as the demo lock screen. Protect server credentials and sessions with server-side mechanisms. Preserve reads of legacy ciphertext when migrating formats.

[Storage implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/utils/cache.ts) · [Encryption](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/utils/legacy-crypto/encrypt.ts) · [Decryption](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/utils/legacy-crypto/decrypt.ts)
