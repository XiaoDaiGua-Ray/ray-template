# Shared utilities

`@/utils` preserves existing public exports. Implementations and initialization paths should import from the owning submodule to avoid loading unrelated dependencies.

| Entry point                    | Responsibility                                                                             | Representative regressions                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `core`                         | Type tags, PromiseLike values, synchronous/asynchronous error handling, random identifiers | `__test__/basic`                                                                          |
| `files`                        | Data URLs, file reading, Blob/ArrayBuffer downloads, and resource cleanup                  | `__test__/basic/downloadAnyFile.spec.ts`, `__test__/utils-contracts/fileToBase64.spec.ts` |
| `app`, `equal-router-path.ts`  | Environment, operating system, cache-key prefixes, and route-path comparison               | `__test__/app`, `__test__/basic`                                                          |
| `cache.ts`                     | Web Storage JSON access, namespaces, and failure fallback                                  | `__test__/cache`                                                                          |
| `element.ts`                   | DOM classes, inline styles, queries, colors, and CSS sizes                                 | `__test__/element`                                                                        |
| `dom.ts`                       | Open print preview after capturing an image                                                | `__test__/dom`                                                                            |
| `vue`                          | Unwrap elements/component roots, rendering functions, callbacks, and scope cleanup         | `__test__/vue`, `__test__/utils-contracts/vue-target.spec.ts`                             |
| `precision.ts`                 | Fixed-point decimal arithmetic, allocation, and formatting                                 | `__test__/precision`                                                                      |
| `legacy-crypto`                | Historical AES JSON format for local caches                                                | `__test__/utils-contracts/legacy-crypto.spec.ts`                                          |
| Object and date-picker helpers | Own-property updates, shallow copying, and range-clearing values                           | `__test__/utils-contracts/object-date.spec.ts`                                            |

`basic.ts` and `c/` are compatibility entry points for old imports. `@/utils/precision` re-exports `@ray-template/utils/precision`, implemented in [packages/utils](../../../../packages/utils/src/precision.ts) and shared by the application/documentation. Selected-menu positioning lives in `src/layout/utils` and is called by layout; historical utility entry points still re-export it. Component, Router, and Store internal helpers stay with their owning modules.

- `isPromise` checks whether a value is awaitable. Use `isAsyncFunction` to check whether a function is declared `async`. Error wrappers await any PromiseLike returned by a function.
- `uuid(length, radix)` creates custom identifiers. Length must be a nonnegative safe integer; radix must be from 1 to 62. This is not the RFC UUID format.
- A download Promise means a browser download was requested; it cannot detect completion of disk writes. Printing reports whether preview was initiated successfully; the browser owns physical output.
- `setStorage` preserves existing JSON and cache-key formats. Read failures return the specified fallback; an explicitly stored JSON `null` remains `null`. With a configured prefix, bulk deletion affects only keys with that prefix.
- `setClass`, `removeClass`, `hasClass`, `setStyle`, and `removeStyle` follow element-reference updates. Create them within a Vue scope for reactive targets. Native `class` attribute changes alone do not recompute `hasClass`.
- `removeDuplicateKeys` retains its historical name and returns a shallow copy of an object's own enumerable properties. Duplicate keys are already resolved by the last assignment when a JavaScript object is created. `updateObjectValue` updates only own properties and shallow-merges only when both old/new values are plain objects.
- `legacy-crypto` string passphrases retain the OpenSSL format; raw-key ciphertext includes a random IV. This is a compatibility layer, and the template's default passphrase is visible to clients.
