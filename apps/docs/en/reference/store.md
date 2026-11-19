# Stores {#store}

Pinia manages cross-page state. Import getters and actions from `@/store`, read refs with `.value`, and use actions for changes. State owned by one component or page can stay in a local ref.

| Store                                            | Access                                          | Persistence                                                                                                                      |
| ------------------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [Setting](./store/setting)                       | `useSettingGetters` / `useSettingActions`       | Local Storage key `piniaSettingStore` excludes the lock configuration dialog. The current language is also stored separately.    |
| [Menu](./store/navigation#menu-store)            | `useMenuGetters` / `useMenuActions`             | Local Storage retains the sidebar's collapsed state. Open tabs use Session Storage. Selection is derived from the current route. |
| [KeepAlive](./store/navigation#keepalive-store)  | `useKeepAliveGetters` / `useKeepAliveActions`   | Session Storage retains names eligible for caching.                                                                              |
| [Runtime](./store/runtime#runtime-store)         | `useRuntimeGetters` / `useRuntimeActions`       | Lives for the current Pinia instance.                                                                                            |
| [Lock Screen](./store/runtime#lock-screen-store) | `useLockScreenGetters` / `useLockScreenActions` | Legacy Local Storage boolean with cross-tab sync.                                                                                |
| [Signing](./store/signing)                       | `useSigningGetters` / `useSigningActions`       | Profile and permissions live in memory and are restored from the session API. Bearer mode stores the token in Local Storage.     |

## Initialization and extension {#初始化与扩展}

`setupStore(app)` installs Pinia and its persistence plugin. Unmount releases the Pinia instance and scope. The template entry point already installs them. Access Menu and Signing from a component's active setup context when using APIs that depend on routing.

Add each store under `apps/admin/src/store/modules` with a unique ID. For persistence, use `pick` or `omit`, a suitable storage area and stable key, and serializable data. Put the accessors under `apps/admin/src/store/hooks` and export them from `apps/admin/src/store/index.ts`. Raw `pinia…Store` exports are available internally. Pages should use hooks to reduce coupling to implementation fields.

Cache keys and JSON formats are data contracts. Consider reads, migration, and fallback for old values before changing keys, fields, or serialization. Keep server secrets out of browser storage.

[Initialization and exports](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/index.ts) · [Store conventions](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/README.md)
