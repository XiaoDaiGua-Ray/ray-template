import {
  DAYJS_LOCAL_MAP,
  DEFAULT_DAYJS_LOCAL,
  LOCAL_OPTIONS,
  SYSTEM_DEFAULT_LOCAL,
  SYSTEM_FALLBACK_LOCALE,
} from '../app-config/local-config'
import { getLocaleConfigIssues } from './locale-config'

/**
 *
 * @description
 * 在开发环境的应用挂载完成后报告语言配置问题；调用入口负责 __DEV__ 判断。
 * 诊断与启动失败分开处理，不抛出配置错误，也不持有异步任务或跨挂载状态。
 */
export const runAppDoctor = () => {
  try {
    const issues = getLocaleConfigIssues({
      options: LOCAL_OPTIONS,
      defaultLocale: SYSTEM_DEFAULT_LOCAL,
      fallbackLocale: SYSTEM_FALLBACK_LOCALE,
      dayjsLocales: DAYJS_LOCAL_MAP,
      defaultDayjsLocale: DEFAULT_DAYJS_LOCAL,
    })

    for (const issue of issues) console.warn(`[Ray Admin doctor] ${issue}`)
  } catch (error) {
    console.warn(
      '[Ray Admin doctor] Locale diagnostics could not complete.',
      error,
    )
  }
}
