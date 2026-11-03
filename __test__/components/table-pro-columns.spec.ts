import { RTablePro } from '@/components/base/RTablePro'
import { useColumnVisibility } from '@/components/base/RTablePro/src/columns'
import ColumnSettings from '@/components/base/RTablePro/src/components/C'
import { prefixCacheKey } from '@/utils/app/prefix-cache-key'
import { mount } from '@vue/test-utils'
import { NDataTable, NTree } from 'naive-ui'
import type { DataTableColumn } from 'naive-ui'
import { effectScope, nextTick, ref, shallowRef } from 'vue'

const name = { key: 'name', title: 'Name' }
const email = { key: 'email', title: 'Email' }
const region = { key: 'region', title: 'Region' }
const group = { key: 'contact', title: 'Contact', children: [name, email] }
const selection = { type: 'selection' as const }
const columns = shallowRef<DataTableColumn[]>([selection, group, region])
const cacheKey = (key: string) => prefixCacheKey(`table-pro:columns:v1:${key}`)

afterEach(() => {
  localStorage.clear()
  columns.value = [selection, group, region]
})

it('stores only hidden leaf keys, restores them on mount, and isolates separate keys', () => {
  const scope = effectScope()
  const second = effectScope()
  const key = ref('directory')

  try {
    const first = scope.run(() => useColumnVisibility(columns, key))!

    expect(first.visibleColumns.value).toBe(columns.value)
    expect(localStorage.length).toBe(0)
    first.setColumnVisible('email', false)
    expect(first.visibleColumns.value).toEqual([
      selection,
      { ...group, children: [name] },
      region,
    ])
    expect(JSON.parse(localStorage.getItem(cacheKey('directory'))!)).toEqual([
      'email',
    ])

    const restored = second.run(() => useColumnVisibility(columns, key))!
    const other = second.run(() => useColumnVisibility(columns, ref('other')))!

    expect(restored.visibleColumns.value).toEqual(first.visibleColumns.value)
    expect(other.visibleColumns.value).toBe(columns.value)
    restored.resetColumns()
    expect(localStorage.getItem(cacheKey('directory'))).toBeNull()
  } finally {
    scope.stop()
    second.stop()
  }
})

it('ignores stale keys, shows new columns, and keeps one data column visible', async () => {
  localStorage.setItem(
    cacheKey('directory'),
    JSON.stringify(['name', 'region', 'removed', false]),
  )
  const scope = effectScope()

  try {
    const state = scope.run(() =>
      useColumnVisibility(columns, ref('directory')),
    )!

    expect(state.hiddenKeys.value).toEqual(new Set(['name', 'region']))
    state.setColumnVisible('email', false)
    expect(state.visibleColumns.value).toEqual([
      selection,
      { ...group, children: [email] },
    ])

    columns.value = [selection, name, { key: 'created', title: 'Created' }]
    await nextTick()
    expect(state.visibleColumns.value).toEqual([
      selection,
      { key: 'created', title: 'Created' },
    ])

    columns.value = [selection, name]
    expect(state.visibleColumns.value).toEqual([selection, name])
  } finally {
    scope.stop()
  }
})

it('updates visibility without touching storage when no key is configured', () => {
  const scope = effectScope()

  try {
    const state = scope.run(() => useColumnVisibility(columns, ref()))!

    state.setColumnVisible('email', false)
    expect(state.hiddenKeys.value.has('email')).toBe(true)
    expect(localStorage.length).toBe(0)
  } finally {
    scope.stop()
  }
})

it('provides the full settings with a frozen plain columns array and keeps adjustments when definitions change', async () => {
  const input: DataTableColumn[] = [
    selection,
    { ...name, width: 120 },
    { ...email, width: 180 },
  ]

  input.forEach(Object.freeze)
  Object.freeze(input)

  const wrapper = mount(RTablePro, {
    props: {
      columns: input,
      data: [{ id: 1, name: 'Alice', email: 'alice@example.test' }],
    },
  })

  try {
    const settings = wrapper.getComponent(ColumnSettings)
    const table = wrapper.getComponent(NDataTable)

    await settings.get('button').trigger('click')
    const tree = wrapper.getComponent(NTree)
    const drop = tree.props('onDrop')

    expect(tree.props('draggable')).toBe(true)

    if (typeof drop !== 'function')
      throw new Error('Missing column drop handler')

    drop({
      node: { key: 'name' },
      dragNode: { key: 'email' },
      dropPosition: 'before',
      event: new DragEvent('drop'),
    })
    settings.vm.$emit('patchColumn', 'email', {
      fixed: 'left',
      resizable: true,
    })
    await nextTick()

    expect(table.props('columns')).toEqual([
      selection,
      { ...input[2], fixed: 'left', resizable: true },
      input[1],
    ])
    expect(input).toEqual([
      selection,
      { ...name, width: 120 },
      { ...email, width: 180 },
    ])

    settings.vm.$emit('toggleColumn', 'name', false)
    await wrapper.setProps({
      columns: [
        selection,
        { ...name, width: 130 },
        region,
        { ...email, title: 'Work email', width: 220 },
      ],
    })
    expect(table.props('columns')).toEqual([
      selection,
      {
        ...email,
        title: 'Work email',
        width: 220,
        fixed: 'left',
        resizable: true,
      },
      region,
    ])

    settings.vm.$emit('toggleColumn', 'name', true)
    await nextTick()
    expect(table.props('columns')?.at(-1)).toEqual({ ...name, width: 130 })
  } finally {
    wrapper.unmount()
  }
})

it('lets v-model own the full column definitions without removing hidden columns from the emitted value', async () => {
  const input = [selection, name, email]
  const update = vi.fn()
  const wrapper = mount(RTablePro, {
    props: { columns: input, 'onUpdate:columns': update },
  })

  try {
    const settings = wrapper.getComponent(ColumnSettings)
    const table = wrapper.getComponent(NDataTable)

    settings.vm.$emit('toggleColumn', 'email', false)
    settings.vm.$emit('reorderColumns', ['email', 'name'])
    await nextTick()

    expect(update).toHaveBeenCalledExactlyOnceWith([selection, email, name])
    expect(table.props('columns')).toEqual([selection, name])

    await wrapper.setProps({ columns: update.mock.calls[0][0] })
    settings.vm.$emit('toggleColumn', 'email', true)
    await nextTick()
    expect(table.props('columns')).toEqual([selection, email, name])
    expect(update).toHaveBeenCalledTimes(1)
  } finally {
    wrapper.unmount()
  }
})
