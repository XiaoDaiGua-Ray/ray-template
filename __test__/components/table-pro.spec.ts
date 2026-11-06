import { RTablePro, useTablePro } from '@/components/RTablePro'
import type {
  TableProInst,
  TableProParams,
  TableProResult,
} from '@/components/RTablePro'
import { provideUiServices } from '@ray-template/ui/services'
import { flushPromises, mount } from '@vue/test-utils'
import { NDataTable, NDropdown, NPagination } from 'naive-ui'
import { defineComponent, h } from 'vue'
import * as csv from '../../packages/ui/src/RTablePro/src/csv'

const columns = [{ title: 'Name', key: 'name' }]
const response = (name: string, total = 30): TableProResult => ({
  data: [{ id: name, name }],
  total,
})

it('binds table actions on mount and clears the instance until the table remounts', async () => {
  const [
    register,
    { isReady, reload, setPage, getTableProInstance, getCurrentPageData },
  ] = useTablePro()
  const request = vi.fn(async (_params: TableProParams) => response('Alice'))
  const mountTable = () =>
    mount(RTablePro, { props: { columns, request, onRegister: register } })

  expect(isReady.value).toBe(false)
  expect(getTableProInstance).toThrow('Table is not mounted')
  const first = mountTable()
  const originalInstance = getTableProInstance()

  try {
    expect(isReady.value).toBe(true)
    await setPage(2)
    await flushPromises()
    expect(request.mock.lastCall?.[0]).toEqual({ page: 2, pageSize: 10 })
    expect(getCurrentPageData()).toEqual(response('Alice').data)
  } finally {
    first.unmount()
  }

  expect(isReady.value).toBe(false)
  expect(getTableProInstance).toThrow('Table is not mounted')
  const second = mountTable()

  try {
    expect(isReady.value).toBe(true)
    expect(getTableProInstance()).not.toBe(originalInstance)
    await setPage(2)
    await reload(true)
    expect(request.mock.lastCall?.[0]).toEqual({ page: 1, pageSize: 10 })
  } finally {
    second.unmount()
  }
})

it('loads and paginates once per action, without rewriting the filter object', async () => {
  const request = vi.fn(async (_params: TableProParams) => response('Alice'))
  const filters = { email: '@example.test', page: 99 }
  const wrapper = mount(RTablePro, {
    props: { columns, request, params: filters, tool: false },
  })

  try {
    await flushPromises()
    expect(request.mock.calls).toEqual([
      [
        { email: '@example.test', page: 1, pageSize: 10 },
        expect.any(AbortSignal),
      ],
    ])
    const table = wrapper.getComponent(NDataTable)

    expect(table.props('remote')).toBe(true)
    expect(table.props('data')).toEqual(response('Alice').data)
    expect(wrapper.getComponent(NPagination).props('itemCount')).toBe(30)

    const instance = wrapper.vm as unknown as TableProInst

    await instance.setPage(2)
    await instance.setPageSize(20)
    await instance.setPage(2)
    await wrapper.setProps({ params: { email: 'alice' } })
    await flushPromises()

    expect(request.mock.calls.map(([params]) => params)).toEqual([
      { email: '@example.test', page: 1, pageSize: 10 },
      { email: '@example.test', page: 2, pageSize: 10 },
      { email: '@example.test', page: 1, pageSize: 20 },
      { email: '@example.test', page: 2, pageSize: 20 },
      { email: 'alice', page: 1, pageSize: 20 },
    ])
    expect(filters).toEqual({ email: '@example.test', page: 99 })
  } finally {
    wrapper.unmount()
  }
})

it('ignores stale data even if the loader ignores cancellation', async () => {
  const first = Promise.withResolvers<TableProResult>()
  const second = Promise.withResolvers<TableProResult>()
  const request = vi
    .fn((_params: TableProParams, _signal: AbortSignal) => first.promise)
    .mockImplementationOnce(() => first.promise)
    .mockImplementationOnce(() => second.promise)
  const wrapper = mount(RTablePro, { props: { columns, request, tool: false } })

  try {
    const instance = wrapper.vm as unknown as TableProInst
    const next = instance.setPage(2)

    expect(request.mock.calls[0][1].aborted).toBe(true)
    second.resolve(response('New page', 40))
    await next
    first.resolve(response('Old page'))
    await flushPromises()

    expect(wrapper.text()).toContain('New page')
    expect(wrapper.text()).not.toContain('Old page')
    expect(wrapper.getComponent(NDataTable).props('loading')).toBe(false)
    expect(instance.queryState).toMatchObject({
      loading: false,
      failed: false,
      page: 2,
      total: 40,
    })
  } finally {
    wrapper.unmount()
  }
})

it('exposes read-only query state during load, failure and retry', async () => {
  const initial = Promise.withResolvers<TableProResult>()
  const failing = Promise.withResolvers<TableProResult>()
  const retry = Promise.withResolvers<TableProResult>()
  const request = vi
    .fn(() => retry.promise)
    .mockReturnValueOnce(initial.promise)
    .mockReturnValueOnce(failing.promise)
  const [register, { queryState, reload, setPageSize }] = useTablePro()

  expect(queryState.value).toBeNull()
  const wrapper = mount(RTablePro, {
    props: { columns, request, onRegister: register, tool: false },
  })

  try {
    expect(queryState.value).toEqual({
      loading: true,
      failed: false,
      page: 1,
      pageSize: 10,
      total: null,
    })
    expect(Reflect.set(queryState.value!, 'page', 99)).toBe(false)

    initial.resolve(response('Last successful result', 42))
    await flushPromises()
    expect(queryState.value).toMatchObject({ loading: false, total: 42 })

    const next = setPageSize(20)

    expect(queryState.value).toMatchObject({
      loading: true,
      pageSize: 20,
      total: 42,
    })
    failing.reject(new Error('offline'))
    await next
    expect(queryState.value).toEqual({
      loading: false,
      failed: true,
      page: 1,
      pageSize: 20,
      total: null,
    })
    expect(wrapper.text()).not.toContain('Last successful result')

    const retrying = reload()

    expect(queryState.value).toMatchObject({
      loading: true,
      failed: false,
      total: null,
    })
    retry.resolve(response('Recovered', 7))
    await retrying
    expect(queryState.value).toMatchObject({
      loading: false,
      failed: false,
      total: 7,
    })
  } finally {
    wrapper.unmount()
  }

  expect(queryState.value).toBeNull()
})

it('clears rows and blocks output while a different query scope loads or fails', async () => {
  const failed = Promise.withResolvers<TableProResult>()
  const request = vi
    .fn(async (_params: TableProParams) => response('Account B'))
    .mockResolvedValueOnce(response('Account A'))
    .mockImplementationOnce(() => failed.promise)
  const wrapper = mount(RTablePro, {
    props: { columns, request, params: { account: { id: 'a' } } },
  })
  const table = wrapper.vm as unknown as TableProInst
  const download = vi
    .spyOn(csv, 'downloadTableCsv')
    .mockImplementation(() => {})

  try {
    await flushPromises()
    expect(table.getCurrentPageData()).toEqual(response('Account A').data)
    await wrapper.setProps({ params: { account: { id: 'b' } } })

    expect(table.queryState).toMatchObject({ loading: true, total: null })
    expect(table.getCurrentPageData()).toEqual([])
    expect(table.getTableInstance()).toBeNull()
    expect(wrapper.getComponent(NDataTable).props('data')).toEqual([])
    failed.reject(new Error('offline'))
    await flushPromises()

    expect(table.queryState).toMatchObject({ failed: true, total: null })
    expect(wrapper.text()).not.toContain('Account A')
    expect(await table.print()).toBe(false)
    table.downloadCsv({ keepOriginalData: true })
    expect(download).not.toHaveBeenCalled()

    await table.reload()
    expect(table.getCurrentPageData()).toEqual(response('Account B').data)
    table.downloadCsv()
    expect(download).toHaveBeenCalledExactlyOnceWith(
      '"Name"\r\n"Account B"',
      void 0,
    )
  } finally {
    download.mockRestore()
    wrapper.unmount()
  }
})

it('clears even same-query rows on failure and when the request source changes', async () => {
  const request = vi
    .fn(async (_params: TableProParams) => response('Previous source'))
    .mockResolvedValueOnce(response('Previous source'))
    .mockRejectedValueOnce(new Error('offline'))
  const replacement = vi.fn(async () => {
    throw new Error('new source offline')
  })
  const wrapper = mount(RTablePro, { props: { columns, request } })
  const table = wrapper.vm as unknown as TableProInst

  try {
    await flushPromises()
    await table.reload()
    expect(table.queryState).toMatchObject({ failed: true, total: null })
    expect(table.getCurrentPageData()).toEqual([])

    await table.reload()
    expect(table.getCurrentPageData()).toEqual(response('Previous source').data)
    await wrapper.setProps({ request: replacement })
    await flushPromises()
    expect(table.queryState).toMatchObject({ failed: true, total: null })
    expect(table.getCurrentPageData()).toEqual([])
  } finally {
    wrapper.unmount()
  }
})

it('shows a toast and the normal empty state without an inline alert, then allows retry', async () => {
  const request = vi
    .fn(async (_params: TableProParams) => response('Recovered', 1))
    .mockRejectedValueOnce(new Error('offline'))
  const reportError = vi.fn()
  const wrapper = mount(
    defineComponent({
      setup() {
        provideUiServices({ reportError })

        return () =>
          h(
            RTablePro,
            { columns, request, pagination: false, tool: false },
            {
              empty: () => 'Custom empty state',
              notice: () => 'Always visible notice',
            },
          )
      },
    }),
  )
  const table = wrapper.getComponent(RTablePro)
  const instance = table.vm as unknown as TableProInst

  try {
    await flushPromises()
    expect(table.emitted('request-error')).toHaveLength(1)
    expect(reportError).toHaveBeenCalledExactlyOnceWith(
      "Couldn't load the data",
    )
    expect(table.getComponent(NDataTable).props('pagination')).toBe(false)
    expect(table.text()).toContain('Custom empty state')
    expect(table.text()).toContain('Always visible notice')
    expect(table.find('.n-alert').exists()).toBe(false)
    await instance.reload()

    expect(request.mock.calls.map(([params]) => params)).toEqual([{}, {}])
    expect(table.text()).toContain('Recovered')
    expect(instance.queryState).toEqual({
      loading: false,
      failed: false,
      page: null,
      pageSize: null,
      total: 1,
    })
  } finally {
    wrapper.unmount()
  }
})

it('reads the sorted and filtered local page without a request or custom row key', async () => {
  const data = [
    { id: 3, name: 'Third' },
    { id: 1, name: 'First' },
    { id: 2, name: 'Second' },
  ]
  const wrapper = mount(RTablePro, {
    props: {
      columns: [{ title: 'Name', key: 'name', sorter: 'default' }],
      data,
      pageSize: 1,
      search: [{ key: 'name', label: 'Name' }],
      tool: false,
    },
  })

  try {
    expect(wrapper.getComponent(NDataTable).props('remote')).toBe(false)
    const instance = wrapper.vm as unknown as TableProInst

    expect(instance.getCurrentPageData()).toEqual([data[0]])
    instance.getTableInstance()?.sort('name', 'ascend')
    await instance.setPage(2)
    expect(wrapper.text()).toContain('Second')
    expect(instance.getCurrentPageData()).toEqual([data[2]])

    await wrapper.get('input').setValue('ir')
    await wrapper.get('form').trigger('submit')
    expect(instance.getCurrentPageData()).toEqual([data[1]])
  } finally {
    wrapper.unmount()
  }
})

it('renders bare data without a toolbar or pagination by default', () => {
  const wrapper = mount(RTablePro, {
    props: { bare: true, columns, data: response('Bare row', 1).data },
  })

  try {
    expect(wrapper.text()).toContain('Bare row')
    expect(wrapper.getComponent(NDataTable).props('pagination')).toBe(false)
    expect(wrapper.find('header').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('r-table--card')
  } finally {
    wrapper.unmount()
  }
})

it('submits the search and resets the page without requiring form state in the caller', async () => {
  const request = vi.fn(async (_params: TableProParams) => response('Alice'))
  const wrapper = mount(RTablePro, {
    props: {
      columns,
      request,
      search: [{ key: 'name', label: 'Name' }],
      tool: false,
    },
  })

  try {
    const instance = wrapper.vm as unknown as TableProInst

    await instance.setPage(2)
    await wrapper.get('input').setValue('  Alice  ')
    expect(request).toHaveBeenCalledTimes(2)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(request).toHaveBeenCalledTimes(3)
    expect(request.mock.lastCall?.[0]).toEqual({
      name: 'Alice',
      page: 1,
      pageSize: 10,
    })

    await wrapper.get('form button[type="button"]').trigger('click')
    await flushPromises()
    expect(request.mock.lastCall?.[0]).toEqual({ page: 1, pageSize: 10 })
  } finally {
    wrapper.unmount()
  }
})

it('enables the table body scroller with a single autoHeight prop', () => {
  const wrapper = mount(RTablePro, {
    props: {
      autoHeight: true,
      columns,
      data: response('Row', 1).data,
      tool: false,
    },
  })

  try {
    expect(wrapper.getComponent(NDataTable).props('flexHeight')).toBe(true)
    expect(wrapper.classes()).toContain('r-table--fill')
  } finally {
    wrapper.unmount()
  }
})

it('returns to the last available remote page when the total shrinks', async () => {
  const request = vi
    .fn(async (_params: TableProParams) => response('First page', 5))
    .mockResolvedValueOnce(response('Initial', 30))
    .mockResolvedValueOnce({ data: [], total: 5 })
  const wrapper = mount(RTablePro, { props: { columns, request, tool: false } })

  try {
    await flushPromises()
    const instance = wrapper.vm as unknown as TableProInst

    await instance.setPage(3)

    expect(request.mock.calls.map(([params]) => params.page)).toEqual([1, 3, 1])
    expect(wrapper.text()).toContain('First page')
    expect(instance.queryState).toMatchObject({ page: 1, total: 5 })
  } finally {
    wrapper.unmount()
  }
})

it('passes native pagination settings and totals through for a manually controlled remote table', async () => {
  const onUpdatePage = vi.fn()
  const wrapper = mount(RTablePro, {
    props: {
      columns,
      remote: true,
      data: [{ id: 1, name: 'Loaded by caller' }],
      pagination: {
        page: 3,
        pageSize: 20,
        itemCount: 80,
        showQuickJumper: true,
        onUpdatePage,
      },
      tool: false,
    },
  })

  try {
    const pager = wrapper.getComponent(NPagination)

    expect((wrapper.vm as unknown as TableProInst).queryState).toBeNull()
    expect(pager.props()).toMatchObject({
      page: 3,
      pageSize: 20,
      itemCount: 80,
      showQuickJumper: true,
    })
    await pager.findAll('.n-pagination-item--button').at(-1)!.trigger('click')
    expect(onUpdatePage).toHaveBeenCalledOnce()
    expect(onUpdatePage).toHaveBeenCalledWith(4)
  } finally {
    wrapper.unmount()
  }
})

it('uses native initial paging options with managed requests and validates imperative values', async () => {
  const request = vi.fn(async (_params: TableProParams) =>
    response('Loaded', 100),
  )
  const wrapper = mount(RTablePro, {
    props: {
      columns,
      request,
      pagination: { defaultPage: 2, defaultPageSize: 20 },
      tool: false,
    },
  })

  try {
    await flushPromises()
    const instance = wrapper.vm as unknown as TableProInst

    await instance.setPage(0)
    await instance.setPageSize(Number.NaN)
    expect(request.mock.calls.map(([params]) => params)).toEqual([
      { page: 2, pageSize: 20 },
    ])
  } finally {
    wrapper.unmount()
  }
})

it('keeps TablePro state in sync when DataTable changes its page directly', async () => {
  const data = [
    { id: 1, name: 'First' },
    { id: 2, name: 'Second' },
  ]
  const onUpdatePage = vi.fn()
  const wrapper = mount(RTablePro, {
    props: { data, columns, pageSize: 1, onUpdatePage, tool: false },
  })

  try {
    const instance = wrapper.vm as unknown as TableProInst

    instance.getTableInstance()?.page(2)
    await wrapper.vm.$nextTick()

    expect(wrapper.getComponent(NPagination).props('page')).toBe(2)
    expect(wrapper.text()).toContain('Second')
    expect(onUpdatePage).toHaveBeenCalledOnce()
  } finally {
    wrapper.unmount()
  }
})

it('supports an optional title slot for actions without putting controls inside a heading', () => {
  const wrapper = mount(RTablePro, {
    props: {
      columns,
      data: [{ id: 1, name: 'Alice' }],
      title: 'Default title',
      tool: false,
    },
    slots: { title: '<button>Quick action</button>' },
  })

  try {
    expect(wrapper.get('header button').text()).toBe('Quick action')
    expect(wrapper.find('header h2').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Default title')
  } finally {
    wrapper.unmount()
  }
})

it('provides the row that opened the context menu and discards it after data changes', async () => {
  const row = { id: 7, name: 'Alice' }
  const option = { key: 'edit', label: 'Edit' }
  const select = vi.fn()
  const onContextmenu = vi.fn((event: MouseEvent) => event.preventDefault())
  const wrapper = mount(RTablePro, {
    props: {
      columns,
      data: [row],
      tool: false,
      rowProps: () => ({ onContextmenu }),
      contextMenuOptions: [option],
      onContextMenuClick: select,
    },
    global: { stubs: { teleport: true } },
  })
  const menu = wrapper
    .findAllComponents(NDropdown)
    .find((dropdown) => dropdown.props('trigger') === 'manual')!

  try {
    const entry = wrapper.get('tbody tr')

    await entry.trigger('contextmenu')
    expect(onContextmenu).toHaveBeenCalledOnce()
    expect(menu.props('show')).toBe(false)

    expect(entry.attributes('tabindex')).toBe('0')
    await entry.trigger('keydown', { key: 'F10', shiftKey: true })
    expect(menu.props('show')).toBe(true)
    await wrapper.get('.n-dropdown-option-body').trigger('click')
    expect(select).toHaveBeenCalledExactlyOnceWith('edit', option, {
      row,
      index: 0,
    })

    await entry.trigger('keydown', { key: 'ContextMenu' })
    expect(menu.props('show')).toBe(true)
    await wrapper.setProps({ data: [{ id: 8, name: 'Ray' }] })
    expect(menu.props('show')).toBe(false)
    const closingOption = wrapper.find('.n-dropdown-option-body')

    if (closingOption.exists()) await closingOption.trigger('click')

    expect(select).toHaveBeenCalledOnce()
  } finally {
    wrapper.unmount()
  }
})

it('keeps panel props and slots out of the native table while forwarding its own API', () => {
  const wrapper = mount(RTablePro, {
    props: {
      columns,
      tool: false,
      title: 'Panel title',
      scrollX: 640,
      columnStateKey: 'directory',
    },
    attrs: { id: 'directory' },
    slots: { empty: 'Native empty slot', tableFooter: 'Panel footer' },
  })

  try {
    const native = wrapper.getComponent(NDataTable)

    expect(wrapper.attributes('id')).toBe('directory')
    expect(wrapper.classes()).toContain('r-table--card')
    expect(native.props('scrollX')).toBe(640)
    expect(native.attributes('columnstatekey')).toBeUndefined()
    expect(native.attributes('id')).toBeUndefined()
    expect(native.text()).toContain('Native empty slot')
    expect(native.text()).not.toContain('Panel footer')
    expect(wrapper.get('.r-table__footer').text()).toBe('Panel footer')
  } finally {
    wrapper.unmount()
  }
})

it('respects a changed density prop without reviving an earlier local choice', async () => {
  const wrapper = mount(RTablePro, { props: { columns, size: 'medium' } })
  const native = wrapper.getComponent(NDataTable)

  try {
    wrapper.getComponent(NDropdown).vm.$emit('select', 'density:small')
    await wrapper.vm.$nextTick()
    expect(native.props('size')).toBe('small')
    await wrapper.setProps({ size: 'large' })
    expect(native.props('size')).toBe('large')
    await wrapper.setProps({ size: 'medium' })
    expect(native.props('size')).toBe('medium')
  } finally {
    wrapper.unmount()
  }
})
