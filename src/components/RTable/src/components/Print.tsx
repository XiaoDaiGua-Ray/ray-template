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

import { RIcon } from '@/components'

import { config } from '../shared'
import props from '../props'
import { printDom } from '@/utils/dom'

import type { TableProvider } from '../type'

export default defineComponent({
  name: 'TablePrint',
  props,
  setup(props) {
    const { wrapperRef } = inject<TableProvider>(
      config.tableKey,
      {} as TableProvider,
    )

    const printTableClick = () => {
      const {
        printTableOptions: { printOptions = {}, domToImageOptions } = {},
        title,
      } = props

      if (
        printOptions.documentTitle === '' ||
        printOptions.documentTitle === void 0 ||
        printOptions.documentTitle === null
      ) {
        printOptions.documentTitle = typeof title === 'string' ? title : ''
      }

      printDom(wrapperRef, {
        printOptions,
        domToImageOptions,
      })
    }

    return {
      printTableClick,
    }
  },
  render() {
    return (
      <RIcon
        name="print"
        size={config.tableIconSize}
        cursor="pointer"
        onClick={this.printTableClick.bind(this)}
      />
    )
  },
})
