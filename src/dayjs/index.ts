import dayjs from 'dayjs'
import { DEFAULT_DAYJS_LOCAL } from '@/app-config'
import 'dayjs/locale/zh-cn'
import { getStorage } from '@/utils'
import { APP_CATCH_KEY, DAYJS_LOCAL_MAP } from '@/app-config'

import type { SettingState } from '@/store/modules/setting/types'

/**
 *
 * @description
 * vue 挂载之前初始化 dayjs。
 *
 * 初始化 dayjs 的语言环境。
 */
export const setupDayjs = () => {
  const { localeLanguage } = getStorage<SettingState>(
    APP_CATCH_KEY.appPiniaSettingStore,
    'localStorage',
    {
      defaultValue: {} as SettingState,
    },
  )
  const local =
    DAYJS_LOCAL_MAP[localeLanguage as keyof typeof DAYJS_LOCAL_MAP] ||
    DEFAULT_DAYJS_LOCAL

  dayjs.locale(local)
}
