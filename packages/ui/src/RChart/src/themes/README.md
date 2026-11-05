# RChart 主题

四套风格分别放在 `modern/`、`naive/`、`material/`、`plain/`，每套都有明、暗两份独立 JSON。文件名是 ECharts 注册名，例如 `modern/ray-modern.json` → `ray-modern`，`modern/ray-modern-dark.json` → `ray-modern-dark`。

| 风格 | 配色与绘图样式 |
| --- | --- |
| Modern | Ray 蓝、冷色网格、虚线分隔、轻量面积填充 |
| Naive | 翡翠绿、实线网格、较小圆角 |
| Material | 紫色调、加粗折线、较大圆角与柔和面积填充 |
| Plain | 低饱和色、点线网格、直角柱和无阴影提示框 |

使用 [ECharts 主题编辑器](https://echarts.apache.org/zh/theme-builder.html) 调整时，导出 JSON 放在对应目录。加载器按文件名自动注册；不同目录也不要使用相同的文件名。只有明色文件时继续使用该主题；提供 `-dark.json` 后随应用明暗切换。业务 `options` 中显式设置的颜色和样式仍优先。

旧版 `macarons` 与 `macarons-dark` 已移除。原先写死主题名的页面可移除 `theme` 以跟随界面风格，或改成新主题的注册名。
