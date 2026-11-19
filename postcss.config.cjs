const viewportIncludeFiles = []

module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'Chrome >= 111',
        'Edge >= 111',
        'Firefox >= 114',
        'Safari >= 16.4',
        'iOS >= 16.4',
      ],
    },
    'postcss-px-conversion': viewportIncludeFiles.length > 0 && {
      viewportWidth: 1920,
      unitPrecision: 3,
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlacklist: ['.ignore'],
      minPixelValue: 1,
      allowMediaQuery: false,
      enablePerFileConfig: false,
      includeFiles: viewportIncludeFiles,
      excludeFiles: [/[/\\]node_modules[/\\]/],
    },
  },
}
