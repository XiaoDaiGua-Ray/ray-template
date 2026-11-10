import { APP_CATCH_KEY } from '@/app-config'
import { useI18n } from '@/hooks'
import { resolveIconName } from '@/icons'
import type { AppMenuKey, AppMenuOption } from '@/types/modules/app'
import { getStorage } from '@/utils/cache'
import { isValueType } from '@/utils/core'
import { RIcon } from '@ray-template/ui/icon'
import { NTag } from 'naive-ui'
import type { TagProps } from 'naive-ui'
import { piniaSettingStore } from '../setting'

/**
 *
 * @param node 待检查的菜单节点
 * @param key 需要比较的属性
 * @param value 目标属性值
 *
 * @description
 * 比较菜单节点的指定属性，原实现参考 https://yunkuangao.me/。
 *
 * @returns 节点有效且指定属性匹配时返回 true
 */
const isMatch = (
  node: AppMenuOption,
  key: string | number,
  value: string | number,
) => {
  if (!node || typeof node !== 'object') {
    return false
  }

  return node[key as keyof AppMenuOption] === value
}

/**
 *
 * @param options 节点数组
 * @param key 动态字段
 * @param value 匹配值
 *
 * @description
 * 匹配所有节点。
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
 *
 * @description
 * 反向查找匹配的节点，允许从子节点，查找到完整的父子节点。
 * 查找的完整节点路径，会平铺展开，返回一个一维数组。
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
 * @param option menu option
 *
 * @description
 * 动态修改浏览器标题。
 * 会自动拼接 sideBarLogo.title。
 */
export const updateDocumentTitle = (
  option: Pick<AppMenuOption, 'breadcrumbLabel'>,
) => {
  const { dynamicDocumentTitle } = piniaSettingStore()

  if (!dynamicDocumentTitle) {
    return
  }

  const { breadcrumbLabel } = option

  if (!breadcrumbLabel) {
    return
  }

  const { sideBarLogo } = piniaSettingStore()
  const spliceTitle = sideBarLogo ? sideBarLogo.title : ''

  document.title = breadcrumbLabel + ' - ' + spliceTitle
}

/**
 *
 * @param option menu option
 *
 * @description
 * 创建菜单图标，接受一个 AppMenuOption 类型的参数，或者一个包含 AppMenuOption 核心数据的对象。
 *
 * @example
 * createMenuIcon({ ...AppMenuOption })
 */
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

  const name = resolveIconName(icon)

  if (!name) return

  return () =>
    h(RIcon, {
      name,
      size: '1em',
    })
}

/**
 *
 * @param option menu option
 *
 * @description
 * 创建菜单额外内容，接受一个 AppMenuOption 类型的参数，或者一个包含 AppMenuOption 核心数据的对象
 *
 * @example
 * createMenuExtra({ ...AppMenuOption })
 */
export const createMenuExtra = (option: AppMenuOption) => {
  const {
    meta: { extra },
  } = option

  if (!extra) {
    return
  }

  const { show } = extra

  if (show === false) {
    return
  }

  const { t } = useI18n()
  const { label, icon, type, i18nLabel } = extra
  const tagProps: TagProps = {
    type: 'primary',
    size: 'small',
    round: true,
    bordered: false,
    strong: true,
  }

  return () =>
    h(
      NTag,
      { ...tagProps, type: type || 'primary' },
      {
        default: () => (i18nLabel ? t(i18nLabel) : label),
        icon: icon
          ? () => (typeof icon === 'string' ? h(RIcon, { name: icon }) : icon)
          : void 0,
      },
    )
}

/**
 *
 * @returns 缓存中的业务菜单 key；缺少缓存时返回 null，不选择默认菜单。
 */
export const getCatchMenuKey = () => {
  const cacheMenuKey = getStorage<AppMenuKey>(
    APP_CATCH_KEY.appMenuKey,
    'sessionStorage',
  )

  return cacheMenuKey
}

/**
 *
 * @returns 获取缓存的菜单标签页
 */
export const getCatchMenuTagOptions = () => {
  const cached = getStorage<AppMenuOption[]>(
    APP_CATCH_KEY.appMenuTagOptions,
    'sessionStorage',
  )

  return Array.isArray(cached)
    ? cached.filter((item) => typeof item?.fullPath === 'string')
    : []
}
