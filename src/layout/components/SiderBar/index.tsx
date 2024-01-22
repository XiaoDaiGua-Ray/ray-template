/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-01-04
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 本来想通过写数据配置化的方式实现顶部的功能小按钮, 结果事实发现...
 * 但是我又不想改, 就这样吧
 *
 * 如果你希望自己 diy 一些东西，可以自己使用 computed 实现
 */

import './index.scss'

import { NLayoutHeader, NFlex, NDropdown } from 'naive-ui'
import { RIcon } from '@/components'
import TooltipIcon from '@/layout/components/SiderBar/components/TooltipIcon'
import SettingDrawer from './components/SettingDrawer'
import Breadcrumb from './components/Breadcrumb'
import GlobalSearch from './components/GlobalSearch'
import AppAvatar from '@/app-components/app/AppAvatar'

import { LOCAL_OPTIONS } from '@/app-config'
import {
  createAvatarOptions,
  avatarDropdownClick,
  createLeftIconOptions,
  createRightIconOptions,
} from './shared'
import { useDevice, useI18n } from '@/hooks'
import { getVariableToRefs, setVariable } from '@/global-variable'
import { useFullscreen } from 'vue-hooks-plus'
import { useSettingGetters, useSettingActions } from '@/store'

import type { IconEventMapOptions, IconEventMap } from './type'

export default defineComponent({
  name: 'AppSiderBar',
  setup() {
    const { updateLocale, updateSettingState } = useSettingActions()
    const { t } = useI18n()

    const [isFullscreen, { toggleFullscreen, isEnabled }] = useFullscreen(
      document.getElementsByTagName('html')[0],
    )
    const { getDrawerPlacement, getBreadcrumbSwitch } = useSettingGetters()
    const showSettings = ref(false) // 是否显示设置抽屉
    const globalSearchShown = ref(false) // 是否展示全局搜索
    const { isTabletOrSmaller } = useDevice()
    const globalDrawerValue = getVariableToRefs('globalDrawerValue')

    /**
     *
     * 顶部左边操作栏
     */
    const leftIconOptions = computed(() =>
      createLeftIconOptions({
        isFullscreen,
        isTabletOrSmaller,
      }),
    )
    /**
     *
     * 顶部右边提示框操作栏
     */
    const rightTooltipIconOptions = computed(() =>
      createRightIconOptions({
        isFullscreen,
        isTabletOrSmaller,
      }),
    )
    const iconEventMap: IconEventMapOptions = {
      setting: () => {
        showSettings.value = true
      },
      github: () => {
        window.open('https://github.com/XiaoDaiGua-Ray/ray-template')
      },
      fullscreen: () => {
        if (!isEnabled) {
          window.$message.warning(t('globalMessage.isEnabledFullscreen'))
        }

        toggleFullscreen()
      },
      search: () => {
        globalSearchShown.value = true
      },
      lock: () => {
        updateSettingState('lockScreenSwitch', true)
      },
      menu: () => {
        setVariable('globalDrawerValue', !globalDrawerValue.value)
      },
    }

    const toolIconClick = (key: keyof typeof iconEventMap) => {
      iconEventMap[key]?.()
    }

    return {
      leftIconOptions,
      rightTooltipIconOptions,
      toolIconClick,
      showSettings,
      updateLocale,
      getDrawerPlacement,
      getBreadcrumbSwitch,
      globalSearchShown,
    }
  },
  render() {
    return (
      <NLayoutHeader class="layout-header" bordered>
        <GlobalSearch v-model:show={this.globalSearchShown} />
        <NFlex
          class="layout-header__method"
          align="center"
          justify="space-between"
        >
          <NFlex align="center">
            {this.leftIconOptions.map((curr) => (
              <TooltipIcon
                key={curr.name}
                iconName={curr.name}
                tooltipText={
                  isRef(curr.tooltip) ? curr.tooltip.value : curr.tooltip
                }
                customClassName={curr.iconClass}
                onClick={this.toolIconClick.bind(this, curr.name)}
              />
            ))}
            {this.getBreadcrumbSwitch ? <Breadcrumb /> : null}
          </NFlex>
          <NFlex align="center">
            {this.rightTooltipIconOptions.map((curr) => (
              <TooltipIcon
                key={curr.name}
                iconName={curr.name}
                tooltipText={
                  isRef(curr.tooltip) ? curr.tooltip.value : curr.tooltip
                }
                customClassName={curr.iconClass}
                onClick={this.toolIconClick.bind(this, curr.name)}
              />
            ))}
            <NDropdown
              options={LOCAL_OPTIONS}
              onSelect={(key: string | number) =>
                this.updateLocale(String(key))
              }
              trigger="click"
            >
              <RIcon
                customClassName="layout-header__method--icon"
                name="language"
                size="18"
                cursor="pointer"
              />
            </NDropdown>
            <NDropdown
              options={createAvatarOptions()}
              onSelect={avatarDropdownClick.bind(this)}
              trigger="click"
            >
              <AppAvatar avatarSize="small" align="center" cursor="pointer" />
            </NDropdown>
          </NFlex>
        </NFlex>
        <SettingDrawer
          v-model:show={this.showSettings}
          placement={this.getDrawerPlacement}
        />
      </NLayoutHeader>
    )
  },
})
