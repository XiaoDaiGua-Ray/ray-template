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

import { APP_MENU_CONFIG, ROOT_ROUTE } from '@/app-config/appConfig'
import RIcon from '@/components/RIcon/index'
import { isValueType } from '@/utils/hook'
import { getStorage, setStorage } from '@/utils/cache'

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
const isMatch = (
  node: AppMenuOption,
  key: string | number,
  value: string | number,
) => {
  if (!node || typeof node !== 'object') {
    return false
  }

  if (node[key] === value) {
    return true
  }

  return false
}

/**
 *
 * @param options 节点数组
 * @param key 动态字段
 * @param value 匹配值
 *
 * @remark 匹配所有节点
 */
const findMatchingNodes = (
  options: AppMenuOption,
  key: string | number,
  value: string | number,
) => {
  const temp: AppMenuOption[] = []

  // 检查当前节点是否匹配值
  if (isMatch(options, key, value)) {
    temp.push(options)

    return temp
  }

  // 遍历子节点
  if (options.children && options.children.length > 0) {
    for (const it of options.children) {
      // 子节点递归调用
      const innerTemp = findMatchingNodes(it, key, value)

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
export const parseAndFindMatchingNodes = (
  options: AppMenuOption[],
  key: string | number,
  value: string | number,
) => {
  const temp = []

  for (const it of options) {
    const innerTemp = findMatchingNodes(it, key, value)

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
    RIcon,
    {
      name: meta!.icon as string,
      size: APP_MENU_CONFIG.MENU_COLLAPSED_ICON_SIZE,
      cursor: 'pointer',
    },
    {},
  )

  return () => icon
}

/** 获取缓存的 menu key, 如果未获取到则使用 ROOTROUTE path 当作默认激活路由菜单 */
export const getCatchMenuKey = () => {
  const { path: rootPath } = ROOT_ROUTE
  const cacheMenuKey = getStorage<AppMenuKey>(
    'menuKey',
    'sessionStorage',
    rootPath,
  )

  return cacheMenuKey
}
