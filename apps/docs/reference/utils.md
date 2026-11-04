# 工具函数

`@/utils` 汇总模板公开工具。应用初始化或底层模块可以按职责从 `@/utils/core`、`@/utils/cache`、`@/utils/files` 等入口导入，避免加载无关依赖。历史 `basic.ts` 和 `c/` 仍作为转发入口。

| 主题                              | API                                                                     |
| --------------------------------- | ----------------------------------------------------------------------- |
| [基础、日期与数值](./utils/core)  | 类型判断、PromiseLike、随机标识、错误处理、对象更新、日期范围、定点运算 |
| [缓存与兼容加密](./utils/storage) | Local / Session Storage、前缀、历史 AES JSON                            |
| [Vue 与浏览器](./utils/browser)   | ref / DOM 解包、样式、查询、下载、截图打印、侧栏定位                    |

下载和打印需要在浏览器执行，响应式 DOM 工具应在 Vue 作用域内创建。缓存和文件 API 的泛型不校验外部数据结构；跨信任边界时先验证输入。

[公开导出](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/utils/index.ts) · [实现与回归索引](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/utils/README.md)
