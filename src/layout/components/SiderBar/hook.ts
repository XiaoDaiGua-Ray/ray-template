import { useI18n } from '@/hooks/web/index'
import {
  useSigningActions,
  useSigningGetters,
  useSettingActions,
} from '@/store'

import type { IconOptionsFC, IconOptions } from './type'

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

const avatarDropdownActionMap = {
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
  lockScreen: () => {
    const { changeSwitcher } = useSettingActions()

    changeSwitcher(true, 'lockScreenSwitch')
  },
}

export const avatarDropdownClick = (key: string | number) => {
  const action = avatarDropdownActionMap[key]

  action ? action() : window.$message.info('这个人很懒, 没做这个功能~')
}

export const createLeftIconOptions = (opts: IconOptionsFC) => {
  const { isTabletOrSmaller, globalMainLayoutLoad } = opts
  const { t } = useI18n()

  const notTableOrSmallerOptions: IconOptions[] = [
    {
      name: 'reload',
      size: 18,
      tooltip: t('headerTooltip.Reload'),
      iconClass: !globalMainLayoutLoad.value ? 'ray-icon__reload--loading' : '',
      eventKey: 'reload',
    },
  ]
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
