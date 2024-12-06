/**
 *
 * 自定义表格列的顺序
 *
 * 但是该方法有几个缺陷地方:
 * 1. 只能代理第一层的数据，也就意味着深层次的子列不支持配置操作，只会跟随根列更新
 * 2. 大量数据的时候，可能会出现性能问题
 */

import { NPopover, NFlex, NTree } from 'naive-ui'
import { RIcon } from '@/components'

import { config } from '../shared'
import props from '../props'
import { call } from '@/utils'
import { cloneDeep, isEmpty } from 'lodash-es'

import type { TreeOption, TreeDropInfo } from 'naive-ui'
import type { C } from '../types'
import type { AnyFC } from '@/types'
import type { MaybeArray } from '@/types'

type FixedClick = (type: 'left' | 'right', option: C, index: number) => void

const renderSwitcherIcon = () => (
  <RIcon name="draggable" size={14} cursor="grab" />
)

const RowIconRender = ({
  icon,
  title,
  onClick,
  customClassName,
}: {
  icon: string
  title: string
  onClick?: AnyFC
  customClassName?: string
}) => {
  return (
    <NPopover showArrow={false}>
      {{
        trigger: () => (
          <RIcon
            name={icon}
            size={config.tableIconSize}
            cursor="pointer"
            customClassName={customClassName}
            onClick={onClick?.bind(null)}
          />
        ),
        default: () => title,
      }}
    </NPopover>
  )
}

/**
 * 查找节点的兄弟节点和索引
 *
 * @param node 要查找的节点
 * @param nodes 节点列表
 * @returns 如果找到节点，则返回包含兄弟节点列表和索引的元组，否则返回 [null, null]
 */
const findSiblingsAndIndex = (
  node: TreeOption,
  nodes?: TreeOption[],
): [TreeOption[], number] | [null, null] => {
  if (!nodes) {
    return [null, null]
  }

  for (let i = 0; i < nodes.length; ++i) {
    const siblingNode = nodes[i]

    if (siblingNode.key === node.key) {
      return [nodes, i]
    }

    const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children)

    if (siblings && index !== null) {
      return [siblings, index]
    }
  }

  return [null, null]
}

const R_TABLE_C_TOOL_ICON_ACTIVE = 'r-table__c-tool-icon--active'

export default defineComponent({
  name: 'TableC',
  props: {
    ...props,
    onUpdateColumn: {
      type: [Function, Array] as PropType<MaybeArray<(option: C[]) => void>>,
      default: null,
    },
  },
  setup(props) {
    let tableColumnType: C
    // 深拷贝 columns 避免修改源数据
    const treeDataSource = computed({
      get: () => {
        const cloneColumns = cloneDeep(props.columns).filter((curr) => {
          if (curr.type) {
            tableColumnType = curr as unknown as C

            return false
          }

          return true
        })

        return cloneColumns.map((curr, idx) => {
          const { key, title, children, fixed, isResizable, ...args } =
            curr as C
          const isLeftFixedActivated = fixed === 'left'
          const isRightFixedActivated = fixed === 'right'
          const attr = {
            ...args,
            title,
            key,
            fixed,
            isLeftFixedActivated,
            isRightFixedActivated,
            isResizable,
          }

          return {
            ...attr,
            suffix: () => (
              <NFlex style="padding-left: 32px;">
                <RowIconRender
                  icon="row_head"
                  title="固定在列首"
                  customClassName={
                    isLeftFixedActivated ? R_TABLE_C_TOOL_ICON_ACTIVE : ''
                  }
                  onClick={fixedClick.bind(this, 'left', attr, idx)}
                />
                <NPopover showArrow={false}>
                  {{
                    trigger: () => (
                      <RIcon
                        name="resize_h"
                        size={config.tableIconSize}
                        cursor="pointer"
                        customClassName={
                          isResizable ? R_TABLE_C_TOOL_ICON_ACTIVE : ''
                        }
                        onClick={resizableClick.bind(this, attr, idx)}
                      />
                    ),
                    default: () => '修改列宽',
                  }}
                </NPopover>
                <RowIconRender
                  icon="row_end"
                  title="固定在列尾"
                  customClassName={
                    isRightFixedActivated ? R_TABLE_C_TOOL_ICON_ACTIVE : ''
                  }
                  onClick={fixedClick.bind(this, 'right', attr, idx)}
                />
              </NFlex>
            ),
          }
        }) as C[]
      },

      set: () => {},
    })

    const event = (options: C[]) => {
      const { onUpdateColumn } = props

      if (onUpdateColumn) {
        call(onUpdateColumn, options)
      }
    }

    const resizableClick = (option: C, index: number) => {
      option['isResizable'] = !option['isResizable']
      option['resizable'] = option['isResizable']
      treeDataSource.value[index] = option

      event(treeDataSource.value)
    }

    const fixedClick: FixedClick = (type, option, index) => {
      const key = `${type}FixedActivated` as const
      const otherKey =
        `${type === 'left' ? 'right' : 'left'}FixedActivated` as const

      option[otherKey] = false
      option[key] = !option[key]
      option[key] ? (option['fixed'] = type) : (option['fixed'] = void 0)
      treeDataSource.value[index] = option

      event(treeDataSource.value)
    }

    // 拖拽节点的处理函数
    const treeDrop = ({ node, dragNode, dropPosition }: TreeDropInfo) => {
      const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(
        dragNode,
        treeDataSource.value as TreeOption[],
      )

      if (dragNodeSiblings === null || dragNodeIndex === null) {
        return
      }

      // 从兄弟节点中移除拖拽节点
      dragNodeSiblings.splice(dragNodeIndex, 1)

      const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
        node,
        treeDataSource.value as TreeOption[],
      )

      if (nodeSiblings === null || nodeIndex === null) {
        return
      }

      // 根据拖拽位置将拖拽节点插入到目标节点的前面或后面
      dropPosition === 'before'
        ? nodeSiblings.splice(nodeIndex, 0, dragNode)
        : nodeSiblings.splice(nodeIndex + 1, 0, dragNode)

      if (!isEmpty(tableColumnType)) {
        nodeSiblings.unshift(tableColumnType as TreeOption)
      }

      // 触发事件，更新树形数据源
      event(nodeSiblings as C[])
    }

    return {
      treeDataSource,
      treeDrop,
    }
  },
  render() {
    return (
      <NPopover displayDirective="show" trigger="click" showArrow={false}>
        {{
          trigger: () => (
            <RIcon
              name="setting"
              size={config.tableIconSize}
              cursor="pointer"
              customClassName="r-table__setting"
            />
          ),
          default: () => (
            <NTree
              class="r-table__c-tree"
              data={this.treeDataSource as TreeOption[]}
              blockLine
              draggable
              keyboard={false}
              labelField="title"
              selectable={false}
              renderSwitcherIcon={renderSwitcherIcon.bind(this)}
              onDrop={this.treeDrop.bind(this)}
            />
          ),
        }}
      </NPopover>
    )
  },
})
