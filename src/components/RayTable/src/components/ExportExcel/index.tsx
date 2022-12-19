/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2022-12-19
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NPopconfirm, NSpace, NButton } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'

import type { ExportExcelProvider } from '@/components/RayTable/src/type'

const ExportExcel = defineComponent({
  name: 'ExportExcel',
  emits: ['exportPositive', 'exportNegative'],
  setup(_, { emit }) {
    const exportExcelProvider = inject(
      'exportExcelProvider',
      {} as ExportExcelProvider,
    )
    const showPopoconfirm = ref(false)

    const handleButtonClick = (type: string) => {
      type === 'positive' ? emit('exportPositive') : emit('exportNegative')

      showPopoconfirm.value = false
    }

    return {
      ...exportExcelProvider,
      handleButtonClick,
      showPopoconfirm,
    }
  },
  render() {
    return (
      <NPopconfirm v-model:show={this.showPopoconfirm}>
        {{
          trigger: () => (
            <RayIcon
              name="export_excel"
              size="18"
              customClassName="ray-table-icon"
            />
          ),
          default: () => this.exportTip,
          action: () => (
            <NSpace>
              <NButton
                size="small"
                ghost
                onClick={this.handleButtonClick.bind(this, 'negative')}
              >
                {this.exportNegativeText}
              </NButton>
              <NButton
                size="small"
                ghost
                type="info"
                onClick={this.handleButtonClick.bind(this, 'positive')}
              >
                {this.exportPositiveText}
              </NButton>
            </NSpace>
          ),
        }}
      </NPopconfirm>
    )
  },
})

export default ExportExcel
