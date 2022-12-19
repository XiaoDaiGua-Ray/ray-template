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

import { dataTableProps } from 'naive-ui'

import type { PropType, VNode } from 'vue'
import type { DropdownMixedOption } from './type'

const rayTableProps = {
  ...dataTableProps, // 继承 `data table props`
  rightClickMenu: {
    /**
     *
     * 表格右键菜单, 基于 `NDropdown` 实现
     *
     * 如果菜单内容长度为 `0` 则不会渲染
     *
     * 只需要传入对应的菜单配置项, 即可自动开启右键菜单功能
     */
    type: Array as PropType<DropdownMixedOption[]>,
    default: () => [],
  },
  title: {
    /**
     *
     * 表格标题
     *
     * 可以自定义渲染
     */
    type: String,
    default: '',
  },
  action: {
    /**
     *
     * 是否开启操作栏
     *
     * 默认开启
     */
    type: Boolean,
    default: true,
  },
  actionExtra: {
    /**
     *
     * 自定义拓展操作栏
     *
     * 暂时不开放
     */
    type: Object as PropType<VNode>,
    default: () => ({}),
  },
  showMenu: {
    /**
     *
     * 是否展示右键菜单
     *
     * 默认启用
     */
    type: Boolean,
    default: true,
  },
  exportTip: {
    /**
     *
     * 导出表格提示
     */
    type: String,
    default: '是否导出为excel？',
  },
  exportType: {
    /**
     *
     * 导出类型
     *
     * 默认为 `xlsx`
     *
     * 暂时只支持导出为 `xlsx`
     */
    type: String,
    default: 'xlsx',
  },
  exportPositiveText: {
    /**
     *
     * 导出确认按钮文字
     *
     * 默认为 `确认`
     */
    type: String,
    default: '确认',
  },
  exportNegativeText: {
    /**
     *
     * 导出取消按钮文字
     *
     * 默认为 `取消`
     */
    type: String,
    default: '取消',
  },
  exportFilename: {
    /**
     *
     * 导出表格名称
     */
    type: String,
    default: '',
  },
} as const

export default rayTableProps

/**
 *
 * `Ray Table Props`
 *
 * 继承 `Naive UI Data Table`
 */
