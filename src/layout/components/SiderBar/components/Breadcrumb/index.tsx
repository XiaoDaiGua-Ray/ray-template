/**
 *
 * 顶部面包屑
 *
 * 如果下拉菜单条目小于一条, 则不会触发下拉菜单
 *
 * 添加 <span> 标签, 避免 Runtime directive used on component... 警告
 */

import './index.scss'

import { NDropdown, NBreadcrumb, NBreadcrumbItem } from 'naive-ui'
import { TransitionGroup } from 'vue'

import { useMenuGetters, useMenuActions } from '@/store'
import { useDevice } from '@/hooks'

import type { DropdownOption } from 'naive-ui'
import type { AppMenuOption } from '@/types'

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
      <div style="display: none;"></div>
    ) : (
      <NBreadcrumb>
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
