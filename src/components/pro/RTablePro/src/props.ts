import { tableProps } from '@/components'
import { omit } from 'lodash-es'

import type { PropType } from 'vue'
import type {
  TableProInst,
  TablePagination,
  TableRequestConfig,
  PaginationPrefix,
} from './types'
import type { AnyFC } from '@/types'

const props = {
  ...omit(tableProps, ['pagination']),
  /**
   *
   * @description
   * 分页总数。
   *
   * @default 1
   */
  paginationCount: {
    type: Number,
    default: 1,
  },
  /**
   *
   * @description
   * 注册 useTablePro 钩子函数。
   *
   * @default undefined
   */
  onRegister: {
    type: Function as PropType<(inst: TableProInst) => void>,
    default: void 0,
  },
  /**
   *
   * @description
   * 是否需要手动控制表格的刷新。
   * 如果设置为 true，在 Pagination 更新时，不会自动触发表格的刷新。
   *
   * @default false
   */
  manual: {
    type: Boolean,
    default: false,
  },
  /**
   *
   * @description
   * 刷新表格的请求函数。
   * 该属性用于配置表格的刷新请求函数。
   *
   * 如果设置了该属性，则会在表格刷新时调用该函数。
   *
   * @default undefined
   */
  request: {
    type: Function as PropType<AnyFC>,
  },
  /**
   *
   * @description
   * pagination 更新时的回调函数。
   *
   * @default undefined
   */
  onTablePaginationUpdate: {
    type: Function as PropType<(pagination: TablePagination) => void>,
  },
  /**
   *
   * @description
   * 请求函数的参数。
   * 该属性用于配置请求函数的参数。
   *
   * @default undefined
   */
  requestConfig: {
    type: Object as PropType<TableRequestConfig>,
  },
  /**
   *
   * @description
   * 是否显示分页器。
   * 如果需要显示分页器，则设置为 true。
   *
   * @default false
   */
  showPagination: {
    type: Boolean,
    default: false,
  },
  /**
   *
   * @description
   * 设置表格数据为异步状态。
   * 当你使用该组件的时候，会默认认为你总是异步获取数据，所以重写了原组件的 remote，
   * 现在 remote 默认为开启状态，也就是默认为 true。
   *
   * @default true
   */
  remote: {
    type: Boolean,
    default: true,
  },
  /**
   *
   * @description
   * 分页器前缀。
   * 自定义配置分页器前缀。
   *
   * @default (info) => `共 ${info.itemCount} 条`
   */
  paginationPrefix: {
    type: Function as PropType<PaginationPrefix>,
    default: (info: Parameters<NonNullable<PaginationPrefix>>[0]) =>
      `共 ${info.itemCount} 条`,
  },
}

export default props
