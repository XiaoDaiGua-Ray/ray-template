/**
 *
 * 正则入口
 * 系统公共正则, 配置在该文件中
 */

export const APP_REGEX: Record<string, RegExp> = {
  /** css 尺寸单位匹配 */
  cssUnit:
    /^\d+(\.\d+)?(px|em|rem|%|vw|vh|vmin|vmax|cm|mm|in|pt|pc|ch|ex|q|s|ms|deg|rad|turn|grad|hz|khz|dpi|dpcm|dppx|fr|auto)$/,
}
