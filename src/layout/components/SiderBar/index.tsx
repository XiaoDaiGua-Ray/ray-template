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

import { NLayoutHeader, NSpace, NTooltip, NDropdown, NTag } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'
import RayTooltipIcon from '@/components/RayTooltipIcon/index'
import SettingDrawer from './components/SettingDrawer/index'
import Breadcrumb from './components/Breadcrumb/index'
import GlobalSeach from './components/GlobalSeach/index'
import LockScreen from './components/LockScreen/index'

import { useSetting, useSignin } from '@/store'
import { localOptions } from '@/locales/index'
import { useAvatarOptions } from './hook'
import { getCache } from '@/utils/cache'
import screenfull from 'screenfull'
import { useI18n } from '@/locales/useI18n'

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
    const signinStore = useSignin()

    const { t } = useI18n()
    const { updateLocale, changeSwitcher } = settingStore
    const { logout } = signinStore

    const { drawerPlacement, breadcrumbSwitch } = storeToRefs(settingStore)
    const showSettings = ref(false)
    const person = getCache('person')
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
        name: 'lock',
        size: 18,
        tooltip: t('headerTooltip.Lock'),
        eventKey: 'lock',
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

    const handlePersonSelect = (key: string | number) => {
      if (key === 'logout') {
        window.$dialog.warning({
          title: '提示',
          content: '您确定要退出登录吗',
          positiveText: '确定',
          negativeText: '不确定',
          onPositiveClick: () => {
            logout()
          },
        })
      } else {
        window.$message.info('这个人很懒, 没做这个功能~')
      }
    }

    return {
      leftIconOptions,
      rightTooltipIconOptions,
      t,
      handleIconClick,
      showSettings,
      updateLocale,
      handlePersonSelect,
      person,
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
        {/* <LockScreen /> */}
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
              options={localOptions}
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
              onSelect={this.handlePersonSelect.bind(this)}
              trigger="click"
            >
              <NTag checkable size="large">
                {{
                  icon: () => (
                    <RayIcon
                      customClassName="layout-header__method--icon"
                      name="ray"
                      size="18"
                    />
                  ),
                  default: () => this.person.name,
                }}
              </NTag>
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
