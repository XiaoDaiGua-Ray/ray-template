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
import Fullscreen from './components/Fullscreen'
import C from './components/C'
import Print from './components/Print'

import props from './props'
import { call, renderNode, uuid } from '@/utils'
import config from './config'

import type { DropdownOption, DataTableInst } from 'naive-ui'
import type { ComponentSize } from '@/types'
import type { C as CType } from './type'

export default defineComponent({
  name: 'RTable',
  props,
  setup(props, ctx) {
    const { expose } = ctx

    const rTableInst = ref<DataTableInst>()
    const wrapperRef = ref<HTMLElement>()

    const uuidWrapper = uuid(16) // wrapper id
    const uuidTable = uuid(16) // table id
    /**
     *
     * x: 横坐标
     * y: 纵坐标
     * showContextMenu: 是否显示右键菜单
     */
    const contextMenuReactive = reactive({
      x: 0,
      y: 0,
      showContextMenu: false,
    })
    /**
     *
     * size: table size，内部私有状态管理
     */
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
    const combineRowProps = (row: Record<string, unknown>, idx: number) => {
      const interceptRowProps = props.rowProps?.(row, idx)

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

    /**
     *
     * @param size table size
     *
     * 修改 table size
     */
    const changeTableSize = (size: ComponentSize) => {
      privateReactive.size = size
    }

    /**
     *
     * @param options table columns
     *
     * 更新 table columns，同时触发 onUpdateColumns 和 onUpdate:columns 事件
     */
    const updateTableColumn = (options: CType[]) => {
      const { onUpdateColumns, 'onUpdate:columns': $onUpdateColumns } = props

      if (onUpdateColumns) {
        call(onUpdateColumns, options)
      }
      if ($onUpdateColumns) {
        call($onUpdateColumns, options)
      }
    }

    /**
     *
     * 处理自定义的 toolOptions
     * 匹配所有符合条件的 toolOptions，然后执行
     */
    const renderToolOptions = () => {
      const { toolOptions } = props

      return toolOptions
        ?.filter(() => Boolean)
        .map((curr) => (typeof curr === 'function' ? curr() : curr))
    }

    /**
     *
     * @param p props
     *
     * 处理 toolOptions，合并渲染所有的 toolOptions
     */
    const tool = (p: typeof props) => {
      const renderDefaultToolOptions = () => (
        <>
          <Print {...p} />
          <Size {...p} onChangeSize={changeTableSize.bind(this)} />
          <Fullscreen />
          <C {...p} onUpdateColumn={updateTableColumn.bind(this)} />
        </>
      )

      if (!props.toolOptions) {
        return renderDefaultToolOptions
      } else {
        if (props.coverTool) {
          return renderToolOptions
        } else {
          return () => (
            <>
              {renderDefaultToolOptions()}
              {renderToolOptions()}
            </>
          )
        }
      }
    }

    provide(config.tableKey, {
      uuidTable,
      uuidWrapper,
      wrapperRef,
    })
    expose({
      rTableInst,
      uuidTable,
      uuidWrapper,
    })

    return {
      uuidWrapper,
      uuidTable,
      contextMenuReactive,
      rTableInst,
      combineRowProps,
      contextMenuSelect,
      privateReactive,
      tool,
      wrapperRef,
    }
  },
  render() {
    const { tool } = this

    return (
      <NCard
        ref="wrapperRef"
        bordered={this.wrapperBordered}
        {...{ id: this.uuidWrapper }}
      >
        {{
          default: () => (
            <>
              <NDataTable
                ref="rTableInst"
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
          header: renderNode(this.title, {
            defaultElement: <div style="display: none;"></div>,
          }),
          'header-extra': () => (
            <NSpace align="center">
              {/* eslint-disable @typescript-eslint/no-explicit-any */}
              {tool(this.$props as any)}
            </NSpace>
          ),
          footer: () => this.$slots.tableFooter?.(),
          action: () => this.$slots.tableAction?.(),
        }}
      </NCard>
    )
  },
})
