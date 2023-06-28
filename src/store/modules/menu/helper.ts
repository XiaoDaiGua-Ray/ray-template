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

import { MENU_COLLAPSED_CONFIG, ROOT_ROUTE } from '@/appConfig/appConfig'
import RayIcon from '@/components/RayIcon/index'
import { isValueType } from '@/utils/hook'
import { getCache, setCache } from '@/utils/cache'

import type { VNode } from 'vue'
import type {
  AppMenuOption,
  MenuTagOptions,
  AppMenuKey,
} from '@/types/modules/app'

/**
 *
 * @param node 当前节点
 * @param key 动态字段
 * @param value 匹配值
 *
 * @remark 检查是否为所需项
 */
const check = (
  node: AppMenuOption,
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
  options: AppMenuOption,
  key: string | number,
  value: string | number,
) => {
  const temp: AppMenuOption[] = []

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
  options: AppMenuOption[],
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
 * @param key current menu key
 * @param menuTagOptions menu tag options
 *
 * @remark 查找当前菜单项
 */
export const matchMenuOption = (
  item: AppMenuOption,
  key: AppMenuKey,
  menuTagOptions: MenuTagOptions[],
) => {
  if (item.path !== key) {
    const tag = menuTagOptions.find((curr) => curr.path === item.path)

    if (!tag) {
      menuTagOptions.push(item)
    }
  }
}

/**
 *
 * @param option menu option
 *
 * @remark 动态修改浏览器标题
 * @remark 会自动拼接 sideBarLogo.title
 */
export const updateDocumentTitle = (option: AppMenuOption) => {
  const { breadcrumbLabel } = option
  const {
    layout: { sideBarLogo },
  } = __APP_CFG__
  const spliceTitle = sideBarLogo ? sideBarLogo.title : ''

  document.title = breadcrumbLabel + ' - ' + spliceTitle
}

export const hasMenuIcon = (option: AppMenuOption) => {
  const { meta } = option

  if (!meta.icon) {
    return
  }

  if (isValueType<object>(meta.icon, 'Object')) {
    return () => meta.icon
  }

  const icon = h(
    RayIcon,
    {
      name: meta!.icon as string,
      size: MENU_COLLAPSED_CONFIG.MENU_COLLAPSED_ICON_SIZE,
    },
    {},
  )

  return () => icon
}

/** 获取缓存的 menu key, 如果未获取到则使用 ROOTROUTE path 当作默认激活路由菜单 */
export const getCatchMenuKey = () => {
  const { path: rootPath } = ROOT_ROUTE
  const cacheMenuKey =
    getCache<AppMenuKey>('menuKey') === null
      ? rootPath
      : getCache<AppMenuKey>('menuKey')

  return cacheMenuKey
}
