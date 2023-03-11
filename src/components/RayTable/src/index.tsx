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

/**
 *
 * <https://www.naiveui.com/zh-CN/dark/components/data-table>
 *
 * 完全继承 `NDataTable`, 该组件继承 `NDataTable Props` 属性和方法
 *
 * 实现: 抬头, 操作栏, 右键菜单功能拓展, 输出 `excel`, 表格尺寸调整
 *
 * 右键菜单功能, 需要同时启用 `showMenu` 与配置菜单选项才能正常使用
 *
 * 可以通过设置 `action` 为 `false` 隐藏操作栏
 *
 * 具体拓展 `props` 方法, 可以查看 `props.ts` 中相关注释与代码
 *
 * 基于 `xlsx.js` 实现输出 `excel`
 */

/**
 *
 * 为什么有些拓展功能是写在该组件内, 有些则是完全抽离出去呢...
 * 好问题, 因为我一开始没想到而且我又想偷懒
 *
 * 凑合凑合看吧, 等我啥时候有空再抽离出去
 */

import './index.scss'

import { NDataTable, NCard, NDropdown, NDivider } from 'naive-ui'
import TableSetting from './components/TableSetting/index'
import TableAction from './components/TableAction/index'
import TableSize from './components/TableSize/index'
import TableScreenfull from './components/TableScreenfull/index'

import props from './props'
import print from 'print-js'
import { uuid } from '@use-utils/hook'
import { exportFileToXLSX } from '@use-utils/xlsx'

import type { ActionOptions } from './type'
import type { WritableComputedRef } from 'vue'
import type { DropdownOption } from 'naive-ui'
import type { ExportExcelHeader } from '@use-utils/xlsx'

const RayTable = defineComponent({
  name: 'RayTable',
  props: props,
  emits: ['update:columns', 'menuSelect', 'exportSuccess', 'exportError'],
  setup(props, { emit }) {
    const tableUUID = uuid() // 表格 id, 用于打印表格
    const rayTableUUID = uuid() // RayTable id, 用于全屏表格
    const modelRightClickMenu = computed(() => props.rightClickMenu)
    const modelColumns = computed({
      get: () => props.columns,
      set: (arr) => {
        emit('update:columns', arr)
      },
    }) as unknown as WritableComputedRef<ActionOptions[]>
    const menuConfig = reactive({
      x: 0,
      y: 0,
      showMenu: false,
    })
    let prevRightClickIndex = -1 // 缓存上次点击索引位置
    const cssVars = computed(() => {
      const cssVar = {
        '--ray-table-header-space': props.tableHeaderSpace,
      }

      return cssVar
    })
    const tableSize = ref(props.size)

    /** 注入相关属性 */
    provide('tableSettingProvider', {
      modelRightClickMenu,
      modelColumns,
      size: props.size,
      rayTableUUID,
    })

    /** 拖拽更新后的表格列 */
    const handleColumnsUpdate = (arr: ActionOptions[]) => {
      modelColumns.value = arr
    }

    /**
     *
     * @param key 右键菜单当前选择 `key`
     * @param option 右键菜单当前 `item`
     *
     * @remark (key: string | number, index: number,option: DropdownOption) => void
     */
    const handleRightMenuSelect = (
      key: string | number,
      option: DropdownOption,
    ) => {
      emit('menuSelect', key, prevRightClickIndex, option)

      menuConfig.showMenu = false
    }

    /**
     *
     * @param arr 表格当前行
     * @param idx 表格当前索引位置
     * @returns 自定义属性集
     *
     * @remark 集成右键菜单属性, 会自动拦截右键方法, 会自动合并自定义行属性
     */
    const handleRowProps = (arr: ActionOptions, idx: number) => {
      const interceptRowProps = props.rowProps?.(arr, idx)

      return {
        ...interceptRowProps,
        onContextmenu: (e: MouseEvent) => {
          e.preventDefault()

          prevRightClickIndex = idx

          menuConfig.showMenu = false

          nextTick().then(() => {
            menuConfig.showMenu = true

            menuConfig.x = e.clientX
            menuConfig.y = e.clientY
          })
        },
      }
    }

    /**
     *
     * 导出表格数据为 `excel`
     *
     * 基于 `xlsx`
     *
     * 按需导入 `xlsx` 减少体积, 不依赖传统 `file save` 插件导出方式
     */
    const handleExportPositive = async () => {
      if (props.data.length && props.columns.length) {
        try {
          await exportFileToXLSX(
            props.data,
            props.columns as ExportExcelHeader[],
            {
              filename: props.exportFilename,
            },
          )

          emit('exportSuccess')
        } catch (e) {
          emit('exportError')
        }
      }
    }

    /**
     *
     * 打印输出表格内容
     *
     * 默认配置按照 `print-js` 配置
     *
     * 会自动合并自定义配置项
     *
     * 受到 `print-js` 限制有些样式是无法打印输出的
     */
    const handlePrintPositive = () => {
      const options = Object.assign({}, props.printOptions, {
        printable: tableUUID,
        type: props.printType,
        documentTitle: props.printOptions.documentTitle
          ? props.printOptions.documentTitle
          : '表格',
      })

      print(options)
    }

    /** 更新后的表格尺寸 */
    const handleChangeTableSize = (size: ComponentSize) => {
      tableSize.value = size
    }

    return {
      tableUUID,
      rayTableUUID,
      handleColumnsUpdate,
      ...toRefs(menuConfig),
      handleRowProps,
      handleRightMenuSelect,
      handleExportPositive,
      handlePrintPositive,
      cssVars,
      handleChangeTableSize,
      tableSize,
    }
  },
  render() {
    return (
      <NCard
        class="ray-table"
        bordered={this.bordered}
        style={[this.cssVars]}
        id={this.rayTableUUID}
      >
        {{
          default: () => (
            <>
              <NDataTable
                id={this.tableUUID}
                {...this.$props}
                rowProps={this.handleRowProps.bind(this)}
                size={this.tableSize}
              >
                {{
                  empty: () => this.$slots?.empty?.(),
                  loading: () => this.$slots?.loading?.(),
                }}
              </NDataTable>
              {this.showMenu ? (
                // 右键菜单
                <NDropdown
                  show={this.showMenu}
                  placement="bottom-start"
                  trigger="manual"
                  x={this.x}
                  y={this.y}
                  options={this.rightClickMenu}
                  onClickoutside={() => (this.showMenu = false)}
                  onSelect={this.handleRightMenuSelect.bind(this)}
                />
              ) : (
                ''
              )}
            </>
          ),
          header: () => this.title,
          'header-extra': () =>
            this.action ? (
              <div class="ray-table-header-extra__space">
                {/* 打印输出操作 */}
                <TableAction
                  icon={this.printIcon}
                  tooltip={this.printTooltip}
                  popoverContent="打印表格"
                  positiveText={this.printPositiveText}
                  negativeText={this.printNegativeText}
                  onPositive={this.handlePrintPositive.bind(this)}
                />
                {/* 输出为Excel表格 */}
                <TableAction
                  icon={this.exportExcelIcon}
                  tooltip={this.exportTooltip}
                  popoverContent="导出表格"
                  positiveText={this.exportPositiveText}
                  negativeText={this.exportNegativeText}
                  onPositive={this.handleExportPositive.bind(this)}
                />
                {/* 表格尺寸调整 */}
                <TableSize
                  onChangeSize={this.handleChangeTableSize.bind(this)}
                />
                {/* 全屏表格 */}
                <TableScreenfull />
                {/* 表格列操作 */}
                <TableSetting
                  onColumnsUpdate={this.handleColumnsUpdate.bind(this)}
                />
              </div>
            ) : (
              ''
            ),
          footer: () => this.$slots.tableFooter?.(),
        }}
      </NCard>
    )
  },
})

export default RayTable
