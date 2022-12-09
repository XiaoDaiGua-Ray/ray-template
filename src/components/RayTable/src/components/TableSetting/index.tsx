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

import type {
  RayTableProvider,
  SettingOptions,
  ActionOptions,
} from '@/components/RayTable/src/type'

const TableSetting = defineComponent({
  name: 'TableSetting',
  emits: ['columnsUpdate'],
  setup(_, { emit }) {
    const rayTableProvider = inject('rayTableProvider', {} as RayTableProvider)
    const settingOptions = ref(rayTableProvider.modelColumns.value) // 表格表头
    const disableDraggable = ref(true) // 拖拽开关

    const handleDraggableEnd = () => {
      emit('columnsUpdate', settingOptions.value)
    }

    /**
     *
     * @param type 列所需固定方向
     * @param idx 当前操作栏索引位置
     *
     * @remark 操作栏锁定列
     */
    const handleFiexClick = (type: 'left' | 'right', idx: number) => {
      const key = `${type}FiexActivated`
      const value = settingOptions.value[idx]

      value[key] = !value[key]

      if (value[key]) {
        value.fixed = type
      } else {
        value.fixed = void 0
      }

      settingOptions.value[idx] = value

      emit('columnsUpdate', settingOptions.value)
    }

    return {
      settingOptions,
      handleDraggableEnd,
      handleFiexClick,
      disableDraggable,
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
                          <NPopover>
                            {{
                              trigger: () => (
                                <RayIcon
                                  customClassName={`draggable-item__icon ${
                                    element.leftFiexActivated
                                      ? 'draggable-item__icon--actived'
                                      : ''
                                  }`}
                                  name="left_arrow"
                                  size="18"
                                  onClick={this.handleFiexClick.bind(
                                    this,
                                    'left',
                                    index,
                                  )}
                                />
                              ),
                              default: () => '向左固定',
                            }}
                          </NPopover>
                          <NPopover>
                            {{
                              trigger: () => (
                                <RayIcon
                                  customClassName={`draggable-item__icon ${
                                    element.rightFiexActivated
                                      ? 'draggable-item__icon--actived'
                                      : ''
                                  }`}
                                  name="right_arrow"
                                  size="18"
                                  onClick={this.handleFiexClick.bind(
                                    this,
                                    'right',
                                    index,
                                  )}
                                />
                              ),
                              default: () => '向右固定',
                            }}
                          </NPopover>
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
