import { apiMockEnabled } from '@/api/admin/client'
import { RIcon } from '@/components'
import { useI18n } from '@/hooks'
import { router } from '@/router'
import { ACCOUNT_PROFILE_PATH } from '@/router/constant'
import { useSettingActions, useSigningActions } from '@/store'
import type { IconOptions, IconOptionsFC } from './type'

export const createAvatarOptions = (t: ReturnType<typeof useI18n>['t']) => [
  {
    key: 'person',
    label: t('account.profile'),
    icon: () => h(RIcon, { name: 'navigation/form', size: 18 }),
  },
  {
    key: 'lockScreen',
    label: t(apiMockEnabled ? 'account.lockScreen' : 'account.lockSession'),
    icon: () => h(RIcon, { name: 'action/lock', size: 18 }),
  },
  {
    type: 'divider',
    key: 'd1',
  },
  {
    key: 'logout',
    label: t('account.signOut'),
    icon: () => h(RIcon, { name: 'action/out', size: 18 }),
  },
]

export const avatarDropdownClick = async (key: string | number) => {
  const { t } = useI18n('account')
  const { logout } = useSigningActions()
  const signOut = async (redirect?: string) => {
    try {
      await logout(redirect)

      return true
    } catch {
      window.$message.error(t('signOutFailed'))

      return false
    }
  }

  if (key === 'person') {
    await router.push(ACCOUNT_PROFILE_PATH)

    return
  }

  if (key === 'logout') {
    window.$dialog.create({
      title: t('signOut'),
      showIcon: false,
      content: t('signOutPrompt'),
      positiveText: t('signOut'),
      negativeText: t('cancel'),
      positiveButtonProps: { type: 'primary' },
      onPositiveClick: () => signOut(),
    })
  }

  if (key === 'lockScreen') {
    if (apiMockEnabled)
      useSettingActions().updateSettingState('lockScreenSwitch', true)
    else await signOut(router.currentRoute.value.fullPath)
  }
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
      name: 'navigation/menu',
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
  const { isTabletOrSmaller, isFullscreen } = opts

  const basicOptions: IconOptions[] = [
    {
      name: isFullscreen.value ? 'action/fullscreen_fold' : 'action/fullscreen',
      size: 18,
      eventKey: 'fullscreen',
    },
    {
      name: 'logo/github',
      size: 18,
      eventKey: 'github',
    },
    {
      name: 'action/setting',
      size: 18,
      eventKey: 'setting',
    },
  ]
  const notTableOrSmallerOptions: IconOptions[] = [...basicOptions]
  const tableOrSmallerOptions: IconOptions[] = basicOptions.filter(
    (option) => option.eventKey === 'setting',
  )

  return isTabletOrSmaller!.value
    ? tableOrSmallerOptions
    : notTableOrSmallerOptions
}
