import { resolve } from 'node:path'
import { flushPromises, mount } from '@vue/test-utils'
import barcode from 'jsbarcode'
import { compile } from 'sass'
import { reactive } from 'vue'
import { RBarcode } from '../../packages/ui/src/RBarcode'

vi.mock('jsbarcode', () => ({ default: vi.fn() }))

beforeEach(() => vi.mocked(barcode).mockClear())

it('keeps the fixed dimension on either responsive axis', async () => {
  const style = document.createElement('style')

  style.textContent = compile(
    resolve('packages/ui/src/RBarcode/src/index.scss'),
  ).css
  document.head.append(style)
  const wrapper = mount(RBarcode, {
    attachTo: document.body,
    props: { text: '123', responsive: true, width: 'responsive', height: 48 },
  })

  try {
    const canvas = wrapper.get('canvas').element

    expect(getComputedStyle(canvas).height).toBe('48px')
    await wrapper.setProps({ width: 96, height: 'responsive' })
    expect(getComputedStyle(canvas).width).toBe('96px')
  } finally {
    wrapper.unmount()
    style.remove()
  }
})

it('redraws changed format, options and renderer without changing text', async () => {
  const options = reactive({ lineColor: '#123456' })
  const wrapper = mount(RBarcode, { props: { text: '123456', options } })

  try {
    await flushPromises()
    expect(barcode).toHaveBeenCalledTimes(1)
    await wrapper.setProps({ format: 'CODE39' })
    expect(barcode).toHaveBeenLastCalledWith(
      expect.any(HTMLCanvasElement),
      '123456',
      expect.objectContaining({ format: 'CODE39' }),
    )
    options.lineColor = '#abcdef'
    await flushPromises()
    expect(barcode).toHaveBeenLastCalledWith(
      expect.any(HTMLCanvasElement),
      '123456',
      expect.objectContaining({ lineColor: '#abcdef' }),
    )
    await wrapper.setProps({ barcodeRender: 'svg' })
    expect(vi.mocked(barcode).mock.lastCall?.[0]).toBe(
      wrapper.get('svg').element,
    )
  } finally {
    wrapper.unmount()
  }
})

it('honors watchText and resumes with the latest value when enabled', async () => {
  const wrapper = mount(RBarcode, { props: { text: '123', watchText: false } })

  try {
    await flushPromises()
    const count = vi.mocked(barcode).mock.calls.length

    await wrapper.setProps({ text: '456' })
    expect(barcode).toHaveBeenCalledTimes(count)
    await wrapper.setProps({ watchText: true })
    expect(barcode).toHaveBeenLastCalledWith(
      expect.anything(),
      '456',
      expect.anything(),
    )
  } finally {
    wrapper.unmount()
  }
})
