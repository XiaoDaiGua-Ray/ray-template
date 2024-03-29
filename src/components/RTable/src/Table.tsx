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

import { NCard, NDataTable, NDropdown, NFlex } from 'naive-ui'
import Size from './components/Size'
import Fullscreen from './components/Fullscreen'
import C from './components/C'
import Print from './components/Print'
import TablePropsSelect from './components/Props'

import props from './props'
import { call, renderNode, uuid } from '@/utils'
import { config } from './shared'

import type { DropdownOption, DataTableInst } from 'naive-ui'
import type { ComponentSize } from '@/types'
import type { C as CType, PropsComponentPopselectKeys } from './types'

export default defineComponent({
  name: 'RTable',
  props,
  setup(props, ctx) {
    const { expose, emit } = ctx

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
    const propsPopselectValue = ref({
      striped: false,
      bordered: false,
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

    const popselectChange = (value: PropsComponentPopselectKeys[]) => {
      const keys = Object.keys(propsPopselectValue.value)

      keys.forEach((key) => {
        propsPopselectValue.value[key] = value.includes(
          key as PropsComponentPopselectKeys,
        )
      })
    }

    /**
     *
     * @param p props
     *
     * 处理 toolOptions，合并渲染所有的 toolOptions
     */
    const tool = (p: typeof props) => {
      const { tool } = p

      if (!tool) {
        return
      }

      const renderDefaultToolOptions = () => (
        <NFlex align="center">
          <Print {...p} />
          <Size {...p} onChangeSize={changeTableSize.bind(this)} />
          <Fullscreen />
          <C {...p} onUpdateColumn={updateTableColumn.bind(this)} />
          <TablePropsSelect
            {...p}
            onPopselectChange={popselectChange.bind(this)}
            onInitialed={popselectChange.bind(this)}
          />
        </NFlex>
      )

      if (!props.toolOptions) {
        return renderDefaultToolOptions
      } else {
        if (props.coverTool) {
          return <NFlex align="center">{renderToolOptions()}</NFlex>
        } else {
          return () => (
            <NFlex align="center">
              {renderDefaultToolOptions()}
              {renderToolOptions()}
            </NFlex>
          )
        }
      }
    }

    onMounted(() => {
      // 主动调用 register 方法，满足 useTable 方法正常调用
      const { onRegister } = props

      if (onRegister && rTableInst.value) {
        call(onRegister, rTableInst.value)
      }
    })

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
      propsPopselectValue,
    }
  },
  render() {
    const {
      $props,
      $attrs,
      wrapperBordered,
      uuidWrapper,
      privateReactive,
      disabledContextMenu,
      contextMenuReactive,
      contextMenuOptions,
      uuidTable,
      title,
      $slots,
      propsPopselectValue,
    } = this
    const { tool, combineRowProps, contextMenuSelect } = this

    return (
      <NCard
        ref="wrapperRef"
        bordered={wrapperBordered}
        {...{ id: uuidWrapper }}
      >
        {{
          default: () => (
            <>
              <NDataTable
                {...{ id: uuidTable }}
                {...$attrs}
                {...$props}
                {...propsPopselectValue}
                rowProps={combineRowProps.bind(this)}
                size={privateReactive.size}
                ref="rTableInst"
              >
                {{
                  ...$slots,
                }}
              </NDataTable>
              {!disabledContextMenu ? (
                <NDropdown
                  show={contextMenuReactive.showContextMenu}
                  placement="bottom-start"
                  trigger="manual"
                  x={contextMenuReactive.x}
                  y={contextMenuReactive.y}
                  options={contextMenuOptions}
                  onClickoutside={() =>
                    (contextMenuReactive.showContextMenu = false)
                  }
                  onSelect={contextMenuSelect.bind(this)}
                />
              ) : null}
            </>
          ),
          header: renderNode(title, {
            defaultElement: <div style="display: none;"></div>,
          }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          'header-extra': tool($props as any),
          footer: () => $slots.tableFooter?.(),
          action: () => $slots.tableAction?.(),
        }}
      </NCard>
    )
  },
})
