import './index.scss'

import { NLayoutHeader, NSpace, NTooltip, NDropdown } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'
import RayTooltipIcon from '@/components/RayTooltipIcon/index'
import SettingDrawer from './components/SettingDrawer/index'

import { useSetting } from '@/store'
import { useLanguageOptions } from '@/language/index'
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

    /**
     *
     * 顶部左边操作栏
     */
    const leftIconOptions = [
      {
        name: 'reload',
        size: 18,
        tooltip: 'LayoutHeaderTooltipOptions.Reload',
      },
    ]
    /**
     *
     * 顶部右边提示框操作栏
     */
    const rightTooltipIconOptions = [
      {
        name: 'fullscreen',
        size: 18,
        tooltip: 'LayoutHeaderTooltipOptions.FullScreen',
        eventKey: 'screen',
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
    ]
    /**
     *
     * 顶部右边下拉框操作栏
     */
    const rightDropdownIconOptions = [
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
        name: 'ray',
        size: 18,
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
      fullscreen: () => {
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

    return {
      leftIconOptions,
      rightTooltipIconOptions,
      t,
      handleIconClick,
      modelDrawerPlacement,
      showSettings,
      rightDropdownIconOptions,
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
            {this.rightTooltipIconOptions.map((curr) => (
              <RayTooltipIcon
                iconName={curr.name}
                tooltipText={this.t(curr.tooltip)}
                onClick={this.handleIconClick.bind(this, curr.name)}
              />
            ))}
            {this.rightDropdownIconOptions.map((curr) => (
              <NDropdown
                options={curr.dropdown.options}
                onSelect={
                  curr.dropdown[curr.dropdown.eventKey ?? 'handleSelect']
                }
              >
                <RayIcon
                  customClassName="layout-header__method--icon"
                  name={curr.name}
                  size={curr.size}
                />
              </NDropdown>
            ))}
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
