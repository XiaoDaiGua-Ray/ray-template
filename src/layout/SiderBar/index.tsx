import './index.scss'
import { NLayoutHeader, NSpace, NTooltip, NDropdown } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'
import { useMenu, useSetting } from '@/store'
import { useLanguageOptions } from '@/language/index'
import SettingDrawer from './Components/SettingDrawer/index'
import { useAvatarOptions } from './hook'
import { removeCache } from '@/utils/cache'

import type { IconEventMapOptions, IconEventMap } from './type'

const SiderBar = defineComponent({
  name: 'SiderBar',
  setup() {
    const menuStore = useMenu()
    const settingStore = useSetting()

    const { t } = useI18n()
    const { changeReloadLog } = menuStore
    const { updateLocale } = settingStore
    const modelDrawerPlacement = ref(settingStore.drawerPlacement)
    const showSettings = ref(false)

    const leftIconOptions = [
      {
        name: 'reload',
        size: 18,
        tooltip: 'LayoutHeaderTooltipOptions.Reload',
      },
    ]
    const rightIconOptions = [
      {
        name: 'language',
        size: 18,
        tooltip: '',
        dropdown: {
          methodName: 'handleSelect', // 默认为 `handleSelect`
          switch: true,
          options: useLanguageOptions(),
          handleSelect: (key: string | number) => updateLocale(String(key)),
        },
      },
      {
        name: 'github',
        size: 18,
        tooltip: 'LayoutHeaderTooltipOptions.Github',
      },
      {
        name: 'setting',
        size: 18,
        tooltip: 'LayoutHeaderTooltipOptions.Setting',
      },
      {
        name: 'ray',
        size: 22,
        tooltip: '',
        dropdown: {
          methodName: 'handleSelect', // 默认为 `handleSelect`
          switch: true,
          options: useAvatarOptions(),
          handleSelect: (key: string | number) => {
            if (key === 'logout') {
              window.$dialog.warning({
                title: '提示',
                content: '您确定要退出登录吗',
                positiveText: '确定',
                negativeText: '不确定',
                onPositiveClick: () => {
                  window.$message.info('账号退出中...')

                  removeCache('all-sessionStorage')

                  setTimeout(() => window.location.reload(), 2 * 1000)
                },
              })
            } else {
              window.$message.info('这个人很懒, 没做这个功能~')
            }
          },
        },
      },
    ]
    const iconEventMap: IconEventMapOptions = {
      reload: () => {
        changeReloadLog(false)

        setTimeout(() => changeReloadLog(true))
      },
      setting: () => {
        showSettings.value = true
      },
      github: () => {
        window.open('https://github.com/XiaoDaiGua-Ray/ray-template')
      },
    }

    const handleIconClick = (key: IconEventMap) => {
      iconEventMap[key]?.()
    }

    return {
      leftIconOptions,
      rightIconOptions,
      t,
      handleIconClick,
      modelDrawerPlacement,
      showSettings,
    }
  },
  render() {
    return (
      <NLayoutHeader class="layout-header" bordered>
        <NSpace
          class="layout-header__method"
          align="center"
          justify="space-between"
        >
          <NSpace align="center">
            {this.leftIconOptions.map((curr) => (
              <NTooltip>
                {{
                  trigger: () => (
                    <RayIcon
                      customClassName="layout-header__method--icon"
                      name={curr.name}
                      size={curr.size}
                      onClick={this.handleIconClick.bind(this, curr.name)}
                    />
                  ),
                  default: () => this.t(curr.tooltip),
                }}
              </NTooltip>
            ))}
          </NSpace>
          <NSpace align="center">
            {this.rightIconOptions.map((curr) =>
              curr.dropdown?.switch ? (
                <NDropdown
                  options={curr.dropdown.options}
                  onSelect={
                    curr.dropdown[curr.dropdown.methodName ?? 'handleSelect']
                  }
                >
                  <RayIcon
                    customClassName="layout-header__method--icon"
                    name={curr.name}
                    size={curr.size}
                  />
                </NDropdown>
              ) : (
                <NTooltip>
                  {{
                    trigger: () => (
                      <RayIcon
                        customClassName="layout-header__method--icon"
                        name={curr.name}
                        size={curr.size}
                        onClick={this.handleIconClick.bind(this, curr.name)}
                      />
                    ),
                    default: () => this.t(curr.tooltip),
                  }}
                </NTooltip>
              ),
            )}
          </NSpace>
        </NSpace>
        <SettingDrawer
          v-model:show={this.showSettings}
          placement={this.modelDrawerPlacement}
        />
      </NLayoutHeader>
    )
  },
})

export default SiderBar
