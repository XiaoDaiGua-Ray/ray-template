import { dateZhCN, zhCN } from 'naive-ui' // 导入 `naive ui` 中文包

/**
 *
 * @param key 切换对应语言
 *
 * @description
 * 通过 key 获取对应 naive ui 语言包。
 *
 * key 必须与 LOCAL_OPTIONS key 一一对应。
 *
 * @example
 * const { locale, dateLocal } = naiveLocales('zh-CN')
 */
export const getNaiveLocales = (key: string) => {
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
