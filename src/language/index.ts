/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2022-12-08
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 注册 `vue-i18n`
 *
 * 预设 `localeLanguage` 作为缓存 `key`
 *
 * 预设中文作为基础语言
 *
 * `naive ui` 语言包切换
 *
 * 注意:
 *   - 因使用 `i18n` 提供虚拟文件注入缘故, 每次修改 `locales` 中的文件后, 需要重启项目
 *   - 建议按照主流约定语言包命名
 */

import { createI18n } from 'vue-i18n'

import { naiveLocales } from './language'
import { getCache } from '@use-utils/cache'

export { naiveLocales, localOptions } from './language'

import type { App } from 'vue'

/**
 *
 * @returns 整合后的语言包
 *
 * @remark 自动归并 locales 下所有 json 语言包, 需要注意语言包名称问题(必须统一)
 * @remark 注意 key 的重复问题, 如果需要多模块区分语言包, 则需要保证 key 的唯一性, 否则会被覆盖
 */
export const getMatchLanguageModule = () => {
  const msg = {}
  const reg = /([^\\/]+)\.json$/i

  try {
    const modules = import.meta.glob('../../locales/**', {
      eager: true,
      as: 'raw',
    })

    const moduleKeys = Object.keys(modules)
    moduleKeys.forEach((curr) => {
      const k = curr.match(reg)?.[1] as string

      msg[k] = Object.assign({}, JSON.parse(modules[curr]))
    })
  } catch (e) {
    console.error(e)
  }

  return msg
}

/**
 *
 * @returns 获取当前环境默认语言
 *
 * @remak 未避免出现加载语言错误问题, 故而在 `main.ts` 注册时, 应优先加载 `i18n` 避免出现该问题
 */
export const getDefaultLocal = () => {
  const catchLanguage = getCache('localeLanguage', 'localStorage')

  const locale: string = catchLanguage !== 'no' ? catchLanguage : 'zh-CN'

  return locale
}

export const setupI18n = (app: App<Element>) => {
  const locale = getDefaultLocal()

  const i18n = createI18n({
    locale,
    allowComposition: true,
    messages: getMatchLanguageModule(),
  })

  app.use(i18n)
}

/**
 *
 * @returns 当前环境语言组件库语言包
 *
 * @remark 获取默认语言包
 */
export const getDefaultNaiveLocal = () => {
  const local = getDefaultLocal()

  return naiveLocales(local)
}
