import { AES, enc } from 'crypto-js'
import { decrypt, encrypt } from '../../apps/admin/src/utils/legacy-crypto'

describe('legacy AES JSON format', () => {
  afterEach(() => vi.restoreAllMocks())

  it('reads a fixed legacy OpenSSL ciphertext and writes compatible passphrase data', () => {
    const ciphertext =
      'U2FsdGVkX18AAQIDBAUGBy60iFpMmTEA+nDHjARaQ1CAs63rZpKJyAVJoCv34SKp'
    const key = 'test-passphrase'
    const value = { name: 'Ray', active: true }

    expect(decrypt(ciphertext, key)).toEqual(value)
    expect(
      JSON.parse(AES.decrypt(encrypt(value, key), key).toString(enc.Utf8)),
    ).toEqual(value)
    expect(decrypt(encrypt({ text: '旧缓存' }))).toEqual({ text: '旧缓存' })
  })

  it('writes a unique IV per raw key encryption and accepts direct CipherParams', () => {
    const key = enc.Hex.parse('00112233445566778899aabbccddeeff')
    const value = { entries: [0, false, null, '中文'] }
    const first = encrypt(value, key)
    const second = encrypt(value, key)

    expect(first).toMatch(/^[0-9a-f]{32}:/)
    expect(first.split(':')[0]).not.toBe(second.split(':')[0])
    expect(decrypt(first, key)).toEqual(value)
    const iv = enc.Hex.parse('000102030405060708090a0b0c0d0e0f')

    expect(
      decrypt(AES.encrypt(JSON.stringify(value), key, { iv }), key),
    ).toEqual(value)
  })

  it('rejects unserializable input and returns undefined for corrupt ciphertext', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => encrypt(void 0)).toThrow(TypeError)
    expect(decrypt('corrupt', 'test-passphrase')).toBeUndefined()
    expect(
      decrypt('no iv', enc.Hex.parse('00112233445566778899aabbccddeeff')),
    ).toBeUndefined()
    expect(console.error).toHaveBeenCalledTimes(2)
  })
})
