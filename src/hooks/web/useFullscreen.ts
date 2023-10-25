/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-10-25
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { useFullscreen as hooksPlusUseFullscreen } from 'vue-hooks-plus'

import type { useFullscreen as UseFullscreen } from 'vue-hooks-plus'

type UseFullscreenParams = Parameters<typeof UseFullscreen>

export function useFullscreen(
  target: UseFullscreenParams[0],
  options?: UseFullscreenParams[1],
) {
  const [
    isFullscreen,
    { enterFullscreen, exitFullscreen, toggleFullscreen, isEnabled },
  ] = hooksPlusUseFullscreen(target, options)

  if (!isEnabled) {
    window.$message.warning('您当前环境不支持全屏模式')
  }

  return [
    isFullscreen,
    {
      enterFullscreen,
      exitFullscreen,
      toggleFullscreen,
      isEnabled,
    },
  ] as const
}
