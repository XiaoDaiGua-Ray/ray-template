/**
 *
 * 本来想通过写数据配置化的方式实现顶部的功能小按钮, 结果事实发现...
 * 但是我又不想改, 就这样吧
 *
 * 如果你希望自己 diy 一些东西，可以自己使用 computed 实现
 */

import './index.scss'

import { NLayoutHeader, NFlex, NDropdown, NButton, NScrollbar } from 'naive-ui'
import { RIcon } from '@/components'
import {
  TooltipIcon,
  SettingDrawer,
  Breadcrumb,
  GlobalSearch,
  GlobalSearchButton,
} from './components'
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

import type { IconEventMapOptions } from './type'
import type { VNode } from 'vue'

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
      search: () => {
        globalSearchShown.value = true
      },
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

    /**
     *
     * @param vnode 需要渲染的节点
     * @returns 如果是平板或者更小的设备, 就返回 null, 否则返回 vnode
     */
    const isRenderVNode = (vnode: VNode) => {
      return isTabletOrSmaller.value ? null : vnode
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
      isRenderVNode,
    }
  },
  render() {
    const {
      rightTooltipIconOptions,
      leftIconOptions,
      getDrawerPlacement,
      getBreadcrumbSwitch,
    } = this
    const { toolIconClick, updateLocale, isRenderVNode } = this

    return (
      <NLayoutHeader class="layout-header">
        <GlobalSearch v-model:show={this.globalSearchShown} />
        <NFlex
          class="layout-header__method"
          align="center"
          justify="space-between"
          wrap={false}
        >
          <NFlex align="center" wrap={false}>
            {leftIconOptions.map((curr) => (
              <TooltipIcon
                key={curr.name}
                iconName={curr.name}
                tooltipText={
                  isRef(curr.tooltip) ? curr.tooltip.value : curr.tooltip
                }
                customClassName={curr.iconClass}
                onClick={toolIconClick.bind(this, curr.name)}
              />
            ))}
            {getBreadcrumbSwitch ? <Breadcrumb /> : null}
          </NFlex>
          <NFlex justify="end" align="center" size={[4, 0]} wrap={false}>
            {isRenderVNode(
              <GlobalSearchButton
                onClick={(e) => {
                  e.stopPropagation()

                  this.globalSearchShown = true
                }}
              />,
            )}
            {rightTooltipIconOptions.map((curr) => (
              <NButton
                class="override-button__layout"
                quaternary
                size="medium"
                key={curr.name}
                onClick={toolIconClick.bind(this, curr.name)}
              >
                <RIcon name={curr.name} size={18} cursor="pointer" />
              </NButton>
            ))}
            <NDropdown
              options={LOCAL_OPTIONS}
              onSelect={(key: string | number) => updateLocale(String(key))}
              trigger="click"
            >
              <NButton quaternary class="override-button__layout">
                <RIcon
                  customClassName="layout-header__method--icon"
                  name="language"
                  size="18"
                  cursor="pointer"
                />
              </NButton>
            </NDropdown>
            <NDropdown
              options={createAvatarOptions()}
              onSelect={avatarDropdownClick.bind(this)}
              trigger="click"
            >
              <AppAvatar
                avatarSize={24}
                spaceSize={[8, 0]}
                class="override-button__layout"
              />
            </NDropdown>
          </NFlex>
        </NFlex>
        <SettingDrawer
          v-model:show={this.showSettings}
          placement={getDrawerPlacement}
        />
      </NLayoutHeader>
    )
  },
})
