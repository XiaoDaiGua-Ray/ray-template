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

import './index.scss'

import { NLayoutHeader, NSpace, NTooltip, NDropdown } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'
import RayTooltipIcon from '@/components/RayTooltipIcon/index'
import SettingDrawer from './components/SettingDrawer/index'
import Breadcrumb from './components/Breadcrumb/index'
import GlobalSeach from './components/GlobalSeach/index'
import AppAvatar from '@/components/AppComponents/AppAvatar/index'

import { useSetting } from '@/store'
import { LOCAL_OPTIONS } from '@/appConfig/localConfig'
import { useAvatarOptions, avatarDropdownClick } from './hook'
import { getCache } from '@/utils/cache'
import screenfull from 'screenfull'
import { useI18n } from '@/locales/useI18n'
import { APP_CATCH_KEY } from '@/appConfig/appConfig'

import type { IconEventMapOptions, IconEventMap } from './type'

/**
 *
 * 本来想通过写数据配置化的方式实现顶部的功能小按钮, 结果事实发现...
 *
 * 但是我又不想改, 就这样吧
 */

const SiderBar = defineComponent({
  name: 'SiderBar',
  setup() {
    const settingStore = useSetting()

    const { t } = useI18n()
    const { updateLocale, changeSwitcher } = settingStore

    const { drawerPlacement, breadcrumbSwitch } = storeToRefs(settingStore)
    const showSettings = ref(false)
    const signin = getCache(APP_CATCH_KEY.signin)
    const spaceItemStyle = {
      display: 'flex',
    }
    const globalSearchShown = ref(false)

    /**
     *
     * 顶部左边操作栏
     */
    const leftIconOptions = computed(() => [
      {
        name: 'reload',
        size: 18,
        tooltip: t('headerTooltip.Reload'),
      },
    ])
    /**
     *
     * 顶部右边提示框操作栏
     */
    const rightTooltipIconOptions = computed(() => [
      {
        name: 'search',
        size: 18,
        tooltip: t('headerTooltip.Search'),
        eventKey: 'search',
      },
      {
        name: 'fullscreen',
        size: 18,
        tooltip: t('headerTooltip.FullScreen'),
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
    ])
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
      search: () => {
        globalSearchShown.value = true
      },
      lock: () => {
        changeSwitcher(true, 'lockScreenSwitch')
      },
    }

    const handleIconClick = (key: IconEventMap) => {
      iconEventMap[key]?.()
    }

    // expose({})

    return {
      leftIconOptions,
      rightTooltipIconOptions,
      t,
      handleIconClick,
      showSettings,
      updateLocale,
      signin,
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
                  default: () => curr.tooltip,
                }}
              </NTooltip>
            ))}
            {this.breadcrumbSwitch ? <Breadcrumb /> : ''}
          </NSpace>
          <NSpace
            align="center"
            wrapItem={false}
            itemStyle={this.spaceItemStyle}
          >
            {this.rightTooltipIconOptions.map((curr) => (
              <RayTooltipIcon
                iconName={curr.name}
                tooltipText={curr.tooltip}
                onClick={this.handleIconClick.bind(this, curr.name)}
              />
            ))}
            <NDropdown
              options={LOCAL_OPTIONS}
              onSelect={(key: string | number) =>
                this.updateLocale(String(key))
              }
              trigger="click"
            >
              <RayIcon
                customClassName="layout-header__method--icon"
                name="language"
                size="18"
              />
            </NDropdown>
            <NDropdown
              options={useAvatarOptions()}
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

export default SiderBar
