import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import { NDataTable, NDropdown } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'
import { RTablePro } from '../../packages/ui/src/RTablePro'
import type { TableProRequest } from '../../packages/ui/src/RTablePro'
import * as csv from '../../packages/ui/src/RTablePro/src/csv'
import * as printing from '../../packages/ui/src/RTablePro/src/printing'

const columns = [{ key: 'name', title: 'Name' }]
const data = [{ id: 1, name: 'Ray' }]

afterEach(() => vi.restoreAllMocks())

it.each([void 0, 'small', 'medium', 'large'] as const)(
  'checks the effective density before any interaction when size is %s',
  (size) => {
    const wrapper = mount(RTablePro, { props: { columns, data, size } })

    try {
      const density = wrapper
        .getComponent(NDropdown)
        .props('options')
        ?.find((option) => option.key === 'density') as DropdownOption
      const choices = density.children as DropdownOption[]
      const expected = size ?? 'medium'

      expect(wrapper.getComponent(NDataTable).props('size')).toBe(expected)
      expect(
        choices
          .filter((option) => option.props?.['aria-checked'])
          .map((option) => option.key),
      ).toEqual([`density:${expected}`])
    } finally {
      wrapper.unmount()
    }
  },
)

it('hides print by default and groups secondary actions under one menu', async () => {
  const wrapper = mount(RTablePro, { props: { columns, data } })

  try {
    const menu = wrapper.getComponent(NDropdown)
    const keys = menu.props('options')?.map((option) => option.key)

    expect(keys).toContain('csv')
    expect(keys).toContain('density')
    expect(keys).not.toContain('print')
    expect(wrapper.find('[aria-label="Print table"]').exists()).toBe(false)
    expect(
      wrapper.get('[aria-label="More actions"]').attributes('aria-haspopup'),
    ).toBe('menu')
    await wrapper.get('[aria-label="More actions"]').trigger('click')
    await flushPromises()
    expect(document.body.textContent).not.toContain('Print table')
  } finally {
    wrapper.unmount()
  }
})

it('opts into menu printing and retains CSV formatting and output options', async () => {
  const download = vi
    .spyOn(csv, 'downloadTableCsv')
    .mockImplementation(() => {})
  const print = vi.spyOn(printing, 'printTableContent').mockResolvedValue(true)
  const wrapper = mount(RTablePro, {
    props: {
      columns,
      data,
      showPrint: true,
      downloadCsvTableOptions: { fileName: 'people' },
      printTableOptions: { title: 'People report' },
      getCsvCell: (value) => `Person: ${String(value)}`,
    },
  })

  try {
    const menu = wrapper.getComponent(NDropdown)

    expect(
      menu.props('options')?.some((option) => option.key === 'print'),
    ).toBe(true)
    menu.vm.$emit('select', 'csv')
    await flushPromises()
    expect(download).toHaveBeenCalledExactlyOnceWith(
      '"Name"\r\n"Person: Ray"',
      'people',
    )
    menu.vm.$emit('select', 'print')
    await flushPromises()
    expect(print).toHaveBeenCalledOnce()
    expect(print.mock.calls[0][1]).toMatchObject({ title: 'People report' })
    await wrapper.setProps({ showPrint: false })
    expect(
      menu.props('options')?.some((option) => option.key === 'print'),
    ).toBe(false)
    menu.vm.$emit('select', 'print')
    await flushPromises()
    expect(print).toHaveBeenCalledOnce()
  } finally {
    wrapper.unmount()
  }
})

it('updates density and appearance without changing caller defaults', async () => {
  const wrapper = mount(RTablePro, {
    props: { columns, data, size: 'medium', striped: false, bordered: true },
  })

  try {
    const menu = wrapper.getComponent(NDropdown)

    menu.vm.$emit('select', 'density:small')
    menu.vm.$emit('select', 'striped')
    menu.vm.$emit('select', 'bordered')
    await flushPromises()
    expect(wrapper.getComponent(NDataTable).props()).toMatchObject({
      size: 'small',
      striped: true,
      bordered: false,
    })
    expect(wrapper.props()).toMatchObject({
      size: 'medium',
      striped: false,
      bordered: true,
    })
    await wrapper.setProps({ size: 'large' })
    expect(wrapper.getComponent(NDataTable).props('size')).toBe('large')
    await wrapper.setProps({ size: void 0 })
    expect(wrapper.getComponent(NDataTable).props('size')).toBe('medium')
    const density = menu
      .props('options')
      ?.find((option) => option.key === 'density') as DropdownOption

    expect(
      (density.children as DropdownOption[])
        .filter((option) => option.props?.['aria-checked'])
        .map((option) => option.key),
    ).toEqual(['density:medium'])
  } finally {
    wrapper.unmount()
  }
})

it('keeps appearance icons visible when checked or unchecked', async () => {
  const wrapper = mount(RTablePro, {
    props: {
      columns,
      data,
      size: 'medium',
      striped: false,
      bordered: true,
      showPrint: true,
    },
  })
  const page = new DOMWrapper(document.body)
  const openMenu = async () => {
    await wrapper.get('[aria-label="More actions"]').trigger('click')
    await vi.dynamicImportSettled()
    await flushPromises()
  }
  const appearanceOption = (label: string) =>
    page
      .findAll('[role="menuitemcheckbox"]')
      .find((option) => option.text().includes(label))!

  try {
    await openMenu()

    for (const label of ['Table density', 'Export CSV', 'Print table']) {
      const option = page
        .findAll('.n-dropdown-option-body')
        .find((option) => option.text().includes(label))!

      expect(option.get('svg').html()).toContain('<path')
    }

    for (const [label, initial] of [
      ['Striped rows', false],
      ['Table border', true],
    ] as const) {
      const option = appearanceOption(label)
      const icon = option.get('.n-dropdown-option-body__prefix svg').html()

      expect(icon).toContain('<path')
      expect(option.attributes('aria-checked')).toBe(String(initial))
      expect(option.get('.r-table-action-label__check').text()).toBe(
        initial ? '✓' : '',
      )
      await option.trigger('click')
      await flushPromises()
      await openMenu()
      const updated = appearanceOption(label)

      expect(updated.attributes('aria-checked')).toBe(String(!initial))
      expect(updated.get('.r-table-action-label__check').text()).toBe(
        initial ? '' : '✓',
      )
      expect(updated.get('.n-dropdown-option-body__prefix svg').html()).toBe(
        icon,
      )
    }
  } finally {
    wrapper.unmount()
  }
})

it('refreshes the current remote query and preserves the caller toolbar when tools are disabled', async () => {
  const request = vi.fn<TableProRequest>(async () => ({ data, total: 1 }))
  const wrapper = mount(RTablePro, {
    props: { columns, request },
    slots: { toolbar: 'Business action' },
  })

  try {
    await flushPromises()
    expect(request).toHaveBeenCalledOnce()
    await wrapper.get('[aria-label="Refresh"]').trigger('click')
    await flushPromises()
    expect(request).toHaveBeenCalledTimes(2)
    expect(request.mock.lastCall?.[0]).toEqual(request.mock.calls[0][0])
    expect(request.mock.lastCall?.[1]).not.toBe(request.mock.calls[0][1])
    expect(wrapper.get('.r-table__business-actions').text()).toBe(
      'Business action',
    )
    await wrapper.setProps({ tool: false })
    expect(wrapper.find('.r-table__utilities').exists()).toBe(false)
    expect(wrapper.get('.r-table__business-actions').text()).toBe(
      'Business action',
    )
  } finally {
    wrapper.unmount()
  }
})
