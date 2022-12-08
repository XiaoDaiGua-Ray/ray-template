import './index.scss'
import { NLayoutHeader, NSpace, NTooltip, NDropdown } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'
import { useSetting } from '@/store'
import { useLanguageOptions } from '@/language/index'
import SettingDrawer from './Components/SettingDrawer/index'
import { useAvatarOptions } from './hook'
import { removeCache } from '@/utils/cache'
import screenfull from 'screenfull'

import type { IconEventMapOptions, IconEventMap, IconOptions } from './type'

/**
 *
 * 本来想通过写数据配置化的方式实现顶部的功能小按钮, 结果事实发现...
 * 但是我又不想改, 就这样吧
 */

const SiderBar = defineComponent({
  name: 'SiderBar',
  setup() {
    const settingStore = useSetting()

    const { t } = useI18n()
    const { updateLocale, changeSwitcher } = settingStore
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
        name: 'fullscreen',
        size: 18,
        tooltip: '',
        eventKey: 'screen',
      },
      {
        name: 'language',
        size: 18,
        tooltip: '',
        dropdown: {
          eventKey: 'handleSelect', // 默认为 `handleSelect`
          switch: true,
          options: useLanguageOptions(),
          handleSelect: (key: string | number) => updateLocale(String(key)),
        },
      },
      {
        name: 'github',
        size: 18,
        tooltip: 'LayoutHeaderTooltipOptions.Github',
        eventKey: 'github',
      },
      {
        name: 'setting',
        size: 18,
        tooltip: 'LayoutHeaderTooltipOptions.Setting',
        eventKey: 'setting',
      },
      {
        name: 'ray',
        size: 22,
        tooltip: '',
        dropdown: {
          eventKey: 'handleSelect', // 默认为 `handleSelect`
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
        changeSwitcher(false, 'reloadRouteSwitch')

        setTimeout(() => changeSwitcher(true, 'reloadRouteSwitch'))
      },
      setting: () => {
        showSettings.value = true
      },
      github: () => {
        window.open('https://github.com/XiaoDaiGua-Ray/ray-template')
      },
      screen: () => {
        if (screenfull.isEnabled) {
          screenfull.toggle()
        } else {
          window.$message.warning('您的浏览器不支持全屏~')
        }
      },
    }

    const handleIconClick = (key: IconEventMap) => {
      iconEventMap[key]?.()
    }

    const Icon = (curr: IconOptions) => (
      <RayIcon
        customClassName="layout-header__method--icon"
        name={curr.name}
        size={curr.size}
        onClick={handleIconClick.bind(this, curr.eventKey ?? '')}
      />
    )

    const TooltipIcon = (curr: IconOptions) =>
      curr.tooltip ? (
        <NTooltip>
          {{
            trigger: () => Icon(curr),
            default: () => t(curr.tooltip ?? ''),
          }}
        </NTooltip>
      ) : (
        Icon(curr)
      )

    return {
      leftIconOptions,
      rightIconOptions,
      t,
      handleIconClick,
      modelDrawerPlacement,
      showSettings,
      TooltipIcon,
      Icon,
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
                    curr.dropdown[curr.dropdown.eventKey ?? 'handleSelect']
                  }
                >
                  {this.Icon(curr)}
                </NDropdown>
              ) : (
                this.TooltipIcon(curr)
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
