import { useRuntimeActions, useRuntimeGetters } from '@/store'
import './index.scss'
import AppAvatar from '@/app-components/app/AppAvatar'
import { LOCAL_OPTIONS } from '@/app-config'
import { RIcon } from '@/components'
import { useDevice, useI18n } from '@/hooks'
import {
  useSettingActions,
  useSettingGetters,
  useSigningGetters,
} from '@/store'
import { NButton, NDropdown, NFlex, NLayoutHeader } from 'naive-ui'
import { useFullscreen } from 'vue-hooks-plus'
import {
  Breadcrumb,
  GlobalSearch,
  GlobalSearchButton,
  SettingDrawer,
  TooltipIcon,
} from './components'
import {
  avatarDropdownClick,
  createAvatarOptions,
  createLeftIconOptions,
  createRightIconOptions,
} from './shared'
import type { IconEventMapOptions } from './type'

export default defineComponent({
  name: 'AppSiderBar',
  setup() {
    // 获取 setting 相关值
    const { updateLocale, updateSettingState } = useSettingActions()
    const { t } = useI18n()
    // 获取全屏相关方法
    const [isFullscreen, { toggleFullscreen, isEnabled }] = useFullscreen(
      document.getElementsByTagName('html')[0],
    )
    // 获取设置相关方法
    const { getDrawerPlacement, getBreadcrumbSwitch } = useSettingGetters()
    // 是否显示设置抽屉
    const showSettings = ref(false)
    const accountMenuShown = ref(false)
    const { getSigningCallback } = useSigningGetters()
    // 是否展示全局搜索
    const globalSearchShown = ref(false)
    // 当前是否为平板或者更小的设备
    const { isTabletOrSmaller } = useDevice()
    // 获取全局 drawer 的值
    const globalDrawerValue = useRuntimeGetters().globalDrawerValue

    /**
     *
     * @description
     * 顶部左边操作栏。
     */
    const leftIconOptions = computed(() =>
      createLeftIconOptions({
        isFullscreen,
        isTabletOrSmaller,
      }),
    )
    /**
     *
     * @description
     * 顶部右边提示框操作栏。
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
        useRuntimeActions().setRuntimeState(
          'globalDrawerValue',
          !globalDrawerValue.value,
        )
      },
    }

    const toolIconClick = (key: keyof typeof iconEventMap) => {
      iconEventMap[key]?.()
    }

    return {
      t,
      isFullscreen,
      leftIconOptions,
      rightTooltipIconOptions,
      toolIconClick,
      showSettings,
      updateLocale,
      getDrawerPlacement,
      getBreadcrumbSwitch,
      globalSearchShown,
      isTabletOrSmaller,
      accountMenuShown,
      getSigningCallback,
    }
  },
  render() {
    const {
      rightTooltipIconOptions,
      leftIconOptions,
      getDrawerPlacement,
      getBreadcrumbSwitch,
    } = this
    const { toolIconClick, updateLocale } = this

    return (
      <NLayoutHeader class="layout-header">
        <GlobalSearch v-model:show={this.globalSearchShown} />
        <NFlex
          class="layout-header__method"
          align="center"
          justify="space-between"
          wrap={false}
        >
          <NFlex
            class="layout-header__navigation"
            align="center"
            size={this.isTabletOrSmaller ? 4 : 12}
            wrap={false}
          >
            {leftIconOptions.map((curr) => (
              <NButton
                quaternary
                class="layout-header__menu-toggle"
                key={curr.name}
                aria-label={this.t<string>('layout.toggleMenu')}
                onClick={toolIconClick.bind(this, curr.eventKey ?? curr.name)}
              >
                <TooltipIcon
                  iconName={curr.name}
                  tooltipText={
                    isRef(curr.tooltip) ? curr.tooltip.value : curr.tooltip
                  }
                  customClassName={curr.iconClass}
                />
              </NButton>
            ))}
            {getBreadcrumbSwitch ? <Breadcrumb /> : null}
          </NFlex>
          <NFlex
            class="layout-header__actions"
            justify="end"
            align="center"
            size={[4, 0]}
            wrap={false}
          >
            {this.isTabletOrSmaller ? (
              <NButton
                quaternary
                class="override-button__layout"
                aria-label={this.t<string>('headerTooltip.Search')}
                onClick={() => {
                  this.globalSearchShown = true
                }}
              >
                <RIcon name="action/search" size={20} />
              </NButton>
            ) : (
              <GlobalSearchButton
                onClick={(e) => {
                  e.stopPropagation()

                  this.globalSearchShown = true
                }}
              />
            )}
            {rightTooltipIconOptions.map((curr) => (
              <NButton
                class="override-button__layout"
                quaternary
                size="medium"
                key={curr.eventKey ?? curr.name}
                aria-label={this.t<string>(
                  curr.eventKey === 'setting'
                    ? 'headerTooltip.Setting'
                    : curr.eventKey === 'github'
                      ? 'headerTooltip.Github'
                      : this.isFullscreen
                        ? 'headerTooltip.CancelFullScreen'
                        : 'headerTooltip.FullScreen',
                )}
                onClick={toolIconClick.bind(this, curr.eventKey ?? curr.name)}
              >
                <RIcon name={curr.name} size={20} />
              </NButton>
            ))}
            <NDropdown
              options={LOCAL_OPTIONS}
              onSelect={(key: string | number) => updateLocale(String(key))}
              trigger="click"
            >
              <NButton
                quaternary
                aria-label={this.t<string>('layout.language')}
                class="override-button__layout"
              >
                <RIcon name="system/language" size={20} />
              </NButton>
            </NDropdown>
            <NDropdown
              class="layout-account-menu"
              placement="bottom-end"
              show={this.accountMenuShown}
              onUpdateShow={(show) => {
                this.accountMenuShown = show
              }}
              options={[
                {
                  key: 'identity',
                  type: 'render',
                  render: () => (
                    <div class="layout-account-menu__identity">
                      <span>{this.t('account.eyebrow')}</span>
                      <strong>{this.getSigningCallback.name}</strong>
                    </div>
                  ),
                },
                { key: 'identity-divider', type: 'divider' },
                ...createAvatarOptions(this.t),
              ]}
              onSelect={(key) => void avatarDropdownClick(key)}
              trigger="click"
            >
              <AppAvatar
                avatarSize={30}
                cursor="pointer"
                aria-label={this.t<string>('account.menu', {
                  name: this.getSigningCallback.name,
                })}
                aria-haspopup="menu"
                aria-expanded={this.accountMenuShown}
                spaceSize={[8, 0]}
                class={[
                  'layout-header__account',
                  { 'is-open': this.accountMenuShown },
                ]}
              >
                {{
                  suffix: () => (
                    <RIcon
                      class="layout-header__account-chevron"
                      name="directional/expanded"
                      size={14}
                    />
                  ),
                }}
              </AppAvatar>
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
