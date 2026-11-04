import { DAYJS_LOCAL_MAP, DEFAULT_DAYJS_LOCAL } from '@/app-config'
import type { DayjsLocalMap } from '@/types'
import { createDayjsTools } from '@ray-template/composables/useDayjs'

export type {
  FormatOption,
  DateRange,
  StartAndEndOfDay,
  UseDayjsReturnType,
} from '@ray-template/composables/useDayjs'
export type LocalKey = keyof DayjsLocalMap
export const useDayjs = () =>
  createDayjsTools(DAYJS_LOCAL_MAP, DEFAULT_DAYJS_LOCAL, true)
