module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'Android 4.1',
        'iOS 7.1',
        'Chrome > 31',
        'ff > 31',
        'ie >= 8',
        'last 10 versions',
      ],
      grid: true,
    },
    // 为了适配 postcss8.x 版本的转换库
    'postcss-px-to-viewport-8-plugin': {
      inlinePxToViewport: true,
      /** 视窗的宽度(设计稿的宽度) */
      viewportWidth: 1920,
      /** 视窗的高度(设计稿高度, 一般无需指定) */
      viewportHeight: 1080,
      /** 指定 px 转换为视窗单位值的小数位数 */
      unitPrecision: 3,
      /** 指定需要转换成的视窗单位 */
      viewportUnit: 'rem',
      /** 制定字体转换单位 */
      fontViewportUnit: 'rem',
      /** 指定不转换为视窗单位的类 */
      selectorBlackList: ['.ignore'],
      /** 小于或等于 1px 不转换为视窗单位 */
      minPixelValue: 1,
      /** 允许在媒体查询中转换 px */
      mediaQuery: false,
      // exclude: /(\/|\\)(node_modules)(\/|\\)/, // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
      include: [/^src[/\\].*\.(vue|tsx|jsx|ts(?!d))$/],
      preserve: true,
    },
  },
}
