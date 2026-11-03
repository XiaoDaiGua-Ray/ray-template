import { useI18n } from '@/hooks/template/useI18n'
import { NButton, NFlex, NPopover, NTree } from 'naive-ui'
import type { TreeDropInfo, TreeOption } from 'naive-ui'
import type { PropType } from 'vue'
import { getLeafColumns, hasColumnKey } from '../columns'
import type { ColumnLayoutPatch, KeyedColumn, TableColumnKey } from '../columns'
import props from '../props'
import ToolButton from './ToolButton'

export default defineComponent({
  name: 'TableColumns',
  props: {
    columns: props.columns,
    hiddenKeys: {
      type: Object as PropType<ReadonlySet<TableColumnKey>>,
      required: true,
    },
  },
  emits: {
    reorderColumns: (_keys: TableColumnKey[]) => true,
    patchColumn: (_key: TableColumnKey, _patch: ColumnLayoutPatch) => true,
    toggleColumn: (_key: TableColumnKey, _visible: boolean) => true,
    resetColumns: () => true,
  },
  setup(props, { emit }) {
    const { t } = useI18n('table')
    const columns = computed(() => props.columns.filter(hasColumnKey))
    const rootKeys = computed(
      () => new Set(columns.value.map(({ key }) => key)),
    )
    const leaves = computed(() => getLeafColumns(props.columns))
    const visibleCount = computed(
      () => leaves.value.filter(({ key }) => !props.hiddenKeys.has(key)).length,
    )

    const reorder = ({ node, dragNode, dropPosition }: TreeDropInfo) => {
      if (
        dropPosition === 'inside' ||
        node.key === dragNode.key ||
        node.key == null
      )
        return

      const dragged = columns.value.find(({ key }) => key === dragNode.key)
      const remaining = columns.value.filter(({ key }) => key !== dragNode.key)
      const targetIndex = remaining.findIndex(({ key }) => key === node.key)

      if (!dragged || targetIndex < 0) return

      remaining.splice(
        targetIndex + (dropPosition === 'after' ? 1 : 0),
        0,
        dragged,
      )
      emit(
        'reorderColumns',
        remaining.map(({ key }) => key),
      )
    }

    const arrangeTools = (column: KeyedColumn) => {
      const hasWidth =
        'children' in column
          ? column.children.every((child) => typeof child.width === 'number')
          : typeof column.width === 'number'

      return (
        <NFlex align="center" size={4}>
          <ToolButton
            icon="directional/row_head"
            label={t(
              hasWidth || column.fixed === 'left'
                ? 'pinStart'
                : 'pinNeedsWidth',
            )}
            disabled={!hasWidth && column.fixed !== 'left'}
            aria-pressed={column.fixed === 'left'}
            onClick={() =>
              emit('patchColumn', column.key, {
                fixed: column.fixed === 'left' ? void 0 : 'left',
              })
            }
          />
          {!('children' in column) ? (
            <ToolButton
              icon="directional/resize_h"
              label={t('resize')}
              aria-pressed={!!column.resizable}
              onClick={() =>
                emit('patchColumn', column.key, {
                  resizable: !column.resizable,
                })
              }
            />
          ) : null}
          <ToolButton
            icon="directional/row_end"
            label={t(
              hasWidth || column.fixed === 'right' ? 'pinEnd' : 'pinNeedsWidth',
            )}
            disabled={!hasWidth && column.fixed !== 'right'}
            aria-pressed={column.fixed === 'right'}
            onClick={() =>
              emit('patchColumn', column.key, {
                fixed: column.fixed === 'right' ? void 0 : 'right',
              })
            }
          />
        </NFlex>
      )
    }

    const toTree = (items: KeyedColumn[], root: boolean): TreeOption[] =>
      items.map((column) => ({
        key: column.key,
        label:
          typeof column.title === 'string' ? column.title : String(column.key),
        children:
          'children' in column ? toTree(column.children, false) : void 0,
        suffix: root ? () => arrangeTools(column) : void 0,
      }))

    const tree = computed(() => toTree(columns.value, true))

    return () =>
      columns.value.length ? (
        <NPopover trigger="click" showArrow={false} placement="bottom-end">
          {{
            trigger: () => (
              <ToolButton icon="action/setting" label={t('columns')} />
            ),
            default: () => (
              <fieldset class="r-table-columns">
                <legend>{t('visibleColumns')}</legend>
                <NTree
                  data={tree.value}
                  blockLine
                  defaultExpandAll
                  draggable
                  selectable={false}
                  allowDrop={({ node, dropPosition }) =>
                    node.key != null &&
                    rootKeys.value.has(node.key) &&
                    dropPosition !== 'inside'
                  }
                  onDrop={reorder}
                  renderLabel={({ option }) => {
                    const { key, label, children } = option

                    if (children || key == null) return label

                    const checked = !props.hiddenKeys.has(key)

                    return (
                      <label
                        class="r-table-columns__check"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={checked && visibleCount.value <= 1}
                          onKeydown={(event) => event.stopPropagation()}
                          onChange={(event) =>
                            emit(
                              'toggleColumn',
                              key,
                              (event.target as HTMLInputElement).checked,
                            )
                          }
                        />
                        <span>{label}</span>
                      </label>
                    )
                  }}
                />
                <NButton
                  size="small"
                  quaternary
                  disabled={!props.hiddenKeys.size}
                  onClick={() => emit('resetColumns')}
                >
                  {t('showAllColumns')}
                </NButton>
              </fieldset>
            ),
          }}
        </NPopover>
      ) : null
  },
})
