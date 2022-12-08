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

import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages' // 导入所有语言包
import { zhCN, dateZhCN } from 'naive-ui' // 导入 `naive ui` 中文包
import { enUS, dateEnUS } from 'naive-ui' // 导入 `naive ui` 英文包

import { getCache } from '@use-utils/cache'

import type { App } from 'vue'

/**
 *
 * @returns 获取当前环境默认语言
 *
 * @remak 未避免出现加载语言错误问题, 故而在 `main.ts` 注册时, 应优先加载 `i18n` 避免出现该问题
 */
export const useDefaultLocal = () => {
  const locale: string =
    getCache('localeLanguage', 'localStorage') !== 'no'
      ? getCache('localeLanguage', 'localStorage')
      : 'zh-CN'

  return locale
}

export const setupI18n = (app: App<Element>) => {
  const locale = useDefaultLocal()

  const i18n = createI18n({
    locale,
    allowComposition: true,
    messages,
  })

  app.use(i18n)
}

export const useLanguageOptions = () => [
  {
    key: 'zh-CN',
    label: '中文(简体)',
  },
  {
    key: 'en-US',
    label: 'English(US)',
  },
]

/**
 *
 * @param key 切换对应语言
 * @returns 组件库对应语言包
 *
 * @remark 受打包体积影响. 如果有新的语言添加, 则需要手动引入对应语言包(https://www.naiveui.com/zh-CN/dark/docs/i18n)
 */
export const useNaiveLocal = (key: string) => {
  switch (key) {
    case 'zh-CN':
      return {
        local: zhCN,
        dateLocal: dateZhCN,
      }

    case 'en-US':
      return {
        local: enUS,
        dateLocal: dateEnUS,
      }

    default:
      return {
        local: zhCN,
        dateLocal: dateZhCN,
      }
  }
}

/**
 *
 * @returns 当前环境语言组件库语言包
 *
 * @remark 获取默认语言包
 */
export const useDefaultNaiveLocal = () => {
  const local = useDefaultLocal()

  return useNaiveLocal(local)
}

/**
 *
 * 注册 `vue-i18n`
 *
 * 注意: 因使用 `i18n` 提供虚拟文件注入缘故, 每次修改 `locales` 中的文件后, 需要重启项目
 *
 * 预设 `localeLanguage` 作为缓存 `key`
 *
 * 预设中文作为基础语言
 *
 * `naive ui` 语言包切换
 */
