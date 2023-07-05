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
    // 'postcss-px-to-viewport': {
    //   /** 视窗的宽度(设计稿的宽度) */
    //   viewportWidth: 1920,
    //   /** 视窗的高度(设计稿高度, 一般无需指定) */
    //   viewportHeight: 1080,
    //   /** 指定 px 转换为视窗单位值的小数位数 */
    //   unitPrecision: 3,
    //   /** 指定需要转换成的视窗单位 */
    //   viewportUnit: 'vw',
    //   /** 指定不转换为视窗单位的类 */
    //   selectorBlackList: ['.ignore'],
    //   /** 小于或等于 1px 不转换为视窗单位 */
    //   minPixelValue: 1,
    //   /** 允许在媒体查询中转换 px */
    //   mediaQuery: false,
    // },
  },
}
