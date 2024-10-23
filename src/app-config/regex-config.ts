/**
 *
 * 正则入口
 * 系统公共正则, 配置在该文件中
 */

export const APP_REGEX: Record<string, RegExp> = {
  /** css 尺寸单位匹配 */
  cssUnit:
    /^\d+(\.\d+)?(px|em|rem|%|vw|vh|vmin|vmax|cm|mm|in|pt|pc|ch|ex|q|s|ms|deg|rad|turn|grad|hz|khz|dpi|dpcm|dppx|fr|auto)$/,
  /**
   *
   * @description
   * 匹配 css 单位是否为 auto, unset, fit-content, max-content, min-content, initial, inherit, revert, revert-layer, -webkit-fill-available,
   * -webkit-max-content, -webkit-min-content, -webkit-revert, -webkit-revert-layer, -webkit-fill-available。
   */
  cssSize:
    /^auto|unset|fit-content|max-content|min-content|initial|inherit|revert|revert-layer|[-\w]+-webkit-fill-available$/,
}
