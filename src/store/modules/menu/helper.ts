/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-03-03
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/** 本方法感谢 <https://yunkuangao.me/> 的支持 */

/**
 *
 * @param node 当前节点
 * @param key 动态字段
 * @param value 匹配值
 *
 * @remark 检查是否为所需项
 */
const check = (
  node: IMenuOptions,
  key: string | number,
  value: string | number,
) => {
  return node[key] === value || node.key === value
}

/**
 *
 * @param options 节点数组
 * @param key 动态字段
 * @param value 匹配值
 *
 * @remark 匹配所有节点
 */
const process = (
  options: IMenuOptions,
  key: string | number,
  value: string | number,
) => {
  const temp: IMenuOptions[] = []

  // 检查当前节点是否匹配值
  if (check(options, key, value)) {
    temp.push(options)

    return temp
  }

  // 遍历子节点
  if (options.children && options.children.length > 0) {
    for (const it of options.children) {
      // 子节点递归调用
      const innerTemp = process(it, key, value)

      // 如果子节点匹配到了，则将当前节点加入数组
      if (innerTemp.length > 0) {
        temp.push(options, ...innerTemp)
      }
    }
  }

  return temp
}

/**
 *
 * @param options 节点数组
 * @param key 动态字段
 * @param value 匹配值
 */
export const parse = (
  options: IMenuOptions[],
  key: string | number,
  value: string | number,
) => {
  const temp = []

  for (const it of options) {
    const innerTemp = process(it, key, value)

    if (innerTemp.length > 0) {
      temp.push(...innerTemp)
    }
  }

  return temp
}

/**
 *
 * @param item menu options
 *
 * @remark 查找当前菜单项
 */
export const matchMenuOption = (
  item: IMenuOptions,
  key: MenuKey,
  menuTagOptions: TagMenuOptions[],
) => {
  if (item.path !== key) {
    const tag = menuTagOptions.find((curr) => curr.path === item.path)

    if (!tag) {
      menuTagOptions.push(item)
    }
  }
}
