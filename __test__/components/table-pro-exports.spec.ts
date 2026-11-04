import { RTablePro } from '@/components/RTablePro'
import type { TableProInst } from '@/components/RTablePro'
import { mount } from '@vue/test-utils'
import type { DataTableColumn } from 'naive-ui'
import { buildTableCsv } from '../../packages/ui/src/RTablePro/src/csv'
import * as printing from '../../packages/ui/src/RTablePro/src/printing'

afterEach(() => vi.restoreAllMocks())

it('prints every row from the active page, even with virtual rows, without UI chrome', async () => {
  const print = vi.spyOn(printing, 'printTableContent').mockResolvedValue(true)
  const wrapper = mount(RTablePro, {
    props: {
      data: Array.from({ length: 24 }, (_, id) => ({
        id,
        name: `Person ${id}`,
      })),
      columns: [{ type: 'selection' }, { key: 'name', title: 'Name' }],
      search: [{ key: 'name', label: 'Search name' }],
      autoHeight: true,
      virtualScroll: true,
      pageSize: 12,
    },
    slots: { tableFooter: 'Only on screen' },
  })

  try {
    const instance = wrapper.vm as unknown as TableProInst

    await instance.setPage(2)
    expect(await instance.print()).toBe(true)

    const content = print.mock.calls[0][0]

    expect(content.tagName).toBe('TABLE')
    expect(content.querySelectorAll('th')).toHaveLength(1)
    expect(content.querySelectorAll('tbody tr')).toHaveLength(12)
    expect(content.querySelector('tbody tr')?.textContent).toBe('Person 12')
    expect(content.textContent).not.toMatch(
      /Search name|Only on screen|Person 11/,
    )
  } finally {
    wrapper.unmount()
  }
})

it('prints only the chosen region and leaves the source untouched', async () => {
  const print = vi.spyOn(printing, 'printTableContent').mockResolvedValue(true)
  const target = document.createElement('section')

  target.innerHTML =
    '<h2>Summary</h2><button onclick="alert(1)">Screen action</button>'
  const wrapper = mount(RTablePro, {
    props: { data: [{ id: 1 }], columns: [{ key: 'id', title: 'ID' }] },
  })

  try {
    const instance = wrapper.vm as unknown as TableProInst

    expect(
      await instance.print({ target: () => target, title: 'Report' }),
    ).toBe(true)
    expect(await instance.print({ target: () => null })).toBe(false)
    expect(print).toHaveBeenCalledTimes(1)
    const [content, options] = print.mock.calls[0]

    expect(content.querySelector('h2')?.textContent).toBe('Summary')
    expect(content.querySelector('button')?.hasAttribute('onclick')).toBe(false)
    expect(content.querySelector('table')).toBeNull()
    expect(target.querySelector('button')?.hasAttribute('onclick')).toBe(true)
    expect(options.title).toBe('Report')
  } finally {
    wrapper.unmount()
  }
})

it('exports group children with correct CSV escaping and neutralizes formula text', () => {
  const columns: DataTableColumn[] = [
    { type: 'selection' },
    {
      key: 'group',
      children: [
        { key: 'name', title: 'Name' },
        { key: 'note', title: 'Note' },
        { key: 'private', title: 'Private', allowExport: false },
      ],
    },
    { key: 'score', title: 'Score' },
  ]

  expect(
    buildTableCsv(columns, [
      { name: 'A, "B"', note: '=2+2', score: -2 },
      { name: 'Array value', note: ['=2+2', 'text'], score: -2n },
    ]),
  ).toBe(
    '"Name","Note","Score"\r\n"A, ""B""","\'=2+2","-2"\r\n"Array value","\'=2+2,text","-2"',
  )
})
