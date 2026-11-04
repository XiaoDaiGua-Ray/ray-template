/**
 *
 * @param path1 第一个路由路径
 * @param path2 第二个路由路径
 *
 * @description
 * 比较路径，忽略查询参数、片段和末尾斜杠。
 */
export const equalRouterPath = (path1: string, path2: string) => {
  const normalize = (path: string) =>
    path.split(/[?#]/, 1)[0].replace(/\/+$/, '')

  return normalize(path1) === normalize(path2)
}
