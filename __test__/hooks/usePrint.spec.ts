import print from 'print-js'
import { usePrint } from '../../src/hooks/web/usePrint'

vi.mock('print-js', () => ({ default: vi.fn() }))

beforeEach(() => vi.clearAllMocks())

it('skips a missing target and prints the latest element in html mode', () => {
  const target = ref<HTMLElement>()
  const printer = usePrint(target)

  printer.print()
  expect(print).not.toHaveBeenCalled()
  target.value = document.createElement('div')
  printer.print()
  expect(print).toHaveBeenCalledExactlyOnceWith({
    printable: target.value,
    type: 'html',
  })
})

it('uses the caller’s print mode but never accepts a second printable value', () => {
  const printer = usePrint('/report.pdf', {
    printable: '/wrong.pdf',
    type: 'pdf',
  } as never)

  printer.print()

  expect(print).toHaveBeenCalledExactlyOnceWith({
    printable: '/report.pdf',
    type: 'pdf',
  })
})

it('converts binary PDF and image targets to the payloads print-js expects', async () => {
  await usePrint(new Uint8ClampedArray([1, 2, 3])).print()
  await usePrint(new Blob(['abc'], { type: 'image/png' })).print()

  expect(vi.mocked(print).mock.calls).toEqual([
    [{ printable: 'AQID', base64: true, type: 'pdf' }],
    [{ printable: 'data:image/png;base64,YWJj', base64: false, type: 'image' }],
  ])
})
