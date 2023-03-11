/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2022-12-22
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NPopconfirm, NSpace, NButton, NPopover } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'

export type EmitterType = 'positive' | 'negative'

const TableAction = defineComponent({
  name: 'TableAction',
  props: {
    tooltip: {
      /**
       *
       * 提示内容
       */
      type: String,
      required: true,
    },
    negativeText: {
      /**
       *
       * 取消提示按钮文本内容
       *
       * 默认 `取消`
       */
      type: String,
      default: '取消',
    },
    positiveText: {
      /**
       *
       * 确认提示按钮文本内容
       *
       * 默认 `确认`
       */
      type: String,
      default: '确认',
    },
    icon: {
      /**
       *
       * 图标
       *
       * 必须为 `icons` 中已包含的
       */
      type: String,
      required: true,
    },
    iconSize: {
      /**
       *
       * 图标尺寸
       *
       * 默认为 `18px`
       */
      type: Number,
      default: 18,
    },
    popoverContent: {
      type: String,
      required: true,
    },
  },
  emits: ['positive', 'negative'],
  setup(_, { emit }) {
    const showPopoconfirm = ref(false)

    const handleEmit = (type: EmitterType) => {
      type === 'positive' ? emit('positive') : emit('negative')

      showPopoconfirm.value = false
    }

    return {
      handleEmit,
      showPopoconfirm,
    }
  },
  render() {
    return (
      <NPopover>
        {{
          trigger: () => (
            <NPopconfirm v-model:show={this.showPopoconfirm} showArrow={true}>
              {{
                trigger: () => (
                  <RayIcon
                    name={this.icon}
                    size={this.iconSize}
                    customClassName="ray-table-icon"
                  />
                ),
                default: () => this.tooltip,
                action: () => (
                  <NSpace>
                    <NButton
                      size="small"
                      ghost
                      onClick={this.handleEmit.bind(this, 'negative')}
                    >
                      {this.negativeText}
                    </NButton>
                    <NButton
                      size="small"
                      ghost
                      type="info"
                      onClick={this.handleEmit.bind(this, 'positive')}
                    >
                      {this.positiveText}
                    </NButton>
                  </NSpace>
                ),
              }}
            </NPopconfirm>
          ),
          default: () => this.popoverContent,
        }}
      </NPopover>
    )
  },
})

export default TableAction
