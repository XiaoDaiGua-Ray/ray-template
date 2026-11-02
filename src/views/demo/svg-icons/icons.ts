// Vite 8 的依赖扫描会将含 glob 的模块当作 JS；单独放在 TS 文件中避免保留的 JSX 被误解析。
// 上游扫描器支持 JSX + import.meta.glob 后可合并回演示组件。
export const iconNames = Object.keys(import.meta.glob('@/icons/**/*.svg'))
  .map((path) =>
    path
      .split('/')
      .at(-1)
      ?.replace(/\.svg$/, ''),
  )
  .filter((name): name is string => Boolean(name))
