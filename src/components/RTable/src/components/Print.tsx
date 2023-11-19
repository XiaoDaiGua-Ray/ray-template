/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-10-05
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NPopover } from 'naive-ui'
import RIcon from '@/components/RIcon/index'

import config from '../config'
import props from '../props'
import { print } from '@/utils/basic'

import type { TableProvider } from '../type'

export default defineComponent({
  name: 'PrintTable',
  props,
  setup(props) {
    const { uuidTable } = inject<TableProvider>(
      config.tableKey,
      {} as TableProvider,
    )

    const printTableClick = () => {
      const { printTableOptions } = props
      const { type = 'html', printOptions = {} } = printTableOptions ?? {}

      const options = Object.assign(printOptions, {
        printable: uuidTable,
        type: type,
        documentTitle: printOptions.documentTitle
          ? printOptions.documentTitle
          : '表格',
      })

      print(document.getElementById(uuidTable), options)
    }

    return {
      printTableClick,
    }
  },
  render() {
    return (
      <NPopover showArrow={false}>
        {{
          trigger: () => (
            <RIcon
              name="print"
              size={config.tableIconSize}
              cursor="pointer"
              onClick={this.printTableClick.bind(this)}
            />
          ),
          default: () => '打印表格',
        }}
      </NPopover>
    )
  },
})
