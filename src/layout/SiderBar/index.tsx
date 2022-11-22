import './index.scss'
import { NLayoutHeader, NSpace, NTooltip, NDropdown } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'
import { useMenu, useSetting } from '@/store'
import { useLanguageOptions } from '@/language/index'
import SettingDrawer from './Components/SettingDrawer/index'

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
      // {
      //   name: 'lock',
      //   size: 18,
      //   tooltip: 'LayoutHeaderTooltipOptions.Lock',
      // },
      {
        name: 'setting',
        size: 18,
        tooltip: 'LayoutHeaderTooltipOptions.Setting',
      },
    ]
    const iconEventMap: IconEventMapOptions = {
      reload: () => {
        changeReloadLog(false)

        setTimeout(() => changeReloadLog(true))
      },
      // lock: () => {},
      setting: () => {
        showSettings.value = true
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
