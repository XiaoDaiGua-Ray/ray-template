import { RTablePro, useTablePro } from '@ray-template/ui/table-pro'
import type {
  TableProParams,
  TableProSearchActions,
  TableProSearchOptionContext,
  TableProSearchOptions,
} from '@ray-template/ui/table-pro'
import { flushPromises, mount } from '@vue/test-utils'
import { NDataTable, NDatePicker, NSelect } from 'naive-ui'
import { defineComponent, h, nextTick, shallowRef } from 'vue'

const columns = [{ key: 'name', title: 'Name' }]
const statusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
]

it('matches text, multiple values, dates, zero and false before local pagination', async () => {
  const [register, actions] = useTablePro()
  const data = [
    {
      id: 1,
      name: 'Other',
      status: 'open',
      day: '2026-11-02',
      amount: 0,
      active: false,
    },
    {
      id: 2,
      name: 'Notebook',
      status: 'closed',
      day: '2026-11-04',
      amount: 0,
      active: false,
    },
    {
      id: 3,
      name: 'Notebook XL',
      status: 'open',
      day: '2026-11-05',
      amount: 0,
      active: false,
    },
    {
      id: 4,
      name: 'Notebook Pro',
      status: 'open',
      day: '2026-11-03',
      amount: 0,
      active: true,
    },
  ]
  const search = {
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        multiple: true,
        options: statusOptions,
      },
      { key: 'day', label: 'Created', type: 'dateRange' },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'active', label: 'Active', type: 'boolean' },
    ],
  } satisfies TableProSearchOptions
  const wrapper = mount(RTablePro, {
    props: {
      columns,
      data,
      search,
      pageSize: 1,
      onRegister: register,
      tool: false,
    },
  })

  try {
    await actions.setPage(2)
    actions.setSearchValues({
      name: '  NOTE  ',
      status: ['open', 'closed'],
      day: ['2026-11-02', '2026-11-04'],
      amount: 0,
      active: false,
    })
    await nextTick()

    expect(wrapper.getComponent(NDataTable).props('data')).toEqual(data)
    expect(wrapper.getComponent(NDatePicker).props('formattedValue')).toEqual([
      '2026-11-02',
      '2026-11-04',
    ])
    expect(await actions.submitSearch()).toBe(true)
    await nextTick()

    expect(actions.getCurrentPageData()).toEqual([data[1]])
    expect(actions.getSearchValues('applied')).toMatchObject({
      name: 'NOTE',
      amount: 0,
      active: false,
    })
    expect(await actions.resetSearch()).toBe(true)
    await nextTick()
    expect(actions.getCurrentPageData()).toEqual([data[0]])
  } finally {
    wrapper.unmount()
  }
})

it('serializes remote search once per submit and reuses the applied snapshot when paging', async () => {
  const [register, actions] = useTablePro()
  const request = vi.fn(async (_params: TableProParams) => ({
    data: [],
    total: 80,
  }))
  const search = {
    initialValues: { status: ['open'] },
    fields: [
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        multiple: true,
        options: statusOptions,
      },
      {
        key: 'createdAt',
        label: 'Created',
        type: 'dateRange',
        transform: ([from, to]) => ({ from, to, page: 99, pageSize: 99 }),
      },
      { key: 'name', label: 'Name', type: 'text' },
    ],
  } satisfies TableProSearchOptions
  const wrapper = mount(RTablePro, {
    props: {
      columns,
      search,
      request,
      params: { status: 'external', scope: 'orders', page: 200 },
      onRegister: register,
      tool: false,
    },
  })

  try {
    const initial = { status: ['open'], scope: 'orders', page: 1, pageSize: 10 }

    expect(request.mock.lastCall?.[0]).toEqual(initial)
    await actions.setPage(3)
    const status = ['closed']

    actions.setSearchValues({
      status,
      createdAt: ['2026-11-01', '2026-11-04'],
      name: '   ',
    })
    status.push('open')
    expect(request).toHaveBeenCalledTimes(2)

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    const applied = {
      status: ['closed'],
      from: '2026-11-01',
      to: '2026-11-04',
      scope: 'orders',
      page: 1,
      pageSize: 10,
    }

    expect(request.mock.lastCall?.[0]).toEqual(applied)
    expect(wrapper.emitted('search')).toEqual([
      [
        {
          reason: 'submit',
          values: {
            status: ['closed'],
            createdAt: ['2026-11-01', '2026-11-04'],
          },
          params: { status: ['closed'], from: '2026-11-01', to: '2026-11-04' },
        },
      ],
    ])
    actions.setSearchValues({ status: [] })
    await actions.setPage(2)
    await actions.reload()
    expect(request.mock.calls.slice(-2).map(([params]) => params)).toEqual([
      { ...applied, page: 2 },
      { ...applied, page: 2 },
    ])
    expect(await actions.resetSearch()).toBe(true)
    expect(request.mock.lastCall?.[0]).toEqual(initial)
    expect(request).toHaveBeenCalledTimes(6)
  } finally {
    wrapper.unmount()
  }
})

it('expands a collapsed field when validation rejects and preserves the last query', async () => {
  const [register, actions] = useTablePro()
  const request = vi.fn(async (_params: TableProParams) => ({
    data: [],
    total: 0,
  }))
  const search: TableProSearchOptions = {
    defaultCollapsed: true,
    fields: [
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: statusOptions,
      },
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        rules: { required: true, message: 'Enter a name' },
      },
    ],
  }
  const wrapper = mount(RTablePro, {
    props: { columns, search, request, onRegister: register, tool: false },
  })

  try {
    expect(
      wrapper.get('button[aria-expanded]').attributes('aria-expanded'),
    ).toBe('false')
    actions.setSearchValues({ name: '   ' })
    expect(await actions.submitSearch()).toBe(false)
    expect(
      wrapper.get('button[aria-expanded]').attributes('aria-expanded'),
    ).toBe('true')
    expect(wrapper.text()).toContain('Enter a name')
    expect(request).toHaveBeenCalledTimes(1)
    actions.setSearchValues({ name: '  Ray  ' })
    expect(await actions.submitSearch()).toBe(true)
    expect(request.mock.lastCall?.[0]).toEqual({
      name: 'Ray',
      page: 1,
      pageSize: 10,
    })
  } finally {
    wrapper.unmount()
  }
})

it('keeps legacy single-select exact matching and lets filters own submission', async () => {
  const [register, actions] = useTablePro()
  const data = [
    { id: 1, name: 'Original', status: 'open' },
    { id: 2, name: 'Reopened', status: 'reopened' },
  ]
  const props = {
    columns,
    data,
    search: [{ key: 'status', label: 'Status', options: statusOptions }],
    onRegister: register,
    tool: false,
  }
  const legacy = mount(RTablePro, { props })

  try {
    expect(legacy.getComponent(NSelect).props('multiple')).toBeFalsy()
    actions.setSearchValues({ status: 'open' })
    await legacy.get('form').trigger('submit')
    expect(actions.getCurrentPageData()).toEqual([data[0]])
  } finally {
    legacy.unmount()
  }

  const custom = mount(RTablePro, {
    props,
    slots: {
      filters: ({
        submit,
      }: {
        submit: (values: Record<string, string | number>) => Promise<void>
      }) =>
        h(
          'button',
          { onClick: () => void submit({ status: 'open' }) },
          'Apply',
        ),
    },
  })

  try {
    expect(custom.find('form').exists()).toBe(false)
    await custom.get('button').trigger('click')
    expect(actions.getCurrentPageData()).toEqual([data[0]])
  } finally {
    custom.unmount()
  }
})

it('delegates manual remote search to the caller and supports custom actions', async () => {
  const data = [{ id: 1, name: 'Original' }]
  const onSearch = vi.fn()
  const search: TableProSearchOptions = {
    fields: [{ key: 'name', label: 'Name', type: 'text' }],
    renderActions: ({ submit }: TableProSearchActions) =>
      h(
        'button',
        { type: 'button', onClick: () => void submit() },
        'Apply filters',
      ),
  }
  const wrapper = mount(RTablePro, {
    props: { columns, data, remote: true, search, onSearch, tool: false },
  })

  try {
    await wrapper.get('input').setValue('Different')
    await wrapper.get('button').trigger('click')
    expect(onSearch).toHaveBeenCalledWith({
      reason: 'submit',
      values: { name: 'Different' },
      params: { name: 'Different' },
    })
    expect(wrapper.getComponent(NDataTable).props('data')).toEqual(data)
  } finally {
    wrapper.unmount()
  }
})

it('uses explicitly searchable leaf columns and treats explicit fields as authoritative', async () => {
  const [register, actions] = useTablePro()
  const request = vi.fn(async (_params: TableProParams) => ({
    data: [],
    total: 10,
  }))
  const wrapper = mount(RTablePro, {
    props: {
      columns: [
        { type: 'selection' },
        {
          key: 'group',
          title: 'Group',
          search: true,
          children: [
            { key: 'name', title: 'Name', search: true },
            {
              key: 'created',
              title: 'Created',
              search: {
                type: 'dateRange',
                transform: ([from, to]) => ({ from, to }),
              },
            },
          ],
        },
        { key: 'excluded', title: 'Excluded', search: false },
      ],
      search: {},
      request,
      onRegister: register,
      tool: false,
    },
  })

  try {
    expect(wrapper.get('form').text()).toContain('Name')
    expect(wrapper.get('form').text()).toContain('Created')
    expect(wrapper.get('form').text()).not.toMatch(/Group|Excluded/)
    actions.setSearchValues({
      name: 'Ray',
      created: ['2026-11-01', '2026-11-04'],
    })
    await actions.submitSearch()
    expect(request.mock.lastCall?.[0]).toEqual({
      name: 'Ray',
      from: '2026-11-01',
      to: '2026-11-04',
      page: 1,
      pageSize: 10,
    })
    await wrapper.setProps({ search: { fields: [] } })
    expect(wrapper.find('form').exists()).toBe(false)
    expect(request.mock.lastCall?.[0]).toEqual({ page: 1, pageSize: 10 })
  } finally {
    wrapper.unmount()
  }
})

it('clears a dependent draft, cancels obsolete options and keeps table requests independent', async () => {
  const [register, actions] = useTablePro()
  const request = vi.fn(async (_params: TableProParams) => ({
    data: [],
    total: 40,
  }))
  const north = Promise.withResolvers<{ label: string; value: string }[]>()
  const south = Promise.withResolvers<{ label: string; value: string }[]>()
  const loadOptions = vi.fn(({ values }: TableProSearchOptionContext) =>
    values.org === 'north' ? north.promise : south.promise,
  )
  const search: TableProSearchOptions = {
    initialValues: { org: 'north', owner: 'n1' },
    fields: [
      {
        type: 'select',
        key: 'org',
        label: 'Organization',
        options: [
          { label: 'North', value: 'north' },
          { label: 'South', value: 'south' },
        ],
      },
      {
        type: 'select',
        key: 'owner',
        label: 'Owner',
        dependsOn: ['org'],
        visible: ({ org }) => org != null,
        loadOptions,
      },
    ],
  }
  const wrapper = mount(RTablePro, {
    props: { columns, search, request, onRegister: register, tool: false },
  })

  try {
    const selects = () => wrapper.get('form').findAllComponents(NSelect)
    const spinner = 'svg.n-base-loading__icon'

    expect(loadOptions).toHaveBeenCalledTimes(1)
    expect(selects()[0].find(spinner).exists()).toBe(false)
    expect(selects()[1].find(spinner).exists()).toBe(true)
    actions.setSearchValues({ org: 'south' })
    await nextTick()

    expect(actions.getSearchValues().owner).toBeNull()
    expect(actions.getSearchValues('applied').owner).toBe('n1')
    expect(loadOptions).toHaveBeenCalledTimes(2)
    expect(loadOptions.mock.calls[0][0].signal.aborted).toBe(true)

    south.resolve([{ label: 'South Owner', value: 's1' }])
    await flushPromises()
    north.resolve([{ label: 'North Owner', value: 'n1' }])
    await flushPromises()

    expect(selects()[1].props('options')).toEqual([
      { label: 'South Owner', value: 's1' },
    ])
    expect(selects()[1].find(spinner).exists()).toBe(false)
    expect(request).toHaveBeenCalledTimes(1)
    actions.setSearchValues({ owner: 's1' })
    await actions.submitSearch()
    expect(request.mock.lastCall?.[0]).toMatchObject({
      org: 'south',
      owner: 's1',
    })

    actions.setSearchValues({ org: null, owner: 's1' })
    await actions.submitSearch()
    expect(wrapper.get('form').findAllComponents(NSelect)).toHaveLength(1)
    expect(request.mock.lastCall?.[0]).toEqual({ page: 1, pageSize: 10 })
  } finally {
    wrapper.unmount()
  }
})

it('debounces option keywords and retries failed options without querying the table', async () => {
  vi.useFakeTimers()
  const request = vi.fn(async () => ({ data: [], total: 0 }))
  const loadOptions = vi
    .fn(async ({ keyword }: TableProSearchOptionContext) => [
      { label: keyword, value: keyword },
    ])
    .mockRejectedValueOnce(new Error('Unavailable'))
  const wrapper = mount(RTablePro, {
    props: {
      columns,
      request,
      search: {
        fields: [{ type: 'select', key: 'owner', label: 'Owner', loadOptions }],
      },
      tool: false,
    },
  })

  try {
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.get('[role="status"]').text()).toContain(
      "Couldn't load options",
    )
    const retry = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Retry')

    await retry?.trigger('click')
    expect(loadOptions).toHaveBeenCalledTimes(2)
    const searchOptions = wrapper.getComponent(NSelect).props('onSearch') as (
      value: string,
    ) => void

    searchOptions('r')
    await nextTick()
    searchOptions('ray')
    await nextTick()
    await vi.advanceTimersByTimeAsync(249)
    expect(loadOptions).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(1)
    expect(loadOptions.mock.lastCall?.[0].keyword).toBe('ray')
    expect(wrapper.getComponent(NSelect).props('options')).toEqual([
      { label: 'ray', value: 'ray' },
    ])
    expect(request).toHaveBeenCalledTimes(1)
  } finally {
    wrapper.unmount()
    vi.useRealTimers()
  }
})

it('debounces table edits and cancels scheduled submits on reset or switching to manual', async () => {
  vi.useFakeTimers()
  const [register, actions] = useTablePro()
  const request = vi.fn(async (_params: TableProParams) => ({
    data: [],
    total: 0,
  }))
  const search: TableProSearchOptions = {
    submitMode: 'change',
    debounce: 50,
    fields: [{ type: 'text', key: 'name', label: 'Name' }],
  }
  const wrapper = mount(RTablePro, {
    props: { columns, request, search, onRegister: register, tool: false },
  })

  try {
    actions.setSearchValues({ name: 'R' })
    await vi.advanceTimersByTimeAsync(40)
    actions.setSearchValues({ name: 'Ray' })
    await vi.advanceTimersByTimeAsync(49)
    expect(request).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(1)
    expect(request.mock.lastCall?.[0]).toEqual({
      name: 'Ray',
      page: 1,
      pageSize: 10,
    })

    actions.setSearchValues({ name: 'Ray' })
    await vi.advanceTimersByTimeAsync(50)
    expect(request).toHaveBeenCalledTimes(2)
    actions.setSearchValues({ name: 'Old' })
    await actions.resetSearch()
    await vi.advanceTimersByTimeAsync(50)
    expect(request).toHaveBeenCalledTimes(3)
    expect(request.mock.lastCall?.[0]).toEqual({ page: 1, pageSize: 10 })

    actions.setSearchValues({ name: 'Manual draft' })
    await wrapper.setProps({ search: { ...search, submitMode: 'manual' } })
    await vi.advanceTimersByTimeAsync(50)
    expect(request).toHaveBeenCalledTimes(3)
    expect(actions.getSearchValues().name).toBe('Manual draft')
    expect(actions.getSearchValues('applied')).toEqual({})
  } finally {
    wrapper.unmount()
    vi.useRealTimers()
  }
})

it('ignores asynchronous validation that finishes after a reset', async () => {
  const [register, actions] = useTablePro()
  const request = vi.fn(async () => ({ data: [], total: 0 }))
  const validation = Promise.withResolvers<void>()
  const validator = vi.fn(() => validation.promise)
  const search: TableProSearchOptions = {
    fields: [
      {
        type: 'text',
        key: 'name',
        label: 'Name',
        rules: { validator },
      },
    ],
  }
  const wrapper = mount(RTablePro, {
    props: { columns, request, search, onRegister: register, tool: false },
  })

  try {
    actions.setSearchValues({ name: 'Old' })
    const submitting = actions.submitSearch()

    await flushPromises()
    expect(validator).toHaveBeenCalledOnce()
    await actions.resetSearch()
    validation.reject(new Error('Obsolete validation'))
    expect(await submitting).toBe(false)
    expect(wrapper.text()).not.toContain('Obsolete validation')
    expect(request).toHaveBeenCalledTimes(2)
  } finally {
    wrapper.unmount()
  }
})

it('does not reload when rendering a new pagination object with the same paging state', async () => {
  const [register, actions] = useTablePro()
  const lastQuery = shallowRef<TableProParams>()
  const request = vi.fn(async (params: TableProParams) => {
    lastQuery.value = params

    return { data: [], total: 30 }
  })
  const search: TableProSearchOptions = {
    fields: [{ type: 'text', key: 'name', label: 'Name' }],
  }
  const wrapper = mount(
    defineComponent({
      setup: () => () =>
        h('section', [
          h(RTablePro, {
            columns,
            request,
            search,
            pagination: { pageSizes: [10, 20] },
            onRegister: register,
            tool: false,
          }),
          h('pre', JSON.stringify(lastQuery.value)),
        ]),
    }),
  )

  try {
    await flushPromises()
    expect(request).toHaveBeenCalledTimes(1)
    actions.setSearchValues({ name: 'Ray' })
    await actions.submitSearch()
    await flushPromises()
    expect(request).toHaveBeenCalledTimes(2)
    expect(wrapper.get('pre').text()).toBe(
      '{"name":"Ray","page":1,"pageSize":10}',
    )
  } finally {
    wrapper.unmount()
  }
})

it('notifies the owner when search, reset, and instance methods change controlled paging', async () => {
  const [register, table] = useTablePro()
  const pager = { page: 2, pageSize: 1 }
  const pagination = () => ({
    ...pager,
    'onUpdate:page': updatePage,
    'onUpdate:pageSize': updatePageSize,
  })
  const updatePage = vi.fn((page: number) => {
    pager.page = page
    void wrapper.setProps({ pagination: pagination() })
  })
  const updatePageSize = vi.fn((pageSize: number) => {
    pager.pageSize = pageSize
    void wrapper.setProps({ pagination: pagination() })
  })
  const search: TableProSearchOptions = {
    fields: [{ type: 'text', key: 'name', label: 'Name' }],
  }
  const data = [
    { id: 1, name: 'Ray' },
    { id: 2, name: 'Ray 2' },
    { id: 3, name: 'Other' },
  ]
  const wrapper = mount(RTablePro, {
    props: {
      columns,
      data,
      search,
      tool: false,
      onRegister: register,
      pagination: pagination(),
    },
  })

  try {
    table.setSearchValues({ name: 'Ray' })
    expect(await table.submitSearch()).toBe(true)
    expect(table.getCurrentPageData()).toEqual([data[0]])
    await table.setPage(2)
    expect(table.getCurrentPageData()).toEqual([data[1]])
    await table.setPageSize(2)
    expect(table.getCurrentPageData()).toEqual(data.slice(0, 2))
    await table.setPage(2)
    await table.resetSearch()
    expect(updatePage.mock.calls.flat()).toEqual([1, 2, 1, 2, 1])
    expect(updatePageSize).toHaveBeenCalledExactlyOnceWith(2)
  } finally {
    wrapper.unmount()
  }
})

it('rebuilds a local search when a compatible field changes its matcher', async () => {
  const makeSearch = (matches: () => boolean): TableProSearchOptions => ({
    fields: [{ type: 'text', key: 'name', label: 'Name', matches }],
    initialValues: { name: 'Ray' },
  })
  const data = [{ id: 1, name: 'Ray' }]
  const [register, table] = useTablePro()
  const wrapper = mount(RTablePro, {
    props: {
      columns,
      data,
      search: makeSearch(() => true),
      tool: false,
      onRegister: register,
    },
  })

  try {
    expect(table.getCurrentPageData()).toEqual(data)
    await wrapper.setProps({ search: makeSearch(() => false) })
    expect(table.getSearchValues('applied')).toEqual({ name: 'Ray' })
    expect(table.getCurrentPageData()).toEqual([])
  } finally {
    wrapper.unmount()
  }
})

it('reports visibility and row callback errors while preserving the last applied local query', async () => {
  const visibility = new Error('Visibility failed')
  const matcher = new Error('Matcher failed')
  const search: TableProSearchOptions = {
    fields: [
      {
        type: 'text',
        key: 'name',
        label: 'Name',
        visible: (values) => {
          if (values.name === 'hidden') throw visibility

          return true
        },
        matches: (cell, value) => {
          if (value === 'error') throw matcher

          return cell === value
        },
      },
    ],
    initialValues: { name: 'Ray' },
  }
  const data = [
    { id: 1, name: 'Ray' },
    { id: 2, name: 'Other' },
  ]
  const [register, table] = useTablePro()
  const wrapper = mount(RTablePro, {
    props: { columns, data, search, tool: false, onRegister: register },
  })

  try {
    for (const value of ['hidden', 'error']) {
      table.setSearchValues({ name: value })
      expect(await table.submitSearch()).toBe(false)
      await nextTick()
      expect(table.getCurrentPageData()).toEqual([data[0]])
      expect(table.getSearchValues('applied')).toEqual({ name: 'Ray' })
      expect(wrapper.get('[role="alert"]').text()).toContain("Couldn't prepare")
    }

    expect(wrapper.emitted('search-error')).toEqual([[visibility], [matcher]])
    table.setSearchValues({ name: 'Other' })
    expect(await table.submitSearch()).toBe(true)
    await nextTick()
    expect(table.getCurrentPageData()).toEqual([data[1]])
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  } finally {
    wrapper.unmount()
  }
})

it('reads nested column paths and preserves an explicit search value reader', async () => {
  const data = [
    { id: 1, customer: { name: 'Ray' }, nickname: 'Alias' },
    { id: 2, customer: { name: 'Another' }, nickname: 'Ray' },
  ]
  const [register, table] = useTablePro()
  const search: TableProSearchOptions = {
    fields: [
      { type: 'text', key: 'customer.name', label: 'Customer' },
      {
        type: 'text',
        key: 'alias',
        label: 'Alias',
        getValue: (row) => row.nickname,
      },
    ],
  }
  const wrapper = mount(RTablePro, {
    props: {
      columns: [{ key: 'customer.name', title: 'Customer' }],
      data,
      search,
      tool: false,
      onRegister: register,
    },
  })

  try {
    table.setSearchValues({ 'customer.name': 'ray', alias: 'alias' })
    expect(await table.submitSearch()).toBe(true)
    await nextTick()
    expect(table.getCurrentPageData()).toEqual([data[0]])
  } finally {
    wrapper.unmount()
  }
})
