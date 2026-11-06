import { RTablePro } from '@/components/RTablePro'
import { prefixCacheKey } from '@/utils/app/prefix-cache-key'
import { mount } from '@vue/test-utils'
import { NDataTable, NTree } from 'naive-ui'
import type { DataTableColumn } from 'naive-ui'
import { effectScope, nextTick, ref, shallowRef } from 'vue'
import {
  getLeafColumns,
  useColumnVisibility,
} from '../../packages/ui/src/RTablePro/src/columns'
import ColumnSettings from '../../packages/ui/src/RTablePro/src/components/ColumnSettings'

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

it('filters nested leaves and prunes empty groups while retaining unaffected branches', () => {
  const scope = effectScope()
  const nested = { key: 'outer', children: [group] }
  const source = shallowRef<DataTableColumn[]>([nested, region])

  try {
    const state = scope.run(() => useColumnVisibility(source, ref()))!

    state.setColumnVisible('email', false)
    expect(
      getLeafColumns(state.visibleColumns.value).map(({ key }) => key),
    ).toEqual(['name', 'region'])
    expect(state.visibleColumns.value[1]).toBe(region)
    state.setColumnVisible('name', false)
    expect(state.visibleColumns.value).toEqual([region])
    state.resetColumns()
    expect(state.visibleColumns.value).toBe(source.value)
  } finally {
    scope.stop()
  }
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

it.each([false, true])(
  'pins and unpins every group descendant without mutating source definitions (controlled=%s)',
  async (controlled) => {
    const renderName = (row: { name: string }) => row.name
    const nameColumn = {
      ...name,
      width: 120,
      resizable: true,
      render: renderName,
    }
    const emailColumn = {
      ...email,
      width: 180,
      resizable: false,
      fixed: 'right' as const,
    }
    const children = [nameColumn, emailColumn]
    const nested = { key: 'inner', title: 'Details', children }
    const grouped = { key: 'contact', title: 'Contact', children: [nested] }
    const unaffected = { ...region, width: 140, fixed: 'right' as const }
    const input: DataTableColumn[] = [grouped, unaffected]

    for (const value of [
      nameColumn,
      emailColumn,
      children,
      nested,
      grouped.children,
      grouped,
      unaffected,
      input,
    ])
      Object.freeze(value)

    const update = vi.fn()
    const wrapper = mount(RTablePro, {
      props: {
        columns: input,
        data: [
          { id: 1, name: 'Alice', email: 'alice@example.test', region: 'West' },
        ],
        scrollX: 440,
        ...(controlled ? { 'onUpdate:columns': update } : {}),
      },
    })

    try {
      const settings = wrapper.getComponent(ColumnSettings)
      const table = wrapper.getComponent(NDataTable)
      const patch = async (value: {
        fixed?: 'left' | 'right'
        resizable?: boolean
      }) => {
        settings.vm.$emit('patchColumn', 'contact', value)

        if (controlled)
          await wrapper.setProps({ columns: update.mock.lastCall![0] })
        else await nextTick()
      }

      await patch({ resizable: true })
      expect(table.props('columns')![0]).toMatchObject({
        children: [
          {
            children: [
              { resizable: true },
              { resizable: false, fixed: 'right' },
            ],
          },
        ],
      })

      for (const fixed of ['left', 'right', void 0] as const) {
        await patch({ fixed })
        const result = table.props('columns')!
        const leaves = getLeafColumns(result)

        expect(result[0].fixed).toBe(fixed)
        expect('children' in result[0] && result[0].children[0].fixed).toBe(
          fixed,
        )
        expect(leaves[0]).toMatchObject({
          key: 'name',
          width: 120,
          resizable: true,
          render: renderName,
        })
        expect(leaves[1]).toMatchObject({
          key: 'email',
          width: 180,
          resizable: false,
        })
        expect(leaves[0].fixed).toBe(fixed)
        expect(leaves[1].fixed).toBe(fixed)
        expect(result[1]).toBe(unaffected)

        for (const key of ['name', 'email']) {
          const cell = wrapper.get(`tbody td[data-col-key="${key}"]`)

          if (fixed)
            expect(cell.classes()).toContain(`n-data-table-td--fixed-${fixed}`)
          else
            expect(
              cell.classes().some((name) => name.includes('--fixed-')),
            ).toBe(false)
        }
      }

      expect(nameColumn).not.toHaveProperty('fixed')
      expect(emailColumn.fixed).toBe('right')
      expect(grouped).not.toHaveProperty('fixed')
      expect(nested).not.toHaveProperty('fixed')
      expect(grouped.children[0]).toBe(nested)
      expect(nested.children).toBe(children)
    } finally {
      wrapper.unmount()
    }
  },
)

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

it('offers keyboard-operable column ordering and resets layout without revealing hidden columns', async () => {
  const wrapper = mount(RTablePro, {
    props: {
      columns: [selection, { ...name, width: 100 }, email, region],
      columnStateKey: 'keyboard',
    },
    global: { stubs: { teleport: true } },
  })

  try {
    const settings = wrapper.getComponent(ColumnSettings)
    const native = wrapper.getComponent(NDataTable)

    await settings.get('button').trigger('click')
    const move = wrapper.get('button[aria-label="Move Email up"]')

    expect(move.attributes('type')).toBe('button')
    await move.trigger('click')
    settings.vm.$emit('patchColumn', 'name', { fixed: 'left', resizable: true })
    settings.vm.$emit('toggleColumn', 'region', false)
    await nextTick()
    expect(native.props('columns')).toEqual([
      selection,
      email,
      { ...name, width: 100, fixed: 'left', resizable: true },
    ])

    const reset = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Reset column layout')

    expect(reset).toBeDefined()
    await reset!.trigger('click')
    expect(native.props('columns')).toEqual([
      selection,
      { ...name, width: 100 },
      email,
    ])
    expect(JSON.parse(localStorage.getItem(cacheKey('keyboard'))!)).toEqual([
      'region',
    ])
  } finally {
    wrapper.unmount()
  }
})
