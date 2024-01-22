import { useI18n } from '@/hooks'
import { useSigningActions, useSettingActions } from '@/store'

import type { IconOptionsFC, IconOptions } from './type'

/**
 *
 * 创建头像点击下拉菜单
 */
export const createAvatarOptions = () => [
  {
    key: 'person',
    label: '个人信息',
  },
  {
    key: 'lockScreen',
    label: '锁定屏幕',
  },
  {
    type: 'divider',
    key: 'd1',
  },
  {
    key: 'logout',
    label: '退出登陆',
  },
]

/**
 *
 * 头像 Dropdown 下拉点击事件 map
 */
const avatarDropdownActionMap = {
  /**
   *
   * 退出登陆
   * 清除所有 session 缓存并且重定向至登录页
   */
  logout: () => {
    const { logout } = useSigningActions()

    window.$dialog.warning({
      title: '提示',
      content: '您确定要退出登录吗',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: () => {
        logout()
      },
    })
  },
  /**
   *
   * 锁定屏幕
   */
  lockScreen: () => {
    const { updateSettingState } = useSettingActions()

    updateSettingState('lockScreenSwitch', true)
  },
}

export const avatarDropdownClick = (key: string | number) => {
  const action = avatarDropdownActionMap[key]

  action ? action() : window.$message.info('这个人很懒, 没做这个功能~')
}

/**
 *
 * @param opts 当前操作栏依赖的 ref 集合
 *
 * 创建顶部操作栏左侧操作按钮
 * isTabletOrSmaller:
 *   - true: 菜单按钮
 *   - false: 刷新按钮
 */
export const createLeftIconOptions = (opts: IconOptionsFC) => {
  const { isTabletOrSmaller } = opts

  const notTableOrSmallerOptions: IconOptions[] = []
  const tableOrSmallerOptions: IconOptions[] = [
    {
      name: 'menu',
      size: 18,
      eventKey: 'menu',
    },
  ]

  return isTabletOrSmaller!.value
    ? tableOrSmallerOptions
    : notTableOrSmallerOptions
}

/**
 *
 * @param opts 当前操作栏依赖的 ref 集合
 *
 * 创建顶部操作栏右侧操作按钮
 * isTabletOrSmaller:
 *   - false: 不展示搜索按钮
 */
export const createRightIconOptions = (opts: IconOptionsFC) => {
  const { isFullscreen, isTabletOrSmaller } = opts
  const { t } = useI18n()

  const basicOptions: IconOptions[] = [
    {
      name: 'fullscreen',
      size: 18,
      tooltip: isFullscreen.value
        ? t('headerTooltip.CancelFullScreen')
        : t('headerTooltip.FullScreen'),
      eventKey: 'screen',
    },
    {
      name: 'github',
      size: 18,
      tooltip: t('headerTooltip.Github'),
      eventKey: 'github',
    },
    {
      name: 'setting',
      size: 18,
      tooltip: t('headerTooltip.Setting'),
      eventKey: 'setting',
    },
  ]
  const notTableOrSmallerOptions: IconOptions[] = [
    {
      name: 'search',
      size: 18,
      tooltip: t('headerTooltip.Search'),
      eventKey: 'search',
    },
    ...basicOptions,
  ]
  const tableOrSmallerOptions: IconOptions[] = [...basicOptions]

  return isTabletOrSmaller!.value
    ? tableOrSmallerOptions
    : notTableOrSmallerOptions
}
