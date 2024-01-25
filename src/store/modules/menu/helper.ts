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

import { APP_MENU_CONFIG, APP_CATCH_KEY } from '@/app-config'
import { RIcon } from '@/components'
import { getStorage, isValueType } from '@/utils'
import { useAppRoot } from '@/hooks'
import { NTag } from 'naive-ui'

import type {
  AppMenuOption,
  MenuTagOptions,
  AppMenuKey,
} from '@/types/modules/app'
import type { TagProps } from 'naive-ui'

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

  return node[key] === value
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
  const temp: AppMenuOption[] = []

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

export const createMenuIcon = (option: AppMenuOption) => {
  const {
    meta: { icon },
  } = option

  if (!icon) {
    return
  }

  if (isValueType<object>(icon, 'Object')) {
    return () => icon
  }

  const _icon = h(
    RIcon,
    {
      name: icon,
      size: APP_MENU_CONFIG.menuCollapsedIconSize,
      cursor: 'pointer',
    },
    {},
  )

  return () => _icon
}

export const createMenuExtra = (option: AppMenuOption) => {
  const {
    meta: { extra },
  } = option

  if (!extra) {
    return
  }

  const tagProps: TagProps = {
    type: 'primary',
    size: 'small',
    round: true,
    bordered: false,
    strong: true,
  }

  if (isValueType<object>(extra, 'Object')) {
    const { extraLabel, extraIcon, extraType } = extra

    return () => {
      return h(
        NTag,
        {
          ...tagProps,
          type: extraType || 'primary',
        },
        {
          default: () => extraLabel,
          icon: () => extraIcon,
        },
      )
    }
  }

  return () => {
    return h(NTag, tagProps, {
      default: () => extra,
    })
  }
}

/** 获取缓存的 menu key, 如果未获取到则使用 getRootPath 当作默认激活路由菜单 */
export const getCatchMenuKey = () => {
  const { getRootPath } = useAppRoot()
  const cacheMenuKey = getStorage<AppMenuKey>(
    APP_CATCH_KEY.appMenuKey,
    'sessionStorage',
    {
      defaultValue: getRootPath.value,
    },
  )

  return cacheMenuKey
}
