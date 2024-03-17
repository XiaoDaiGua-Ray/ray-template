export interface VitePluginCompression {
  /**
   *
   * Log compressed files and their compression ratios.
   * @default: true
   */
  verbose?: boolean
  /**
   *
   * Minimum file size before compression is used.
   * @default 1025
   */
  threshold?: number
  /**
   *
   * Filter files that do not need to be compressed
   * @default /\.(js|mjs|json|css|html)$/i
   */
  filter?: RegExp | ((file: string) => boolean)
  /**
   *
   * Whether to enable compression
   * @default: false
   */
  disable?: boolean
  /**
   *
   * Compression algorithm
   * @default gzip
   */
  algorithm?: Algorithm
  /**
   *
   * File format after compression
   * @default .gz
   */
  ext?: string
  /**
   *
   * Compression Options
   */
  compressionOptions?: object
  /**
   *
   * Delete the corresponding source file after compressing the file
   * @default: false
   */
  deleteOriginFile?: boolean
  /**
   *
   * success callback after completed
   */
  success?: () => void
}

export interface ViteBuildPlugin {
  outDir: string
  assetsDir: string
  assetsInlineLimit: number
  cssCodeSplit: boolean // 拆分css代码
  minify: boolean | 'esbuild' | 'terser'
  sourcemap: boolean
}

export interface LibItem {
  /**
   *
   * library name
   */
  libName: string
  /**
   *
   * component style file path
   */
  style?: (name: string) => string | string[] | boolean
  /**
   *
   * default `es`
   */
  libDirectory?: string
  /**
   *
   * whether convert component name from camel to dash, default `true`
   */
  camel2DashComponentName?: boolean
  /**
   *
   * whether replace old import statement, default `command === 'build'`,
   * that means in vite serve default to `false`, in vite build default to `true`
   */
  replaceOldImport?: boolean
  /**
   *
   * imported name formatter
   */
  nameFormatter?: (name: string, importedName: string) => string
}

export interface LibResolverObject extends LibItem {}

export type LibResolver = LibResolverObject

export interface ImpConfig {
  optimize?: boolean
  libList: LibResolver[]
  /**
   *
   * exclude the library from defaultLibList
   */
  exclude?: string[]
  /**
   *
   * when a style path is not found, don’t show error and give a warning.
   * Default: command === 'serve'
   */
  ignoreStylePathNotFound?: boolean
  /**
   *
   * By default `vite-plugin-imp` ignores all files inside node_modules.
   * You can enable this option to avoid unexpected untranslated code from third-party dependencies.
   *
   * Transpiling all the dependencies could slow down the build process, though.
   * If build performance is a concern, you can explicitly transpile only some of the dependencies
   * by passing an array of package names or name patterns to this option.
   *
   * Default: false
   */
  transpileDependencies?: boolean | Array<string | RegExp>
}
