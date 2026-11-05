import { RTablePro } from '@/components/RTablePro'
import type { TableProInst } from '@/components/RTablePro'
import { flushPromises, mount } from '@vue/test-utils'
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

it('copies current form values into custom print content without copying credentials', () => {
  const target = document.createElement('section')

  target.innerHTML =
    '<input value="default"><input type="checkbox"><textarea>old</textarea><select><option>A</option><option>B</option></select><input type="password" value="placeholder">'
  target.querySelector('input')!.value = 'edited'
  target.querySelector<HTMLInputElement>('[type="checkbox"]')!.checked = true
  target.querySelector('textarea')!.value = 'new'
  target.querySelector('select')!.value = 'B'
  target.querySelector<HTMLInputElement>('[type="password"]')!.value = 'private'

  const clone = printing.resolvePrintContent({ target }, () => null)!

  expect(clone.querySelector('input')?.value).toBe('edited')
  expect(
    clone.querySelector<HTMLInputElement>('[type="checkbox"]')?.checked,
  ).toBe(true)
  expect(clone.querySelector('textarea')?.value).toBe('new')
  expect(clone.querySelector('select')?.value).toBe('B')
  expect(
    clone.querySelector<HTMLInputElement>('[type="password"]')?.value,
  ).toBe('')
  expect(
    target.querySelector<HTMLInputElement>('[type="password"]')?.value,
  ).toBe('private')
})

it('shares page styles with a custom print frame and removes it after printing', async () => {
  const target = document.createElement('section')
  const stylesheet = document.createElement('style')

  target.className = 'print-fixture'
  stylesheet.textContent = '.print-fixture { color: rebeccapurple; }'
  document.head.append(stylesheet)
  const append = document.body.append.bind(document.body)

  vi.spyOn(document.body, 'append').mockImplementation((...nodes) => {
    for (const node of nodes)
      if (node instanceof HTMLIFrameElement) node.srcdoc = '<!doctype html>'

    append(...nodes)
  })

  const printDocument = document.implementation.createHTMLDocument()
  const printWindow = Object.assign(new EventTarget(), {
    focus: vi.fn(),
    print: vi.fn(() => {
      expect(document.querySelector('iframe')).not.toBeNull()
      expect(printDocument.head.textContent).toContain('rebeccapurple')
      printWindow.dispatchEvent(new Event('afterprint'))
    }),
  })

  vi.spyOn(HTMLIFrameElement.prototype, 'contentWindow', 'get').mockReturnValue(
    printWindow as unknown as Window,
  )
  vi.spyOn(
    HTMLIFrameElement.prototype,
    'contentDocument',
    'get',
  ).mockReturnValue(printDocument)

  try {
    expect(
      await printing.printTableContent(target.cloneNode(true) as HTMLElement, {
        target,
      }),
    ).toBe(true)
    expect(printWindow.print).toHaveBeenCalledOnce()
    expect(document.querySelector('iframe')).toBeNull()
  } finally {
    stylesheet.remove()
    document.querySelector('iframe')?.remove()
  }
})

it('cancels a print still preparing when the request scope changes', async () => {
  const print = vi.spyOn(printing, 'printTableContent').mockImplementation(
    (_content, _options, signal) =>
      new Promise((resolve) => {
        signal?.addEventListener('abort', () => resolve(false), { once: true })
      }),
  )
  const wrapper = mount(RTablePro, {
    props: {
      columns: [{ key: 'name', title: 'Name' }],
      params: { account: 'a' },
      request: async ({ account }) => ({
        data: [{ id: 1, name: account }],
        total: 1,
      }),
    },
  })

  try {
    await flushPromises()
    const table = wrapper.vm as unknown as TableProInst
    const preview = table.print()

    expect(print).toHaveBeenCalledOnce()
    await wrapper.setProps({ params: { account: 'b' } })
    expect(print.mock.calls[0][2]?.aborted).toBe(true)
    expect(await preview).toBe(false)
  } finally {
    wrapper.unmount()
  }
})
