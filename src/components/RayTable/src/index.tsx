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
import { NDataTable, NCard, NDropdown, NSpace } from 'naive-ui'
import TableSetting from './components/TableSetting/index'
import TableAction from './components/TableAction/index'

import dayjs from 'dayjs'
import { utils, writeFileXLSX } from 'xlsx'
import { setupExportHeader } from './hook'
import props from './props'
import print from 'print-js'
import { uuid } from '@use-utils/hook'

import type { ActionOptions, ExportExcelHeader } from './type'
import type { WritableComputedRef } from 'vue'
import type { DropdownOption } from 'naive-ui'

const RayTable = defineComponent({
  name: 'RayTable',
  props: props,
  emits: ['update:columns', 'menuSelect', 'exportSuccess', 'exportError'],
  setup(props, { emit }) {
    const tableUUID = uuid()
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
    let prevRightClickIndex = -1

    /**
     *
     * 右键菜单注入
     */
    provide('tableSettingProvider', {
      modelRightClickMenu,
      modelColumns,
    })

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
    const handleExportPositive = () => {
      if (props.data.length && props.columns.length) {
        try {
          const exportHeader = setupExportHeader(
            props.columns as ExportExcelHeader[],
          ) // 获取所有列(设置为 `excel` 表头)
          const sheetData = utils.json_to_sheet(props.data) // 将所有数据转换为表格数据类型
          const workBook = utils.book_new()
          const filename = props.exportFilename
            ? props.exportFilename + '.xlsx'
            : dayjs(new Date()).format('YYYY-MM-DD') + '导出表格的.xlsx'

          utils.book_append_sheet(workBook, sheetData, 'Data')

          const range = utils.decode_range(sheetData['!ref'] as string) // 获取所有单元格

          /**
           *
           * 替换表头
           *
           * 方法有点蠢, 凑合凑合用吧
           */
          for (let c = range.s.c; c <= range.e.c; c++) {
            const header = utils.encode_col(c) + '1'

            sheetData[header].v = exportHeader[sheetData[header].v]
          }

          writeFileXLSX(workBook, filename) // 输出表格

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
      const options = Object.assign(
        {
          printable: tableUUID,
          type: props.printType,
        },
        props.printOptions,
      )

      print(options)
    }

    return {
      tableUUID,
      handleColumnsUpdate,
      ...toRefs(menuConfig),
      handleRowProps,
      handleRightMenuSelect,
      handleExportPositive,
      handlePrintPositive,
    }
  },
  render() {
    return (
      <NCard bordered={false}>
        {{
          default: () => (
            <div>
              <NDataTable
                id={this.tableUUID}
                {...this.$props}
                rowProps={this.handleRowProps.bind(this)}
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
            </div>
          ),
          header: () => this.title,
          'header-extra': () =>
            this.action ? (
              <NSpace align="center">
                {/* 打印输出操作 */}
                <TableAction
                  icon="print"
                  tooltip={this.printTooltip}
                  positiveText={this.printPositiveText}
                  negativeText={this.printNegativeText}
                  onPositive={this.handlePrintPositive.bind(this)}
                />
                {/* 输出为Excel表格 */}
                <TableAction
                  icon="export_excel"
                  tooltip={this.exportTooltip}
                  positiveText={this.exportPositiveText}
                  negativeText={this.exportNegativeText}
                  onPositive={this.handleExportPositive.bind(this)}
                />
                {/* 表格列操作 */}
                <TableSetting
                  onColumnsUpdate={this.handleColumnsUpdate.bind(this)}
                />
              </NSpace>
            ) : (
              ''
            ),
        }}
      </NCard>
    )
  },
})

export default RayTable

/**
 *
 * 完全继承 `NDataTable`, 所以该组件可以使用所有 `NDataTable Props`
 *
 * 实现: 抬头, 操作栏, 右键菜单功能拓展, 输出 `excel`
 *
 * 右键菜单功能, 需要同时启用 `showMenu` 与配置菜单选项才能正常使用
 *
 * 可以通过设置 `action` 为 `false` 隐藏操作栏
 *
 * 具体拓展 `props` 方法, 可以查看 `props.ts` 中相关注释与代码
 *
 * 基于 `xlsx.js` 实现输出 `excel`
 */
