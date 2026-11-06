import { arrayBufferToBase64Image } from '../../apps/admin/src/utils/basic'

describe('arrayBufferToBase64Image', () => {
  const arrayBuffer = new ArrayBuffer(8)
  const base64ImagePrefix = 'data:image/png;base64,'

  it('should convert array buffer to base64 image', () => {
    const base64Image = arrayBufferToBase64Image(arrayBuffer)

    expect(base64Image).toBe(`${base64ImagePrefix}AAAAAAAAAAA=`)
  })

  it('should convert array buffer to base64 image with prefix', () => {
    const base64Image = arrayBufferToBase64Image(arrayBuffer)

    expect(base64Image.startsWith(base64ImagePrefix)).toBe(true)
  })
})

it('preserves byte values across chunk boundaries for a large buffer', () => {
  const bytes = Uint8Array.from({ length: 262145 }, (_, index) => index % 256)

  expect(arrayBufferToBase64Image(bytes.buffer)).toBe(
    'data:image/png;base64,' + Buffer.from(bytes).toString('base64'),
  )
  expect(arrayBufferToBase64Image(new ArrayBuffer(0))).toBe(
    'data:image/png;base64,',
  )
})

it('keeps a compatible encoding path when native typed-array Base64 is unavailable', () => {
  const descriptor = Object.getOwnPropertyDescriptor(
    Uint8Array.prototype,
    'toBase64',
  )

  // eslint-disable-next-line no-extend-native -- 模拟缺少原生 API 的浏览器，finally 恢复描述符。
  Object.defineProperty(Uint8Array.prototype, 'toBase64', {
    configurable: true,
    value: void 0,
  })

  try {
    const bytes = Uint8Array.from({ length: 65539 }, (_, index) => index % 256)

    expect(arrayBufferToBase64Image(bytes.buffer)).toBe(
      'data:image/png;base64,' + Buffer.from(bytes).toString('base64'),
    )
  } finally {
    if (descriptor)
      // eslint-disable-next-line no-extend-native -- 恢复测试前的原生描述符。
      Object.defineProperty(Uint8Array.prototype, 'toBase64', descriptor)
    else Reflect.deleteProperty(Uint8Array.prototype, 'toBase64')
  }
})
