## 常见问题

### 路由

#### 缓存失效

> 如果出现缓存配置不生效的情况可以按照如下方法进行排查

- 查看 APP_KEEP_ALIVE setupKeepAlive 属性是否配置为 true
- 查看每个组件的 `name` 是否唯一，[`KeepAlive`](https://cn.vuejs.org/guide/built-ins/keep-alive.html) 组件重度依赖组件 `name` 作为唯一标识。详情可以查看官方文档
- 查看该页面的路由配置是否正确，比如：`path` 是否按照模板约定方式进行配置

#### 自动导入失败

> 模板采用自动导入路由模块方式。如果发现路由导入有误、或者导入报错，请查看文件命名是否有误。

### 国际化

#### 国际化切换错误、警告

> 模板二次封装 [`useI18n`](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/src/locales/useI18n.ts) 方法，首选该方法作为国际化语言切换方法。
