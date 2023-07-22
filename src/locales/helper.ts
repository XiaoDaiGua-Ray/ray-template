/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-05-19
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 国际化辅助方法:
 *   - combineI18nMessages: 合并对应文件下语言包
 *   - getAppLocalMessages: 获取所有语言
 */

import { set } from 'lodash-es'
import { zhCN, dateZhCN } from 'naive-ui' // 导入 `naive ui` 中文包
import { getStorage } from '@use-utils/cache'
import { SYSTEM_DEFAULT_LOCAL } from '@/appConfig/localConfig'
import { APP_CATCH_KEY } from '@/appConfig/appConfig'

import type { Recordable } from '@/types/modules/helper'
import type {
  AppLocalesModules,
  AppLocalesDropdownMixedOption,
  AppCurrentAppMessages,
  I18nModules,
} from '@/locales/type'

/**
 *
 * @param langs 语言包
 * @param prefix 语言包前缀
 *
 * @remark 合并处理语言包内容, prefix 必填
 */
export const combineI18nMessages = (langs: I18nModules, prefix: string) => {
  if (typeof prefix !== 'string' || !prefix.trim()) {
    throw new Error('Expected prefix to be a non-empty string')
  }

  const langsGather: Record<string, Recordable> = {}

  Object.keys(langs).forEach((key) => {
    const langFileModule = langs[key].default

    let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '')
    const lastIndex = fileName.lastIndexOf('.')

    fileName = fileName.substring(0, lastIndex)

    const keyList = fileName.split('/')
    const moduleName = keyList.shift()
    const objKey = keyList.join('.')

    if (moduleName) {
      if (objKey) {
        set(langsGather, moduleName, langsGather[moduleName] || {})
        set(langsGather[moduleName], objKey, langFileModule)
      } else {
        set(langsGather, moduleName, langFileModule || {})
      }
    }
  })

  return langsGather
}

/** 获取所有语言 */
export const getAppLocalMessages = async (
  LOCAL_OPTIONS: AppLocalesDropdownMixedOption[],
) => {
  const message = {} as AppCurrentAppMessages

  for (const curr of LOCAL_OPTIONS) {
    const msg: AppLocalesModules = await import(`./lang/${curr.key}.ts`)
    const key = curr.key

    if (key) {
      message[key] = msg?.default?.message ?? {}
    }
  }

  return message
}

/**
 *
 * @param key 切换对应语言
 * @returns 组件库对应语言包
 *
 * @remark 受打包体积影响. 如果有新的语言添加, 则需要手动引入对应语言包(https://www.naiveui.com/zh-CN/dark/docs/i18n)
 * @remark naive ui 默认为英文
 *
 * 该方法的比对 key 必须与 LOCAL_OPTIONS 一一对应
 */
export const naiveLocales = (key: string) => {
  switch (key) {
    case 'zh-CN':
      return {
        locale: zhCN,
        dateLocal: dateZhCN,
      }

    case 'en-US':
      return {
        locale: null,
        dateLocal: null,
      }

    default:
      return {
        locale: zhCN,
        dateLocal: dateZhCN,
      }
  }
}

/**
 *
 * @returns 获取当前环境默认语言
 *
 * @remak 未避免出现加载语言错误问题, 故而在 `main.ts` 注册时, 应优先加载 `i18n` 避免出现该问题
 */
export const getAppDefaultLanguage = () => {
  const language = getStorage<string>(
    APP_CATCH_KEY.localeLanguage,
    'localStorage',
    SYSTEM_DEFAULT_LOCAL,
  )

  return language as keyof AppCurrentAppMessages
}
