/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-11-03
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { getVariableToRefs, setVariable } from '@/global-variable/index'
import { LAYOUT_CONTENT_REF } from '@/app-config/routerConfig'
import { useFullscreen } from 'vue-hooks-plus'
import { useI18n } from '@/hooks/web/index'

import type { AppMenuOption } from '@/types/modules/app'
import type { Ref } from 'vue'

export function useMainPage() {
  const reload = (wait = 800) => {
    setVariable('globalMainLayoutLoad', false)

    setTimeout(() => setVariable('globalMainLayoutLoad', true), wait)
  }

  const maximize = (full: boolean) => {
    // setVariable('layoutContentMaximize', full)
  }

  return {
    reload,
    maximize,
  }
}
