/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-10-04
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import { NCard, NDataTable, NDropdown, NSpace } from 'naive-ui'
import Size from './components/Size'
import Screenfull from './components/Screenfull'
import C from './components/C'
import Print from './components/Print'

import props from './props'
import { call } from '@/utils/vue/index'
import { uuid } from '@use-utils/hook'

import type { DropdownOption, DataTableInst } from 'naive-ui'
import type { ComponentSize } from '@/types/modules/component'
import type { C as CType } from './type'

export default defineComponent({
  name: 'RTable',
  props,
  setup(props, ctx) {
    const { expose } = ctx

    const rTableInstance = ref<DataTableInst | null>(null)

    const uuidWrapper = uuid(16)
    const uuidTable = uuid(16)
    const contextMenuReactive = reactive({
      x: 0,
      y: 0,
      showContextMenu: false,
    })
    const privateReactive = reactive({
      size: props.size,
    })

    /**
     *
     * @param key key
     * @param option context menu select  option
     */
    const contextMenuSelect = (
      key: number | string,
      option: DropdownOption,
    ) => {
      const { onContextMenuClick } = props

      if (onContextMenuClick) {
        call(onContextMenuClick, key, option)
      }

      contextMenuReactive.showContextMenu = false
    }

    /**
     *
     * 合并 RTable 的所有 rowProps
     * 如果开启了右键菜单功能，自动会拦截右键事件
     */
    const combineRowProps = (arr: Record<string, unknown>, idx: number) => {
      const interceptRowProps = props.rowProps?.(arr, idx)

      return {
        ...interceptRowProps,
        onContextmenu: props.disabledContextMenu
          ? void 0
          : (e: MouseEvent) => {
              e.preventDefault()

              contextMenuReactive.showContextMenu = false

              nextTick().then(() => {
                contextMenuReactive.showContextMenu = true
                contextMenuReactive.x = e.clientX
                contextMenuReactive.y = e.clientY
              })
            },
      }
    }

    const changeTableSize = (size: ComponentSize) => {
      privateReactive.size = size
    }

    const updateTableColumn = (options: CType[]) => {
      const { onUpdateColumns, 'onUpdate:columns': $onUpdateColumns } = props

      if (onUpdateColumns) {
        call(onUpdateColumns, options)
      }
      if ($onUpdateColumns) {
        call($onUpdateColumns, options)
      }
    }

    provide('tableProvider', {
      uuidTable,
      uuidWrapper,
    })
    expose({
      rTableInstance,
    })

    return {
      uuidWrapper,
      uuidTable,
      contextMenuReactive,
      rTableInstance,
      combineRowProps,
      contextMenuSelect,
      changeTableSize,
      privateReactive,
      updateTableColumn,
    }
  },
  render() {
    return (
      <NCard
        class="ray-table"
        bordered={this.wrapperBordered}
        {...{ id: this.uuidWrapper }}
      >
        {{
          default: () => (
            <>
              <NDataTable
                ref="rTableInstance"
                {...{ id: this.uuidTable }}
                {...this.$props}
                {...this.$attrs}
                rowProps={this.combineRowProps.bind(this)}
                size={this.privateReactive.size}
              >
                {{
                  ...this.$slots,
                }}
              </NDataTable>
              {!this.disabledContextMenu ? (
                <NDropdown
                  show={this.contextMenuReactive.showContextMenu}
                  placement="bottom-start"
                  trigger="manual"
                  x={this.contextMenuReactive.x}
                  y={this.contextMenuReactive.y}
                  options={this.contextMenuOptions}
                  onClickoutside={() =>
                    (this.contextMenuReactive.showContextMenu = false)
                  }
                  onSelect={this.contextMenuSelect.bind(this)}
                />
              ) : null}
            </>
          ),
          header: () => this.title || <div style="display: none;"></div>,
          'header-extra': () => (
            <NSpace wrapItem={false} align="center">
              <Print {...this.$props} />
              <Size
                {...this.$props}
                onChangeSize={this.changeTableSize.bind(this)}
              />
              <Screenfull />
              <C
                {...this.$props}
                onUpdateColumn={this.updateTableColumn.bind(this)}
              />
            </NSpace>
          ),
          footer: () => this.$slots.tableFooter?.(),
        }}
      </NCard>
    )
  },
})
