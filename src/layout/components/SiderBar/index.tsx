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

import { NLayoutHeader, NSpace, NDropdown } from 'naive-ui'
import RIcon from '@/components/RIcon/index'
import TootipIcon from '@/layout/components/SiderBar/components/TooltipIcon/index'
import SettingDrawer from './components/SettingDrawer/index'
import Breadcrumb from './components/Breadcrumb/index'
import GlobalSeach from './components/GlobalSeach/index'
import AppAvatar from '@/app-components/app/AppAvatar/index'

import { useSetting } from '@/store'
import { LOCAL_OPTIONS } from '@/app-config/localConfig'
import {
  createAvatarOptions,
  avatarDropdownClick,
  createLeftIconOptions,
  createRightIconOptions,
} from './hook'
import { useDevice } from '@/hooks/web/index'
import { globalVariableToRefs, setVariable } from '@/hooks/variable/index'
import { useFullscreen } from 'vue-hooks-plus'
import { useI18n } from '@/hooks/web/index'

import type { IconEventMapOptions, IconEventMap } from './type'

export default defineComponent({
  name: 'AppSiderBar',
  setup() {
    const settingStore = useSetting()

    const { updateLocale, changeSwitcher } = settingStore
    const { t } = useI18n()

    const [isFullscreen, { toggleFullscreen, isEnabled }] = useFullscreen(
      document.getElementsByTagName('html')[0],
    )
    const { drawerPlacement, breadcrumbSwitch, reloadRouteSwitch } =
      storeToRefs(settingStore)
    const showSettings = ref(false)
    const spaceItemStyle = {
      display: 'flex',
    }
    const globalSearchShown = ref(false)
    const { isTabletOrSmaller } = useDevice()
    const globalDrawerValue = globalVariableToRefs('globalDrawerValue')

    /**
     *
     * 顶部左边操作栏
     */
    const leftIconOptions = computed(() =>
      createLeftIconOptions({
        isFullscreen,
        isTabletOrSmaller,
        reloadRouteSwitch,
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
        reloadRouteSwitch,
      }),
    )
    const iconEventMap: IconEventMapOptions = {
      // 刷新组件重新加载，手动设置 800ms loading 时长
      reload: () => {
        changeSwitcher(false, 'reloadRouteSwitch')

        setTimeout(() => changeSwitcher(true, 'reloadRouteSwitch'), 800)
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
      search: () => {
        globalSearchShown.value = true
      },
      lock: () => {
        changeSwitcher(true, 'lockScreenSwitch')
      },
      menu: () => {
        setVariable('globalDrawerValue', !globalDrawerValue.value)
      },
    }

    const toolIconClick = (key: IconEventMap) => {
      iconEventMap[key]?.()
    }

    return {
      leftIconOptions,
      rightTooltipIconOptions,
      toolIconClick,
      showSettings,
      updateLocale,
      spaceItemStyle,
      drawerPlacement,
      breadcrumbSwitch,
      globalSearchShown,
    }
  },
  render() {
    return (
      <NLayoutHeader class="layout-header" bordered>
        <GlobalSeach v-model:show={this.globalSearchShown} />
        <NSpace
          class="layout-header__method"
          align="center"
          justify="space-between"
        >
          <NSpace
            align="center"
            wrapItem={false}
            itemStyle={this.spaceItemStyle}
          >
            {this.leftIconOptions.map((curr) => (
              <TootipIcon
                iconName={curr.name}
                tooltipText={
                  isRef(curr.tooltip) ? curr.tooltip.value : curr.tooltip
                }
                customClassName={curr.iconClass}
                onClick={this.toolIconClick.bind(this, curr.name)}
              />
            ))}
            {this.breadcrumbSwitch ? <Breadcrumb /> : null}
          </NSpace>
          <NSpace
            align="center"
            wrapItem={false}
            itemStyle={this.spaceItemStyle}
          >
            {this.rightTooltipIconOptions.map((curr) => (
              <TootipIcon
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
          </NSpace>
        </NSpace>
        <SettingDrawer
          v-model:show={this.showSettings}
          placement={this.drawerPlacement}
        />
      </NLayoutHeader>
    )
  },
})
