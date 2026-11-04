# RSegment

`width` 支持 `fitContent`、`block` 和像素数值。示例见 [分段器试验台](../../../../apps/admin/src/views/demo/segment/index.tsx)。

在 Naive UI 2.45.3 中，选中态默认加粗。轨道使用内容宽度时，尤其是标签长短不同或带图标、提示时，切换选中态会改变轨道宽度。NTabs 的轨道 ResizeObserver 随即执行 `handleSegmentResize`，临时加上 `transition-disabled` 并强制同步胶囊位置。这个同步会让刚开始的位移动画跳到终点。

`fitContent` 模式按标签和轨道内边距的实际宽度排版，固定各标签的字重，用颜色和胶囊标示选中态。只有内容宽于可用空间时才横向滚动。轨道真正发生尺寸变化时继续让 NTabs 同步位置。减少动态效果偏好下取消胶囊过渡。
