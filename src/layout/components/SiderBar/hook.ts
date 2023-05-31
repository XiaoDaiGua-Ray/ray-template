import { useSetting, useSignin } from '@/store'

export const useAvatarOptions = () => [
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
    const signinStore = useSignin()
    const { logout } = signinStore

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
    const settingStore = useSetting()
    const { changeSwitcher } = settingStore

    changeSwitcher(true, 'lockScreenSwitch')
  },
}

export const avatarDropdownClick = (key: string | number) => {
  const action = avatarDropdownActionMap[key]

  action ? action() : window.$message.info('这个人很懒, 没做这个功能~')
}
