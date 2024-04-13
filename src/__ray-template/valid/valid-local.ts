import {
  LOCAL_OPTIONS,
  SYSTEM_DEFAULT_LOCAL,
  SYSTEM_FALLBACK_LOCALE,
  DAYJS_LOCAL_MAP,
  DEFAULT_DAYJS_LOCAL,
} from '@/app-config'

/**
 *
 * @description
 * 获取所有的 LOCAL_OPTIONS 的 key。
 */
const getLocalOptionKeys = () => {
  return LOCAL_OPTIONS.map((curr) => curr.key)
}

/**
 *
 * @description
 * 验证 SYSTEM_DEFAULT_LOCAL 是否在 LOCAL_OPTIONS 中。
 */
const validSystemDefaultLocal = () => {
  const localOptionKeys = getLocalOptionKeys()

  if (!localOptionKeys.includes(SYSTEM_DEFAULT_LOCAL)) {
    throw new Error(
      `[validLocal validSystemDefaultLocal:] SYSTEM_DEFAULT_LOCAL: '${SYSTEM_DEFAULT_LOCAL}' is not in LOCAL_OPTIONS: [${localOptionKeys.join(
        ', ',
      )}]`,
    )
  }
}

/**
 *
 * @description
 * 验证 SYSTEM_FALLBACK_LOCALE 是否在 LOCAL_OPTIONS 中。
 */
const validSystemFallbackLocale = () => {
  const localOptionKeys = getLocalOptionKeys()

  if (!localOptionKeys.includes(SYSTEM_FALLBACK_LOCALE)) {
    throw new Error(
      `[validLocal validSystemFallbackLocale:] SYSTEM_FALLBACK_LOCALE: '${SYSTEM_FALLBACK_LOCALE}' is not in LOCAL_OPTIONS: [${localOptionKeys.join(
        ', ',
      )}]`,
    )
  }
}

/**
 *
 * @description
 * 验证 DAYJS_LOCAL_MAP 是否在 LOCAL_OPTIONS 中。
 */
const validDayjsLocalMap = () => {
  const localOptionKeys = getLocalOptionKeys() as string[]
  const dayjsLocalKeys = Object.keys(DAYJS_LOCAL_MAP)

  dayjsLocalKeys.forEach((key) => {
    if (!localOptionKeys.includes(key)) {
      throw new Error(
        `[validLocal validDayjsLocalMap:] DAYJS_LOCAL_MAP: '${key}' is not in LOCAL_OPTIONS: [${localOptionKeys.join(
          ', ',
        )}]`,
      )
    }
  })
}

/**
 *
 * @description
 * 验证 DEFAULT_DAYJS_LOCAL 是否在 DAYJS_LOCAL_MAP 中。
 */
const validDefaultDayjsLocal = () => {
  const dayjsLocalKeys = Object.values(DAYJS_LOCAL_MAP)

  if (!dayjsLocalKeys.includes(DEFAULT_DAYJS_LOCAL)) {
    throw new Error(
      `[validLocal validDefaultDayjsLocal:] DEFAULT_DAYJS_LOCAL: '${DEFAULT_DAYJS_LOCAL}' is not in DAYJS_LOCAL_MAP: [${dayjsLocalKeys.join(
        ', ',
      )}]`,
    )
  }
}

/**
 *
 * @description
 * 验证所有的 localConfig 相关的配置。
 */
export const validLocal = async () => {
  validSystemDefaultLocal()
  validSystemFallbackLocale()
  validDayjsLocalMap()
  validDefaultDayjsLocal()
}
