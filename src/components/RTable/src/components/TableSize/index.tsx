/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-03-10
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import { NPopover, NCard } from 'naive-ui'
import RayIcon from '@/components/RIcon/index'

import { call } from '@/utils/vue/index'

import type { TableSettingProvider } from '@/components/RTable/src/type'
import type { ComponentSize } from '@/types/modules/component'
import type { MaybeArray } from '@/types/modules/utils'

const TableSize = defineComponent({
  name: 'TableSize',
  props: {
    onChangeSize: {
      type: [Function, Array] as PropType<
        MaybeArray<(size: ComponentSize) => void>
      >,
      default: null,
    },
  },
  emits: ['changeSize'],
  setup(props) {
    const tableSettingProvider = inject(
      'tableSettingProvider',
      {} as TableSettingProvider,
    )

    const popoverShow = ref(false)
    const size = computed({
      get: () => tableSettingProvider.size,
      set: (val) => {
        const { onChangeSize } = props

        if (onChangeSize) {
          call(onChangeSize, val)
        }
      },
    })
    const sizeOptions = ref([
      {
        label: '默认',
        key: 'medium',
      },
      {
        label: '紧凑',
        key: 'small',
      },
      {
        label: '宽松',
        key: 'large',
      },
    ])

    const handleDropdownClick = (key: ComponentSize) => {
      sizeOptions.value.forEach((curr) => {
        if (curr.key === key) {
          size.value = key

          popoverShow.value = false
        }
      })
    }

    return {
      size,
      sizeOptions,
      handleDropdownClick,
      popoverShow,
    }
  },
  render() {
    return (
      <NPopover
        v-model:show={this.popoverShow}
        trigger="click"
        placement="bottom"
        showArrow={false}
        raw
      >
        {{
          trigger: () => (
            <NPopover>
              {{
                trigger: () => (
                  <RayIcon
                    name="adjustment"
                    size="18"
                    customClassName="ray-table-icon"
                  />
                ),
                default: () => '表格密度',
              }}
            </NPopover>
          ),
          default: () => (
            <NCard
              bordered={false}
              class="ray-table__table-size ray-table__table-size--dark ray-table__table-size--light"
            >
              <div class="table-size__dropdown">
                <div class="table-size__dropdown-wrapper">
                  {this.sizeOptions.map((curr) => (
                    <div
                      class={[
                        'dropdown-item',
                        curr.key === this.size ? 'dropdown-item--active' : '',
                      ]}
                      key={curr.key}
                      onClick={this.handleDropdownClick.bind(
                        this,
                        curr.key as ComponentSize,
                      )}
                    >
                      <div class="drop-item__label">{curr.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </NCard>
          ),
        }}
      </NPopover>
    )
  },
})

export default TableSize
