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

## 分包

从 `4.8.0` 版本起，支持了 `svg icon` 分包，可以按照业务模块进行分包管理。

仅需要在 `src/icons` 目录下新建一个文件夹，然后将对应的 `svg` 图标放入其中即可。


## 构建说明

`@spiriit/vite-plugin-svg-spritemap` 将图标打包为独立的带 hash 雪碧图。`RIcon` 使用标准 `href` 引用，开发和生产路径会跟随 Vite `base`，调用方仍然只需传递原有 `name`。

图标名称全局唯一，即使分在不同目录也不能重复。预览页的文件扫描放在独立 `.ts` 文件中，避免 Vite 8 对 `import.meta.glob` 与 JSX 混用的扫描限制；上游修复后可重新评估这一拆分。
