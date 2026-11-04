# Store

模板使用 Pinia 管理跨页面状态。业务代码从 `@/store` 导入相应的 Getters / Actions，读取引用用 `.value`，修改走动作。只属于一个组件或页面的状态可以继续用本地 ref。

| Store                                            | 访问入口                                        | 持久化                                                                      |
| ------------------------------------------------ | ----------------------------------------------- | --------------------------------------------------------------------------- |
| [Setting](./store/setting)                       | `useSettingGetters` / `useSettingActions`       | Local Storage `piniaSettingStore`，排除锁屏设置弹窗显隐；当前语言另外保存。 |
| [Menu](./store/navigation#menu-store)            | `useMenuGetters` / `useMenuActions`             | Local Storage 保存当前菜单和折叠状态；标签列表另存 Session Storage。        |
| [KeepAlive](./store/navigation#keepalive-store)  | `useKeepAliveGetters` / `useKeepAliveActions`   | Session Storage 保存可缓存组件名。                                          |
| [Runtime](./store/runtime#runtime-store)         | `useRuntimeGetters` / `useRuntimeActions`       | 无；随当前 Pinia 实例释放。                                                 |
| [Lock Screen](./store/runtime#lock-screen-store) | `useLockScreenGetters` / `useLockScreenActions` | Local Storage 的历史布尔值，支持跨标签同步。                                |
| [Signing](./store/signing)                       | `useSigningGetters` / `useSigningActions`       | Local Storage 持久化账号显示信息，路由守卫另读 token。                      |

## 初始化与扩展

`setupStore(app)` 安装 Pinia 与持久化插件，应用卸载时释放 Pinia 实例及作用域。模板入口已调用，业务代码无需再次注册。Menu 与 Signing 依赖 Router 注入，请在应用组件的有效 setup 中访问。

新增 Store 在 `apps/admin/src/store/modules` 按领域建目录并指定唯一 ID。需要持久化时使用 `pick` 或 `omit`，选定存储范围和稳定的 key，只保存可序列化的值。调用接口放到 `apps/admin/src/store/hooks`，再由 `apps/admin/src/store/index.ts` 导出。原始 `pinia…Store` 同样公开给模板内部，但页面使用 hooks 可以减少对实现字段的直接依赖。

缓存键和 JSON 结构是已有数据契约。换 key、拆字段或改变序列化格式时，要考虑旧数据的读取、迁移和回退。浏览器缓存不应保存服务端密钥。

[初始化与公开导出](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/index.ts) · [Store 源码约定](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/README.md)
