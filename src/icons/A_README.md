## 说明

该文件包属于全局 `svg icon`，配合 `RIcon` 组件使用。

## TIP

添加新的 `svg` 图标时，应该注意图标自带 `fill` 属性的管理。如果自带了 `fill` 属性的图标，则会导致使用组件 `color` 属性失效的问题。所以如果是需要动态使用 `css` 属性控制样式的图标，应该去掉其 `fill` 属性或者配置为 `fill = currentColor`。

```html
<svg fill="currentColor"></svg>
```

## 使用方法

- 导入 `svg` 图标
- 命名（`命名必须全局唯一，并且尽量避免使用特殊符号`）
- 导入 `RIcon` 组件，配置 `name` 属性即可将 `svg` 作为图标使用
