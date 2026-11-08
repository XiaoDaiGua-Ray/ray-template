import './index.scss'
import { useDevice } from '@/hooks'
import { useMenuActions, useMenuGetters } from '@/store'
import type { AppMenuOption } from '@/types'
import { NBreadcrumb, NBreadcrumbItem, NDropdown } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'
import { TransitionGroup } from 'vue'

export default defineComponent({
  name: 'SiderBarBreadcrumb',
  setup() {
    const { changeMenuModelValue } = useMenuActions()
    const { getBreadcrumbOptions } = useMenuGetters()
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

    return {
      getBreadcrumbOptions,
      dropdownSelect,
      breadcrumbItemClick,
      isTabletOrSmaller,
    }
  },
  render() {
    const { isTabletOrSmaller, getBreadcrumbOptions } = this
    const { dropdownSelect, breadcrumbItemClick } = this

    return isTabletOrSmaller ? (
      <span class="layout-breadcrumb__current" aria-current="page">
        {getBreadcrumbOptions.at(-1)?.breadcrumbLabel}
      </span>
    ) : (
      <NBreadcrumb class="layout-breadcrumb">
        <TransitionGroup tag="li" name="breadcrumb" appear>
          {getBreadcrumbOptions.map((curr) => (
            <NBreadcrumbItem
              key={curr.fullPath}
              onClick={breadcrumbItemClick.bind(this, curr)}
            >
              <NDropdown
                labelField="breadcrumbLabel"
                keyField="fullPath"
                options={
                  curr.children && curr.children?.length > 1
                    ? curr.children
                    : []
                }
                onSelect={dropdownSelect.bind(this)}
              >
                {{
                  default: () => (
                    <span>
                      {curr.label && typeof curr.label === 'function'
                        ? curr.label()
                        : curr.breadcrumbLabel}
                    </span>
                  ),
                }}
              </NDropdown>
            </NBreadcrumbItem>
          ))}
        </TransitionGroup>
      </NBreadcrumb>
    )
  },
})
