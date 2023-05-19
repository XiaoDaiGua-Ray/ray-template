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

/** 国际化相关配置 */

import { zhCN, dateZhCN } from 'naive-ui' // 导入 `naive ui` 中文包

/**
 *
 * 语言包语种添加后, 需要在此文件配置语言包
 * 该配置中的 key 也会影响 naiveLocales 方法, 配置后请仔细核对一下
 */
export const localOptions = [
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
 * @remark naive ui 默认为英文
 *
 * 该方法的比对 key 必须与 localOptions 一一对应
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
