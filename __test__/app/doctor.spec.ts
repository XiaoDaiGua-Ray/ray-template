import { runAppDoctor } from '@/doctor'
import * as localeDiagnostics from '@/doctor/locale-config'
import type { LocaleConfiguration } from '@/doctor/locale-config'

const configuration = vi.hoisted(() => ({
  options: [{ key: 'zh-CN' }, { key: 'en-US' }],
  defaultLocale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  dayjsLocales: { 'zh-CN': 'zh-cn', 'en-US': 'en' },
  defaultDayjsLocale: 'zh-cn',
}))

vi.mock('../../apps/admin/src/app-config/local-config', () => ({
  get LOCAL_OPTIONS() {
    return configuration.options
  },
  get SYSTEM_DEFAULT_LOCAL() {
    return configuration.defaultLocale
  },
  get SYSTEM_FALLBACK_LOCALE() {
    return configuration.fallbackLocale
  },
  get DAYJS_LOCAL_MAP() {
    return configuration.dayjsLocales
  },
  get DEFAULT_DAYJS_LOCAL() {
    return configuration.defaultDayjsLocale
  },
}))

beforeEach(() => {
  configuration.defaultLocale = 'zh-CN'
  configuration.fallbackLocale = 'zh-CN'
})
afterEach(() => vi.restoreAllMocks())

it('accepts a consistent immutable locale snapshot without changing it', () => {
  const input = Object.freeze({
    options: Object.freeze([{ key: 'en-US' }]),
    defaultLocale: 'en-US',
    fallbackLocale: 'en-US',
    dayjsLocales: Object.freeze({ 'en-US': 'en' }),
    defaultDayjsLocale: 'en',
  })

  expect(localeDiagnostics.getLocaleConfigIssues(input)).toEqual([])
  expect(input.options).toEqual([{ key: 'en-US' }])
})

it('reports duplicate choices and all independent membership problems together', () => {
  const input: LocaleConfiguration = {
    ...configuration,
    options: [{ key: 'en-US' }, { key: 'en-US' }, { key: 'en-US' }],
    defaultLocale: 'zh-CN',
    fallbackLocale: 'fr-FR',
    defaultDayjsLocale: 'fr',
  }
  const issues = localeDiagnostics.getLocaleConfigIssues(input)

  expect(issues).toEqual(
    expect.arrayContaining([
      'LOCAL_OPTIONS contains duplicate locale "en-US".',
      'SYSTEM_DEFAULT_LOCAL "zh-CN" is missing from LOCAL_OPTIONS.',
      'SYSTEM_FALLBACK_LOCALE "fr-FR" is missing from LOCAL_OPTIONS.',
      'DAYJS_LOCAL_MAP locale "zh-CN" is missing from LOCAL_OPTIONS.',
      'DEFAULT_DAYJS_LOCAL "fr" is missing from DAYJS_LOCAL_MAP values.',
    ]),
  )
  expect(issues).toHaveLength(5)
})

it('finds a selectable language that has no date-locale mapping', () => {
  expect(
    localeDiagnostics.getLocaleConfigIssues({
      ...configuration,
      dayjsLocales: { 'zh-CN': 'zh-cn' },
    }),
  ).toEqual(['DAYJS_LOCAL_MAP is missing locale "en-US" from LOCAL_OPTIONS.'])
})

it('reports configuration warnings locally and inspects fresh state on each mount', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

  configuration.defaultLocale = 'missing'
  expect(() => runAppDoctor()).not.toThrow()
  expect(warn).toHaveBeenCalledExactlyOnceWith(
    '[Ray Admin doctor] SYSTEM_DEFAULT_LOCAL "missing" is missing from LOCAL_OPTIONS.',
  )
  configuration.defaultLocale = 'zh-CN'
  warn.mockClear()
  runAppDoctor()
  expect(warn).not.toHaveBeenCalled()
})

it('contains an unexpected diagnostic exception instead of rejecting application startup', () => {
  const error = new Error('diagnostic failed')
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

  vi.spyOn(localeDiagnostics, 'getLocaleConfigIssues').mockImplementationOnce(
    () => {
      throw error
    },
  )
  expect(() => runAppDoctor()).not.toThrow()
  expect(warn).toHaveBeenCalledExactlyOnceWith(
    '[Ray Admin doctor] Locale diagnostics could not complete.',
    error,
  )
})
