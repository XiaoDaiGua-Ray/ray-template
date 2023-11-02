/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-12
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 正则入口
 * 系统公共正则, 配置在该文件中
 */

export const APP_REGEX: Record<string, RegExp> = {
  /** css 尺寸单位匹配 */
  validCSSUnit:
    /^\d+(\.\d+)?(px|em|rem|%|vw|vh|vmin|vmax|cm|mm|in|pt|pc|ch|ex|q|s|ms|deg|rad|turn|grad|hz|khz|dpi|dpcm|dppx|fr|auto)$/,
}
