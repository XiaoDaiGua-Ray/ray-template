import './index.scss'
import { useDevice } from '@/hooks'
import { useMenuActions, useMenuGetters, useSettingGetters } from '@/store'
import type { AppMenuOption } from '@/types'
import { RIcon } from '@ray-template/ui/icon'
import { NBreadcrumb, NBreadcrumbItem, NDropdown } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'
import { TransitionGroup } from 'vue'

export default defineComponent({
  name: 'SiderBarBreadcrumb',
  setup() {
    const { changeMenuModelValue } = useMenuActions()
    const { getBreadcrumbOptions } = useMenuGetters()
    const { getBreadcrumbIcon, getBreadcrumbIconFallback } = useSettingGetters()
    const { isTabletOrSmaller } = useDevice()

    const dropdownSelect = (key: string | number, option: DropdownOption) => {
      changeMenuModelValue(key, option as unknown as AppMenuOption)
    }

    /**
     *
     * @param option bread option
     *
     * 点击面包屑，如果包含子集，则允许点击更新页面
     */
    const breadcrumbItemClick = (option: AppMenuOption) => {
      if (!option.children?.length) {
        const { meta = {} } = option

        if (!meta.sameLevel) {
          changeMenuModelValue(option.fullPath, option)
        }
      }
    }

    const renderIcon = (option: Pick<AppMenuOption, 'icon'>) => {
      if (!getBreadcrumbIcon.value) return null

      const icon =
        option.icon?.() ??
        (getBreadcrumbIconFallback.value ? (
          <RIcon name="navigation/window" size="1em" />
        ) : null)

      return (
        icon && (
          <span class="layout-breadcrumb__icon" aria-hidden="true">
            {icon}
          </span>
        )
      )
    }

    const renderLabel = (
      option: AppMenuOption,
      current: boolean,
      compact = false,
    ) => (
      <span
        class={[
          'layout-breadcrumb__item',
          { 'layout-breadcrumb__current': compact },
        ]}
        aria-current={current ? 'page' : void 0}
      >
        {renderIcon(option)}
        <span class="layout-breadcrumb__label">
          {!compact && typeof option.label === 'function'
            ? option.label()
            : option.breadcrumbLabel}
        </span>
      </span>
    )

    return () => {
      const trail = getBreadcrumbOptions.value
      const current = trail.at(-1)

      if (isTabletOrSmaller.value)
        return current && renderLabel(current, true, true)

      return (
        <NBreadcrumb class="layout-breadcrumb">
          <TransitionGroup name="breadcrumb" appear>
            {trail.map((option) => (
              <NBreadcrumbItem
                key={option.fullPath}
                onClick={() => breadcrumbItemClick(option)}
              >
                {option.children && option.children.length > 1 ? (
                  <NDropdown
                    labelField="breadcrumbLabel"
                    keyField="fullPath"
                    options={option.children}
                    renderIcon={renderIcon}
                    onSelect={dropdownSelect}
                  >
                    {renderLabel(option, option === current)}
                  </NDropdown>
                ) : (
                  renderLabel(option, option === current)
                )}
              </NBreadcrumbItem>
            ))}
          </TransitionGroup>
        </NBreadcrumb>
      )
    }
  },
})
