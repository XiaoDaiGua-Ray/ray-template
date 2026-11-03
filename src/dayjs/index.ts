import { DEFAULT_DAYJS_LOCAL } from '@/app-config'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { APP_CATCH_KEY, DAYJS_LOCAL_MAP } from '@/app-config'
import type { SettingState } from '@/store/modules/setting/types'
import { getStorage } from '@/utils/cache'

/**
 *
 * @description
 * vue 挂载之前初始化 dayjs。
 *
 * 初始化 dayjs 的语言环境。
 */
export const setupDayjs = () => {
  const setting = getStorage<SettingState>(
    APP_CATCH_KEY.appPiniaSettingStore,
    'localStorage',
  )
  const local =
    DAYJS_LOCAL_MAP[setting?.localeLanguage as keyof typeof DAYJS_LOCAL_MAP] ||
    DEFAULT_DAYJS_LOCAL

  dayjs.locale(local)
}
