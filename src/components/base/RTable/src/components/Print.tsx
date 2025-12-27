import { RIcon } from '@/components'
import { printDom } from '@/utils/dom'
import props from '../props'
import { config } from '../shared'
import type { TableProvider } from '../types'

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
