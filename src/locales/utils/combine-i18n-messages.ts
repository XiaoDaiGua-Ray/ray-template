import type { I18nModules } from '@/locales/types'
import type { Recordable } from '@/types'
import { set } from 'lodash-es'

/**
 *
 * @param langs 语言包
 * @param prefix 语言包前缀
 *
 * @description
 * 合并处理 lang 下指定的语言包。
 *
 * @example
 * const messages = combineI18nMessages(modules, 'zh-CN')
 */
export const combineI18nMessages = (langs: I18nModules, prefix: string) => {
  if (typeof prefix !== 'string' || !prefix.trim()) {
    throw new TypeError('Expected prefix to be a non-empty string')
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
