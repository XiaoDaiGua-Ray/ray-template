/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2022-12-08
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'
import { NCard, NPopover, NEllipsis, NCheckbox } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'
import VueDraggable from 'vuedraggable'
import { setupSettingOptions } from './hook'

import type {
  RayTableProvider,
  ActionOptions,
  FixedType,
  TableSettingFixedPopoverIcon,
} from '@/components/RayTable/src/type'

const TableSetting = defineComponent({
  name: 'TableSetting',
  emits: ['columnsUpdate'],
  setup(_, { emit }) {
    const rayTableProvider = inject('rayTableProvider', {} as RayTableProvider)
    const settingOptions = ref(
      setupSettingOptions(rayTableProvider.modelColumns.value),
    ) // 表格表头
    const disableDraggable = ref(true) // 拖拽开关

    const handleDraggableEnd = () => {
      emit('columnsUpdate', settingOptions.value)
    }

    const FixedPopoverIcon = (options: TableSettingFixedPopoverIcon) => {
      const { element, name, tooltip, fn, index, fixed, key } = options

      return (
        <NPopover>
          {{
            trigger: () => (
              <RayIcon
                customClassName={`draggable-item__icon ${
                  element[key] ? 'draggable-item__icon--actived' : ''
                }`}
                name={name}
                size="18"
                onClick={fn.bind(this, fixed, index)}
              />
            ),
            default: () => tooltip,
          }}
        </NPopover>
      )
    }
    /**
     *
     * @param type 列所需固定方向
     * @param idx 当前操作栏索引位置
     *
     * @remark 操作栏锁定列, 不能同时存在两种状态(互斥)
     */
    const handleFixedClick = (type: FixedType, idx: number) => {
      const key = `${type}FixedActivated`
      const value = settingOptions.value[idx]

      if (key === 'leftFixedActivated') {
        value['rightFixedActivated'] = false
      } else if (key === 'rightFixedActivated') {
        value['leftFixedActivated'] = false
      }

      value[key] = !value[key]

      if (value[key]) {
        value.fixed = type
      } else {
        value.fixed = undefined
      }

      settingOptions.value[idx] = value

      emit('columnsUpdate', settingOptions.value)
    }

    /**
     *
     * @param idx 索隐
     *
     * @remark 动态设置列宽度
     */
    const handleResizeColumnClick = (idx: number) => {
      const value = settingOptions.value[idx]

      value['resizeColumnActivated'] = !value['resizeColumnActivated']
      value['resizable'] = value['resizeColumnActivated']

      settingOptions.value[idx] = value

      emit('columnsUpdate', settingOptions.value)
    }

    return {
      settingOptions,
      handleDraggableEnd,
      handleFixedClick,
      disableDraggable,
      FixedPopoverIcon,
      handleResizeColumnClick,
    }
  },
  render() {
    return (
      <NPopover trigger="click" placement="bottom" showArrow={false} raw>
        {{
          trigger: () => (
            <RayIcon
              customClassName="ray-table__setting"
              name="setting"
              size="18"
            />
          ),
          default: () => (
            <NCard bordered={false} segmented={{ content: 'soft' }}>
              {{
                default: () => (
                  <VueDraggable
                    class={['ray-table__setting-option--draggable']}
                    v-model={this.settingOptions}
                    itemKey="key"
                    disabled={!this.disableDraggable}
                    onEnd={this.handleDraggableEnd.bind(this)}
                  >
                    {{
                      item: ({
                        element,
                        index,
                      }: {
                        element: ActionOptions
                        index: number
                      }) => (
                        <div class={['draggable-item']}>
                          <RayIcon
                            customClassName={`draggable-item__d--icon`}
                            name="draggable"
                            size="18"
                          />
                          <NEllipsis>
                            <span>{element.title}</span>
                          </NEllipsis>
                          {this.FixedPopoverIcon({
                            element: element,
                            name: 'left_arrow',
                            tooltip: '左固定',
                            fn: this.handleFixedClick,
                            index,
                            fixed: 'left',
                            key: 'leftFixedActivated',
                          })}
                          <NPopover>
                            {{
                              trigger: () => (
                                <RayIcon
                                  customClassName={`draggable-item__icon ${
                                    element['resizeColumnActivated']
                                      ? 'draggable-item__icon--actived'
                                      : ''
                                  }`}
                                  name="resize_h"
                                  size="18"
                                  onClick={this.handleResizeColumnClick.bind(
                                    this,
                                    index,
                                  )}
                                />
                              ),
                              default: () => '修改列宽',
                            }}
                          </NPopover>
                          {this.FixedPopoverIcon({
                            element: element,
                            name: 'right_arrow',
                            tooltip: '右固定',
                            fn: this.handleFixedClick,
                            index,
                            fixed: 'right',
                            key: 'rightFixedActivated',
                          })}
                        </div>
                      ),
                    }}
                  </VueDraggable>
                ),
                header: () => (
                  <NCheckbox v-model:checked={this.disableDraggable}>
                    拖拽
                  </NCheckbox>
                ),
              }}
            </NCard>
          ),
        }}
      </NPopover>
    )
  },
})

export default TableSetting
