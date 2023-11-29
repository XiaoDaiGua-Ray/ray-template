/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-11-16
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { useSettingActions } from '@/store'

export function useAppSetting() {
  /**
   *
   * @param theme 当前主题色
   *
   * 当前主题有明暗两套
   *
   * @example
   * changeTheme(true) 切换至暗色主题
   * changeTheme(false) 切换至明色主题
   */
  const changeTheme = (theme: boolean) => {
    const { changeSwitcher } = useSettingActions()

    changeSwitcher(theme, 'appTheme')
  }

  return {
    changeTheme,
  }
}
