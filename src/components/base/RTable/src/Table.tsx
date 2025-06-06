import './index.scss'

import { NCard, NDataTable, NDropdown, NFlex } from 'naive-ui'
import Size from './components/Size'
import Fullscreen from './components/Fullscreen'
import C from './components/C'
import Print from './components/Print'
import TablePropsSelect from './components/Props'

import props from './props'
import { call, renderNode, uuid, completeSize } from '@/utils'
import { config } from './shared'
import { pick } from 'lodash-es'
import { useTemplateRef } from 'vue'

import type { DropdownOption, DataTableInst, DataTableProps } from 'naive-ui'
import type { ComponentSize } from '@/types'
import type {
  C as CType,
  PropsComponentPopselectKeys,
  RTableInst,
} from './types'
import type { ExtractPublicPropTypes } from 'vue'

export default defineComponent({
  name: 'RTable',
  inheritAttrs: false,
  props,
  setup(props, ctx) {
    const { expose, emit } = ctx

    const rTableInst = useTemplateRef<RTableInst>('rTableInst')
    const wrapperRef = useTemplateRef<HTMLElement>('wrapperRef')

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
    const propsPopselectValue = ref(
      Object.assign(
        {
          striped: false,
          bordered: false,
        },
        pick(props, 'striped', 'bordered'),
      ),
    )
    // 默认设置 card header style
    const cardHeaderStyle = computed(() => {
      const { title, tool, cardProps } = props
      const { headerStyle = {} } = cardProps ?? {}

      if (!title && !tool) {
        return Object.assign(
          {},
          {
            paddingTop: '0px',
          },
          headerStyle,
        )
      }

      return headerStyle
    })
    // 如果启用了 flexAutoHeight 属性，则自动继承高度
    const flexAutoHeightStyle = computed(() => {
      const { flexAutoHeight } = props

      if (!flexAutoHeight) {
        return null
      }

      return {
        height: '100%',
        flex: 1,
      }
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
        ?.filter(Boolean)
        .map((curr) => (typeof curr === 'function' ? curr() : curr))
    }

    const popselectChange = (value: PropsComponentPopselectKeys[]) => {
      const keys = Object.keys(propsPopselectValue.value)

      keys.forEach((key) => {
        propsPopselectValue.value[
          key as keyof typeof propsPopselectValue.value
        ] = value.includes(key as PropsComponentPopselectKeys)
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
          return () => <NFlex align="center">{renderToolOptions()}</NFlex>
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
        call(onRegister, rTableInst.value, {
          uuidTable,
          uuidWrapper,
          wrapperRef,
        })
      }
    })

    provide(config.tableKey, {
      uuidTable,
      uuidWrapper,
      wrapperRef,
    })
    expose()

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
      cardHeaderStyle,
      flexAutoHeightStyle,
    }
  },
  render() {
    const {
      $props,
      $attrs,
      $slots,
      uuidTable,
      contextMenuReactive,
      uuidWrapper,
      privateReactive,
      propsPopselectValue,
      cardHeaderStyle,
      flexAutoHeightStyle,
    } = this
    const { class: className, ...restAttrs } = $attrs
    const { tool, combineRowProps, contextMenuSelect } = this
    const {
      renderWrapperHeader,
      wrapperBordered,
      disabledContextMenu,
      contextMenuOptions,
      title,
      tableFlexHeight,
      cardProps,
      flexAutoHeight,
      flexHeight,
      ...restProps
    } = $props
    const { headerStyle, ...restCardProps } = cardProps ?? {}

    return (
      <NCard
        {...restCardProps}
        {...{
          id: uuidWrapper,
        }}
        {...restAttrs}
        ref="wrapperRef"
        bordered={wrapperBordered}
        class={className}
        // flexAutoHeight 具有更高的优先级
        style={Object.assign({}, cardHeaderStyle, flexAutoHeightStyle)}
      >
        {{
          default: () => (
            <>
              <NDataTable
                {...{
                  id: uuidTable,
                }}
                {...(restProps as DataTableProps)}
                {...propsPopselectValue}
                flexHeight={flexAutoHeight ? true : flexHeight}
                rowProps={combineRowProps.bind(this)}
                size={privateReactive.size}
                ref="rTableInst"
                style={{
                  height: flexAutoHeight
                    ? '100%'
                    : tableFlexHeight !== null && tableFlexHeight !== void 0
                      ? completeSize(tableFlexHeight)
                      : null,
                }}
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
          header: renderWrapperHeader
            ? renderNode(title, {
                defaultElement: <div style="display: none;"></div>,
              })
            : null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          'header-extra': tool($props as any),
          footer: () => $slots.tableFooter?.(),
          action: () => $slots.tableAction?.(),
        }}
      </NCard>
    )
  },
})
