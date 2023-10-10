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

/**
 *
 * TODO:
 * - 使用 computed 获取数据时，将数据转换为 NTree 格式，并且补充固定列操作栏按钮与初始化样式
 * - 使用 computed 收集固定列、拖拽列后的数据
 * - 点击固定列按钮后，激活样式
 * - Table 父组件通知更新 columns，使用 v-model:columns 方式绑定时，即可实现拖拽、动态展示列、固定列操作
 */

import { NPopover, NSpace, NTree } from 'naive-ui'
import RIcon from '@/components/RIcon/index'

import config from '../config'
import props from '../props'
import { h } from 'vue'
import { call } from '@/utils/vue/index'

import type { TreeOption, TreeDropInfo } from 'naive-ui'
import type { C } from '../type'
import type { AnyFC } from '@/types/modules/utils'
import type { MaybeArray } from '@/types/modules/utils'

type FixedClick = (type: 'left' | 'right', option: C, index: number) => void

const renderSwitcherIcon = () =>
  h(RIcon, {
    name: 'draggable',
    size: config.tableIconSize,
  })

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
    <NPopover>
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
    /** 深拷贝 columns 避免修改源数据 */
    const treeDataSource = computed({
      get: () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return props.columns.map((curr: any, idx) => {
          const {
            key,
            title,
            children,
            fixed,
            resizable: $resizable,
            ...args
          } = curr
          const isLeftFixedActivated = fixed && fixed === 'left'
          const isRightFixedActivated = fixed && fixed === 'right'
          const isResizable = !!$resizable
          const attr = {
            ...args,
            title,
            key,
            fixed,
            isLeftFixedActivated,
            isRightFixedActivated,
          }

          return {
            ...attr,
            suffix: () => (
              <NSpace wrapItem={false} style="padding-left: 24px;">
                <RowIconRender
                  icon="row_head"
                  title="固定在列首"
                  customClassName={
                    isLeftFixedActivated ? 'r-table__c-fixed--active' : ''
                  }
                  onClick={fixedClick.bind(this, 'left', attr, idx)}
                />
                <RowIconRender
                  icon="row_end"
                  title="固定在列尾"
                  customClassName={
                    isRightFixedActivated ? 'r-table__c-fixed--active' : ''
                  }
                  onClick={fixedClick.bind(this, 'right', attr, idx)}
                />
              </NSpace>
            ),
          }
        })
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      set: () => {},
    })

    const event = (options: C[]) => {
      const { onUpdateColumn } = props

      if (onUpdateColumn) {
        call(onUpdateColumn, options)
      }
    }

    const fixedClick: FixedClick = (type, option, index) => {
      const key = `${type}FixedActivated`

      if (key === 'leftFixedActivated') {
        option['rightFixedActivated'] = false
      } else if (key === 'rightFixedActivated') {
        option['leftFixedActivated'] = false
      }

      option[key] = !option[key]
      option[key] ? (option['fixed'] = type) : (option['fixed'] = void 0)
      treeDataSource.value[index] = option

      event(treeDataSource.value)
    }

    const treeDrop = ({ node, dragNode, dropPosition }: TreeDropInfo) => {
      const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(
        dragNode,
        treeDataSource.value,
      )

      if (dragNodeSiblings === null || dragNodeIndex === null) {
        return
      }

      dragNodeSiblings.splice(dragNodeIndex, 1)

      const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
        node,
        treeDataSource.value,
      )

      if (nodeSiblings === null || nodeIndex === null) {
        return
      }

      dropPosition === 'before'
        ? nodeSiblings.splice(nodeIndex, 0, dragNode)
        : nodeSiblings.splice(nodeIndex + 1, 0, dragNode)

      event(nodeSiblings as C[])
    }

    return {
      treeDataSource,
      treeDrop,
    }
  },
  render() {
    return (
      <NPopover displayDirective="show" trigger="click">
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
              labelField="title"
              renderSwitcherIcon={renderSwitcherIcon.bind(this)}
              onDrop={this.treeDrop.bind(this)}
            />
          ),
        }}
      </NPopover>
    )
  },
})
