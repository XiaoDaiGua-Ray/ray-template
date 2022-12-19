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
import props from './props'
import TableSetting from './components/TableSetting/index'
import ExportExcel from './components/ExportExcel/index'
import { utils, writeFileXLSX } from 'xlsx'
import dayjs from 'dayjs'
import { setupExportHeader } from './hook'

import type { ActionOptions, ExportExcelHeader } from './type'
import type { WritableComputedRef } from 'vue'
import type { DropdownOption } from 'naive-ui'

const RayTable = defineComponent({
  name: 'RayTable',
  props: props,
  emits: ['update:columns', 'menuSelect', 'exportSuccess', 'exportError'],
  setup(props, { emit }) {
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

    provide('tableSettingProvider', {
      modelRightClickMenu,
      modelColumns,
    })
    provide('exportExcelProvider', {
      exportTip: props.exportTip,
      exportType: props.exportType,
      exportPositiveText: props.exportPositiveText,
      exportNegativeText: props.exportNegativeText,
      exportFilename: props.exportFilename,
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

    const handleExportPositive = () => {
      if (props.data.length && props.columns.length) {
        try {
          const exportHeader = setupExportHeader(
            props.columns as ExportExcelHeader[],
          ) // 获取所有列(设置为 `excel` 表头)
          const sheetData = utils.json_to_sheet(props.data)
          const workBook = utils.book_new()
          const filename = props.exportFilename
            ? props.exportFilename + '.xlsx'
            : dayjs(new Date()).format('YYYY-MM-DD') + '.xlsx'

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

    return {
      handleColumnsUpdate,
      ...toRefs(menuConfig),
      handleRowProps,
      handleRightMenuSelect,
      handleExportPositive,
    }
  },
  render() {
    return (
      <NCard bordered={false}>
        {{
          default: () => (
            <div>
              <NDataTable
                {...this.$props}
                rowProps={this.handleRowProps.bind(this)}
              >
                {{
                  empty: () => this.$slots?.empty,
                  loading: () => this.$slots?.loading,
                }}
              </NDataTable>
              {this.showMenu ? (
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
                <ExportExcel
                  onExportPositive={this.handleExportPositive.bind(this)}
                />
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
 * 完全继承 `NDataTable`
 *
 * 以实现抬头, 操作栏, 右键菜单功能拓展
 *
 * 右键菜单功能, 需要同时启用 `showMenu` 与配置菜单选项才能正常使用
 *
 * 可以通过设置 `action` 为 `false` 隐藏操作栏
 *
 * 具体拓展 `props` 方法, 可以查看 `props.ts` 中相关注释与代码
 */
