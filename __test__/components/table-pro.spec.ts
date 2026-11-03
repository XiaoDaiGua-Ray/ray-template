import { RTablePro } from '@/components/base/RTablePro'
import type {
  TableProInst,
  TableProParams,
  TableProResult,
} from '@/components/base/RTablePro'
import { flushPromises, mount } from '@vue/test-utils'
import { NDataTable, NPagination } from 'naive-ui'

const columns = [{ title: 'Name', key: 'name' }]
const response = (name: string, total = 30): TableProResult => ({
  data: [{ id: name, name }],
  total,
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
    second.resolve(response('New page'))
    await next
    first.resolve(response('Old page'))
    await flushPromises()

    expect(wrapper.text()).toContain('New page')
    expect(wrapper.text()).not.toContain('Old page')
    expect(wrapper.getComponent(NDataTable).props('loading')).toBe(false)
  } finally {
    wrapper.unmount()
  }
})

it('shows a retry for a failed request and omits paging fields when pagination is off', async () => {
  const request = vi
    .fn(async (_params: TableProParams) => response('Recovered', 1))
    .mockRejectedValueOnce(new Error('offline'))
  const wrapper = mount(RTablePro, {
    props: { columns, request, pagination: false, tool: false },
  })

  try {
    await flushPromises()
    expect(wrapper.emitted('request-error')).toHaveLength(1)
    expect(wrapper.getComponent(NDataTable).props('pagination')).toBe(false)
    await wrapper.get('.n-alert button').trigger('click')
    await flushPromises()

    expect(request.mock.calls.map(([params]) => params)).toEqual([{}, {}])
    expect(wrapper.find('.n-alert').exists()).toBe(false)
    expect(wrapper.text()).toContain('Recovered')
  } finally {
    wrapper.unmount()
  }
})

it('can paginate local data without requiring a request or a row key function', async () => {
  const data = [
    { id: 1, name: 'First' },
    { id: 2, name: 'Second' },
  ]
  const wrapper = mount(RTablePro, {
    props: { columns, data, pageSize: 1, tool: false },
  })

  try {
    expect(wrapper.getComponent(NDataTable).props('remote')).toBe(false)
    expect(wrapper.text()).toContain('First')
    expect(wrapper.text()).not.toContain('Second')
    const instance = wrapper.vm as unknown as TableProInst

    await instance.setPage(2)
    expect(wrapper.text()).toContain('Second')
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
