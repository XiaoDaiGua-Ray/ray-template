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
    'postcss-pxtorem': {
      rootValue: 16, // 根元素字体大小或根据 `input` 参数返回根元素字体大小
      unitPrecision: 5,
      propList: ['font', 'font-size', 'line-height', 'letter-spacing'], // 可以从 `px` 更改为 `rem` 的属性
      selectorBlackList: [], // 要忽略并保留为 `px` 的选择器
    },
  },
}
