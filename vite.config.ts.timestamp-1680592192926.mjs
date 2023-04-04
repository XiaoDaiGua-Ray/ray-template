// vite.config.ts
import { defineConfig } from "file:///Users/daigua/Documents/ray-template/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/daigua/Documents/ray-template/node_modules/@vitejs/plugin-vue/dist/index.mjs";

// vite-plugin/index.ts
import path from "node:path";
import autoImport from "file:///Users/daigua/Documents/ray-template/node_modules/unplugin-auto-import/dist/vite.js";
import viteComponents from "file:///Users/daigua/Documents/ray-template/node_modules/unplugin-vue-components/dist/vite.mjs";
import vueI18nPlugin from "file:///Users/daigua/Documents/ray-template/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import { createSvgIconsPlugin } from "file:///Users/daigua/Documents/ray-template/node_modules/vite-plugin-svg-icons/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/daigua/Documents/ray-template/vite-plugin";
var useSVGIcon = (options) => {
  const defaultOptions = {
    iconDirs: [path.resolve(process.cwd(), "src/icons")],
    symbolId: "icon-[dir]-[name]",
    inject: "body-last",
    customDomId: "__svg__icons__dom__"
  };
  return createSvgIconsPlugin(Object.assign({}, defaultOptions, options));
};
var useAutoImport = async (imp = []) => autoImport({
  include: [
    /\.[tj]sx?$/,
    // .ts, .tsx, .js, .jsx
    /\.vue$/,
    /\.vue\?vue/,
    // .vue
    /\.md$/
    // .md
  ],
  dts: true,
  imports: ["vue", "vue-router", "pinia", "@vueuse/core", "vue-i18n", ...imp]
});
var useViteComponents = async (resolvers = [], types = []) => viteComponents({
  dts: true,
  resolvers: [...resolvers],
  types: [
    {
      from: "vue-router",
      names: ["RouterLink", "RouterView"]
    },
    ...types
  ]
});
var useVueI18nPlugin = () => vueI18nPlugin({
  runtimeOnly: true,
  compositionOnly: true,
  forceStringify: true,
  defaultSFCLang: "json",
  include: [path.resolve(__vite_injected_original_dirname, "../locales/**")]
});
var HTMLTitlePlugin = (title2) => {
  return {
    name: "html-transform",
    transformIndexHtml: (html) => {
      return html.replace(/<title>(.*?)<\/title>/, `<title>${title2}</title>`);
    }
  };
};
var buildOptions = (mode) => {
  const outDirMap = {
    test: "dist/test-dist",
    development: "dist/development-dist",
    production: "dist/production-dist",
    report: "dist/report-dist"
  };
  const dirPath = outDirMap[mode] || "dist/test-dist";
  if (mode === "production") {
    return {
      outDir: dirPath,
      sourcemap: false,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    };
  } else {
    return {
      outDir: dirPath,
      sourcemap: true,
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: false
        }
      }
    };
  }
};
var mixinCSSPlugin = (options) => {
  const defaultOptions = [];
  if (Array.isArray(options)) {
    defaultOptions.push(...options);
  }
  const mixisString = defaultOptions.reduce((pre, curr) => {
    const temp = `@import "${curr}";`;
    return pre += temp;
  }, "");
  return mixisString;
};

// vite.config.ts
import ViteVueJSX from "file:///Users/daigua/Documents/ray-template/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import VueI18nPlugin from "file:///Users/daigua/Documents/ray-template/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import ViteInspect from "file:///Users/daigua/Documents/ray-template/node_modules/vite-plugin-inspect/dist/index.mjs";
import viteSvgLoader from "file:///Users/daigua/Documents/ray-template/node_modules/vite-svg-loader/index.js";
import viteEslintPlugin from "file:///Users/daigua/Documents/ray-template/node_modules/vite-plugin-eslint/dist/index.mjs";
import vitePluginImp from "file:///Users/daigua/Documents/ray-template/node_modules/vite-plugin-imp/dist/index.mjs";
import { visualizer } from "file:///Users/daigua/Documents/ray-template/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import viteCompression from "file:///Users/daigua/Documents/ray-template/node_modules/vite-plugin-compression/dist/index.mjs";
import { NaiveUiResolver } from "file:///Users/daigua/Documents/ray-template/node_modules/unplugin-vue-components/dist/resolvers.mjs";

// cfg.ts
import path2 from "node:path";
var __vite_injected_original_dirname2 = "/Users/daigua/Documents/ray-template";
var config = {
  /** 默认主题色 */
  primaryColor: "#2d8cf0",
  /**
   *
   * 配置根页面
   * 该项目所有重定向至首页, 都依赖该配置项
   *
   * 如果修改了该项目的首页路由配置, 需要更改该配置项, 以免重定向首页操作出现错误
   */
  rootRoute: {
    name: "dashboard",
    path: "/dashboard"
  },
  /**
   *
   * icon: LOGO 图标, 依赖 `RayIcon` 实现
   * title: LOGO 标题
   * url: 点击跳转地址, 如果不配置该属性, 则不会触发跳转
   * jumpType: 跳转类型（station: 项目内跳转, outsideStation: 新页面打开）
   *
   * 如果不设置该属性或者为空, 则不会渲染 LOGO
   */
  sideBarLogo: {
    icon: "ray",
    title: "Ray Template",
    url: "/dashboard",
    jumpType: "station"
  },
  /**
   *
   * 预处理全局需要注入的 css 文件
   *
   * 预设:
   *   - ./src/styles/mixins.scss
   *   - ./src/styles/setting.scss
   *   - ./src/styles/theme.scss
   *
   * 如果需要删除或者修改, 需要同步修改目录下的 css 文件
   */
  mixinCSS: mixinCSSPlugin([
    "./src/styles/mixins.scss",
    "./src/styles/setting.scss",
    "./src/styles/theme.scss"
  ]),
  /**
   *
   * 版权信息
   *
   * 也可以当作页底设置, 看实际业务需求
   */
  copyright: "Copyright \xA9 2022-present Ray",
  /**
   *
   * 浏览器标题
   */
  title: HTMLTitlePlugin("ray template"),
  /**
   *
   * 配置 HMR 特定选项（端口、主机、路径和协议）
   */
  server: {
    host: "0.0.0.0",
    port: 9527,
    open: false,
    https: false,
    strictPort: false,
    fs: {
      strict: false,
      allow: []
    },
    proxy: {
      "/api": {
        target: "url",
        changeOrigin: true,
        rewrite: (path3) => path3.replace(/^\/api/, "")
      },
      "/office": {
        target: "https://office.yka.one/",
        changeOrigin: true,
        rewrite: (path3) => path3.replace(/^\/office/, "")
      }
    }
  },
  /**
   *
   * 打包相关配置
   */
  buildOptions,
  /**
   *
   * 预设别名
   * - `@`: `src` 根目录
   * - `@use-utils`: `src/utils` 根目录
   * - `@use-api`: `src/axios/api` 根目录
   * - `@use-images`: `src/assets/images` 根目录
   */
  alias: [
    {
      find: "@",
      replacement: path2.resolve(__vite_injected_original_dirname2, "./src")
    },
    {
      find: "@use-utils",
      replacement: path2.resolve(__vite_injected_original_dirname2, "./src/utils")
    },
    {
      find: "@use-api",
      replacement: path2.resolve(__vite_injected_original_dirname2, "./src/axios/api")
    },
    {
      find: "@use-images",
      replacement: path2.resolve(__vite_injected_original_dirname2, "./src/assets/images")
    }
  ]
};
var cfg_default = config;

// package.json
var package_default = {
  name: "ray-template",
  private: true,
  version: "3.1.6",
  type: "module",
  scripts: {
    dev: "vite",
    build: "vue-tsc --noEmit && vite build --mode production",
    preview: "vite preview",
    test: "vue-tsc --noEmit && vite build --mode test",
    "dev-build": "vue-tsc --noEmit && vite build --mode development",
    report: "vue-tsc --noEmit && vite build --mode report",
    prepare: "husky install"
  },
  "lint-staged": {
    "src/**/*.{vue,jsx,ts,tsx,json}": [
      "prettier --write",
      "eslint",
      "git add"
    ]
  },
  dependencies: {
    "@vueuse/core": "^9.1.0",
    "amfe-flexible": "^2.2.1",
    axios: "^1.2.0",
    "crypto-js": "^4.1.1",
    dayjs: "^1.11.7",
    echarts: "^5.4.0",
    "lodash-es": "^4.17.21",
    "naive-ui": "^2.34.3",
    pinia: "^2.0.17",
    "pinia-plugin-persistedstate": "^2.4.0",
    "print-js": "^1.6.0",
    "qrcode.vue": "^3.3.4",
    sass: "^1.54.3",
    screenfull: "^6.0.2",
    vue: "^3.2.37",
    "vue-i18n": "^9.2.2",
    "vue-router": "^4.1.3",
    vuedraggable: "^4.1.0",
    xlsx: "^0.18.5"
  },
  devDependencies: {
    "@babel/core": "^7.20.2",
    "@babel/eslint-parser": "^7.19.1",
    "@commitlint/cli": "^17.4.2",
    "@commitlint/config-conventional": "^17.4.2",
    "@intlify/unplugin-vue-i18n": "^0.5.0",
    "@types/crypto-js": "^4.1.1",
    "@types/scrollreveal": "^0.0.8",
    "@typescript-eslint/eslint-plugin": "^5.42.1",
    "@typescript-eslint/parser": "^5.42.1",
    "@vitejs/plugin-vue": "^3.0.0",
    "@vitejs/plugin-vue-jsx": "^2.0.0",
    autoprefixer: "^10.4.8",
    depcheck: "^1.4.3",
    eslint: "^8.0.1",
    "eslint-config-prettier": "^8.5.0",
    "eslint-config-standard-with-typescript": "^23.0.0",
    "eslint-plugin-import": "^2.25.2",
    "eslint-plugin-n": "^15.0.0",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-promise": "^6.0.0",
    "eslint-plugin-react": "^7.31.10",
    "eslint-plugin-vue": "^9.7.0",
    husky: "^8.0.3",
    "lint-staged": "^13.1.0",
    postcss: "^8.1.0",
    "postcss-px-to-viewport": "^1.1.1",
    prettier: "^2.7.1",
    "rollup-plugin-visualizer": "^5.8.3",
    "svg-sprite-loader": "^6.0.11",
    typescript: "*",
    "unplugin-auto-import": "^0.11.0",
    "unplugin-vue-components": "^0.22.0",
    vite: "^4.1.4",
    "vite-plugin-compression": "^0.5.1",
    "vite-plugin-eslint": "^1.8.1",
    "vite-plugin-imp": "^2.3.1",
    "vite-plugin-inspect": "^0.6.0",
    "vite-plugin-svg-icons": "^2.0.1",
    "vite-svg-loader": "^3.4.0",
    "vue-tsc": "^1.0.9"
  }
};

// vite.config.ts
var { dependencies, devDependencies, name, version } = package_default;
var {
  server,
  buildOptions: buildOptions2,
  alias,
  title,
  copyright,
  sideBarLogo,
  mixinCSS,
  rootRoute,
  primaryColor
} = cfg_default;
var __APP_CFG__ = {
  pkg: { dependencies, devDependencies, name, version },
  layout: {
    copyright,
    sideBarLogo
  },
  rootRoute,
  primaryColor
};
var vite_config_default = defineConfig(async ({ mode }) => {
  return {
    define: {
      __APP_CFG__: JSON.stringify(__APP_CFG__)
    },
    resolve: {
      alias
    },
    plugins: [
      vue({ reactivityTransform: true }),
      ViteVueJSX(),
      title,
      ViteInspect(),
      // 仅适用于开发模式(检查 `Vite` 插件的中间状态)
      VueI18nPlugin(),
      await useAutoImport([
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar"
          ]
        }
      ]),
      await useViteComponents([NaiveUiResolver()]),
      viteCompression(),
      useVueI18nPlugin(),
      viteSvgLoader({
        defaultImport: "component"
        // 默认以 `componetn` 形式导入 `svg`
      }),
      useSVGIcon(),
      viteEslintPlugin({
        lintOnStart: true,
        // 构建时自动检查
        failOnWarning: true,
        // 如果含有警告则构建失败
        failOnError: true,
        // 如果有错误则构建失败
        cache: true,
        // 缓存, 减少构建时间
        exclude: ["**/node_modules/**", "vite-env.d.ts"],
        include: ["src/**/*.ts", "src/**/*.vue", "src/**/*.tsx"]
      }),
      vitePluginImp({
        libList: [
          {
            libName: "lodash-es",
            libDirectory: "",
            camel2DashComponentName: false
          },
          {
            libName: "@vueuse",
            libDirectory: "",
            camel2DashComponentName: false
          }
        ]
      }),
      {
        include: [
          "src/**/*.ts",
          "src/**/*.tsx",
          "src/**/*.vue",
          "src/*.ts",
          "src/*.tsx",
          "src/*.vue"
        ]
      },
      visualizer({
        gzipSize: true,
        // 搜集 `gzip` 压缩包
        brotliSize: true,
        // 搜集 `brotli` 压缩包
        emitFile: false,
        // 生成文件在根目录下
        filename: "visualizer.html",
        open: mode === "report" ? true : false
        // 以默认服务器代理打开文件
      })
    ],
    optimizeDeps: {
      include: ["vue", "vue-router", "pinia", "vue-i18n", "@vueuse/core"]
    },
    esbuild: {
      pure: ["console.log"]
    },
    build: {
      ...buildOptions2(mode),
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString();
            }
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: mixinCSS
        }
      },
      modules: {
        localsConvention: "camelCaseOnly"
      }
    },
    server: {
      ...server
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS1wbHVnaW4vaW5kZXgudHMiLCAiY2ZnLnRzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kYWlndWEvRG9jdW1lbnRzL3JheS10ZW1wbGF0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RhaWd1YS9Eb2N1bWVudHMvcmF5LXRlbXBsYXRlL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kYWlndWEvRG9jdW1lbnRzL3JheS10ZW1wbGF0ZS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcblxuaW1wb3J0IHtcbiAgdXNlQXV0b0ltcG9ydCxcbiAgdXNlVml0ZUNvbXBvbmVudHMsXG4gIHVzZVZ1ZUkxOG5QbHVnaW4sXG4gIHVzZVNWR0ljb24sXG59IGZyb20gJy4vdml0ZS1wbHVnaW4vaW5kZXgnXG5cbmltcG9ydCBWaXRlVnVlSlNYIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG5pbXBvcnQgVnVlSTE4blBsdWdpbiBmcm9tICdAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4bi92aXRlJ1xuaW1wb3J0IFZpdGVJbnNwZWN0IGZyb20gJ3ZpdGUtcGx1Z2luLWluc3BlY3QnXG5pbXBvcnQgdml0ZVN2Z0xvYWRlciBmcm9tICd2aXRlLXN2Zy1sb2FkZXInXG5pbXBvcnQgdml0ZUVzbGludFBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi1lc2xpbnQnXG5pbXBvcnQgdml0ZVBsdWdpbkltcCBmcm9tICd2aXRlLXBsdWdpbi1pbXAnIC8vIFx1NjMwOVx1OTcwMFx1NjI1M1x1NTMwNVx1NURFNVx1NTE3N1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcicgLy8gXHU2MjUzXHU1MzA1XHU0RjUzXHU3OUVGXHU1MjA2XHU2NzkwXHU1REU1XHU1MTc3XG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJyAvLyBcdTUzOEJcdTdGMjlcdTYyNTNcdTUzMDVcblxuaW1wb3J0IHsgTmFpdmVVaVJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJyAvLyBcdTZBMjFcdTY3N0ZcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTdFQzRcdTRFRjZcdTVFNzZcdTRFMTRcdTYzMDlcdTk3MDBcdTYyNTNcdTUzMDVcblxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NmZydcbmltcG9ydCBwa2cgZnJvbSAnLi9wYWNrYWdlLmpzb24nXG5cbmNvbnN0IHsgZGVwZW5kZW5jaWVzLCBkZXZEZXBlbmRlbmNpZXMsIG5hbWUsIHZlcnNpb24gfSA9IHBrZ1xuY29uc3Qge1xuICBzZXJ2ZXIsXG4gIGJ1aWxkT3B0aW9ucyxcbiAgYWxpYXMsXG4gIHRpdGxlLFxuICBjb3B5cmlnaHQsXG4gIHNpZGVCYXJMb2dvLFxuICBtaXhpbkNTUyxcbiAgcm9vdFJvdXRlLFxuICBwcmltYXJ5Q29sb3IsXG59ID0gY29uZmlnXG5cbi8qKlxuICpcbiAqIFx1NTE2OFx1NUM0MFx1NkNFOFx1NTE2NSBgX19BUFBfQ0ZHX19gIFx1NTNEOFx1OTFDRlxuICpcbiAqIFx1NTNFRlx1NEVFNVx1NTcyOCBgdmlld3NgIFx1OTg3NVx1OTc2Mlx1NEY3Rlx1NzUyOFxuICpcbiAqIFx1NEY3Rlx1NzUyOFx1NjVCOVx1NkNENSBgY29uc3QgeyBwa2csIGxheW91dCB9ID0gX19BUFBfQ0ZHX19gXG4gKlxuICogXHU1OTgyXHU2NzlDXHU2NzA5XHU2NUIwXHU3Njg0XHU4ODY1XHU1MTQ1LCBcdTk3MDBcdTg5ODFcdTgxRUFcdTVERjFcdTYyNEJcdTUyQThcdTg4NjVcdTUxNDVcdTdDN0JcdTU3OEIgYHNyYy90eXBlcy9jZmcudHMgQXBwQ29uZmlnYFxuICovXG5jb25zdCBfX0FQUF9DRkdfXyA9IHtcbiAgcGtnOiB7IGRlcGVuZGVuY2llcywgZGV2RGVwZW5kZW5jaWVzLCBuYW1lLCB2ZXJzaW9uIH0sXG4gIGxheW91dDoge1xuICAgIGNvcHlyaWdodCxcbiAgICBzaWRlQmFyTG9nbyxcbiAgfSxcbiAgcm9vdFJvdXRlLFxuICBwcmltYXJ5Q29sb3IsXG59XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoYXN5bmMgKHsgbW9kZSB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgZGVmaW5lOiB7XG4gICAgICBfX0FQUF9DRkdfXzogSlNPTi5zdHJpbmdpZnkoX19BUFBfQ0ZHX18pLFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IGFsaWFzLFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgdnVlKHsgcmVhY3Rpdml0eVRyYW5zZm9ybTogdHJ1ZSB9KSxcbiAgICAgIFZpdGVWdWVKU1goKSxcbiAgICAgIHRpdGxlLFxuICAgICAgVml0ZUluc3BlY3QoKSwgLy8gXHU0RUM1XHU5MDAyXHU3NTI4XHU0RThFXHU1RjAwXHU1M0QxXHU2QTIxXHU1RjBGKFx1NjhDMFx1NjdFNSBgVml0ZWAgXHU2M0QyXHU0RUY2XHU3Njg0XHU0RTJEXHU5NUY0XHU3MkI2XHU2MDAxKVxuICAgICAgVnVlSTE4blBsdWdpbigpLFxuICAgICAgYXdhaXQgdXNlQXV0b0ltcG9ydChbXG4gICAgICAgIHtcbiAgICAgICAgICAnbmFpdmUtdWknOiBbXG4gICAgICAgICAgICAndXNlRGlhbG9nJyxcbiAgICAgICAgICAgICd1c2VNZXNzYWdlJyxcbiAgICAgICAgICAgICd1c2VOb3RpZmljYXRpb24nLFxuICAgICAgICAgICAgJ3VzZUxvYWRpbmdCYXInLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdKSxcbiAgICAgIGF3YWl0IHVzZVZpdGVDb21wb25lbnRzKFtOYWl2ZVVpUmVzb2x2ZXIoKV0pLFxuICAgICAgdml0ZUNvbXByZXNzaW9uKCksXG4gICAgICB1c2VWdWVJMThuUGx1Z2luKCksXG4gICAgICB2aXRlU3ZnTG9hZGVyKHtcbiAgICAgICAgZGVmYXVsdEltcG9ydDogJ2NvbXBvbmVudCcsIC8vIFx1OUVEOFx1OEJBNFx1NEVFNSBgY29tcG9uZXRuYCBcdTVGNjJcdTVGMEZcdTVCRkNcdTUxNjUgYHN2Z2BcbiAgICAgIH0pLFxuICAgICAgdXNlU1ZHSWNvbigpLFxuICAgICAgdml0ZUVzbGludFBsdWdpbih7XG4gICAgICAgIGxpbnRPblN0YXJ0OiB0cnVlLCAvLyBcdTY3ODRcdTVFRkFcdTY1RjZcdTgxRUFcdTUyQThcdTY4QzBcdTY3RTVcbiAgICAgICAgZmFpbE9uV2FybmluZzogdHJ1ZSwgLy8gXHU1OTgyXHU2NzlDXHU1NDJCXHU2NzA5XHU4QjY2XHU1NDRBXHU1MjE5XHU2Nzg0XHU1RUZBXHU1OTMxXHU4RDI1XG4gICAgICAgIGZhaWxPbkVycm9yOiB0cnVlLCAvLyBcdTU5ODJcdTY3OUNcdTY3MDlcdTk1MTlcdThCRUZcdTUyMTlcdTY3ODRcdTVFRkFcdTU5MzFcdThEMjVcbiAgICAgICAgY2FjaGU6IHRydWUsIC8vIFx1N0YxM1x1NUI1OCwgXHU1MUNGXHU1QzExXHU2Nzg0XHU1RUZBXHU2NUY2XHU5NUY0XG4gICAgICAgIGV4Y2x1ZGU6IFsnKiovbm9kZV9tb2R1bGVzLyoqJywgJ3ZpdGUtZW52LmQudHMnXSxcbiAgICAgICAgaW5jbHVkZTogWydzcmMvKiovKi50cycsICdzcmMvKiovKi52dWUnLCAnc3JjLyoqLyoudHN4J10sXG4gICAgICB9KSxcbiAgICAgIHZpdGVQbHVnaW5JbXAoe1xuICAgICAgICBsaWJMaXN0OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGliTmFtZTogJ2xvZGFzaC1lcycsXG4gICAgICAgICAgICBsaWJEaXJlY3Rvcnk6ICcnLFxuICAgICAgICAgICAgY2FtZWwyRGFzaENvbXBvbmVudE5hbWU6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGliTmFtZTogJ0B2dWV1c2UnLFxuICAgICAgICAgICAgbGliRGlyZWN0b3J5OiAnJyxcbiAgICAgICAgICAgIGNhbWVsMkRhc2hDb21wb25lbnROYW1lOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgICB7XG4gICAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgICAnc3JjLyoqLyoudHMnLFxuICAgICAgICAgICdzcmMvKiovKi50c3gnLFxuICAgICAgICAgICdzcmMvKiovKi52dWUnLFxuICAgICAgICAgICdzcmMvKi50cycsXG4gICAgICAgICAgJ3NyYy8qLnRzeCcsXG4gICAgICAgICAgJ3NyYy8qLnZ1ZScsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgdmlzdWFsaXplcih7XG4gICAgICAgIGd6aXBTaXplOiB0cnVlLCAvLyBcdTY0MUNcdTk2QzYgYGd6aXBgIFx1NTM4Qlx1N0YyOVx1NTMwNVxuICAgICAgICBicm90bGlTaXplOiB0cnVlLCAvLyBcdTY0MUNcdTk2QzYgYGJyb3RsaWAgXHU1MzhCXHU3RjI5XHU1MzA1XG4gICAgICAgIGVtaXRGaWxlOiBmYWxzZSwgLy8gXHU3NTFGXHU2MjEwXHU2NTg3XHU0RUY2XHU1NzI4XHU2ODM5XHU3NkVFXHU1RjU1XHU0RTBCXG4gICAgICAgIGZpbGVuYW1lOiAndmlzdWFsaXplci5odG1sJyxcbiAgICAgICAgb3BlbjogbW9kZSA9PT0gJ3JlcG9ydCcgPyB0cnVlIDogZmFsc2UsIC8vIFx1NEVFNVx1OUVEOFx1OEJBNFx1NjcwRFx1NTJBMVx1NTY2OFx1NEVFM1x1NzQwNlx1NjI1M1x1NUYwMFx1NjU4N1x1NEVGNlxuICAgICAgfSksXG4gICAgXSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAncGluaWEnLCAndnVlLWkxOG4nLCAnQHZ1ZXVzZS9jb3JlJ10sXG4gICAgfSxcbiAgICBlc2J1aWxkOiB7XG4gICAgICBwdXJlOiBbJ2NvbnNvbGUubG9nJ10sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgLi4uYnVpbGRPcHRpb25zKG1vZGUpLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBtYW51YWxDaHVua3M6IChpZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgICByZXR1cm4gaWRcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgIC5zcGxpdCgnbm9kZV9tb2R1bGVzLycpWzFdXG4gICAgICAgICAgICAgICAgLnNwbGl0KCcvJylbMF1cbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogbWl4aW5DU1MsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgbW9kdWxlczoge1xuICAgICAgICBsb2NhbHNDb252ZW50aW9uOiAnY2FtZWxDYXNlT25seScsXG4gICAgICB9LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICAuLi5zZXJ2ZXIsXG4gICAgfSxcbiAgfVxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RhaWd1YS9Eb2N1bWVudHMvcmF5LXRlbXBsYXRlL3ZpdGUtcGx1Z2luXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZGFpZ3VhL0RvY3VtZW50cy9yYXktdGVtcGxhdGUvdml0ZS1wbHVnaW4vaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RhaWd1YS9Eb2N1bWVudHMvcmF5LXRlbXBsYXRlL3ZpdGUtcGx1Z2luL2luZGV4LnRzXCI7aW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xuXG5pbXBvcnQgYXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJyAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcbmltcG9ydCB2aXRlQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJyAvLyBcdTgxRUFcdTUyQThcdTYzMDlcdTk3MDBcdTVCRkNcdTUxNjVcbmltcG9ydCB2dWVJMThuUGx1Z2luIGZyb20gJ0BpbnRsaWZ5L3VucGx1Z2luLXZ1ZS1pMThuL3ZpdGUnIC8vIGkxOG5cbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3ZnLWljb25zJyAvLyBgc3ZnIGljb25gXG5cbmltcG9ydCB0eXBlIHsgQ29tcG9uZW50UmVzb2x2ZXIsIFR5cGVJbXBvcnQgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cydcbmltcG9ydCB0eXBlIHsgSW1wb3J0c01hcCwgUHJlc2V0TmFtZSB9IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBCdWlsZE9wdGlvbnMgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHR5cGUgeyBWaXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnXG5cbi8qKlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIGBzdmcgaWNvbmAgXHU4MUVBXHU1QjlBXHU0RTQ5XHU5MTREXHU3RjZFXG4gKlxuICogXHU0RjdGXHU3NTI4IGBzdmdgIFx1NEY1Q1x1NEUzQVx1NTZGRVx1NjgwN1xuICovXG5leHBvcnQgY29uc3QgdXNlU1ZHSWNvbiA9IChvcHRpb25zPzogVml0ZVN2Z0ljb25zUGx1Z2luKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGljb25EaXJzOiBbcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMvaWNvbnMnKV0sXG4gICAgc3ltYm9sSWQ6ICdpY29uLVtkaXJdLVtuYW1lXScsXG4gICAgaW5qZWN0OiAnYm9keS1sYXN0JyxcbiAgICBjdXN0b21Eb21JZDogJ19fc3ZnX19pY29uc19fZG9tX18nLFxuICB9XG5cbiAgcmV0dXJuIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKSlcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIGltcCBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTRGOURcdThENTZcbiAqIEByZXR1cm5zIGF1dG8gaW1wb3J0IHBsdWdpblxuICpcbiAqIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVxuICovXG5leHBvcnQgY29uc3QgdXNlQXV0b0ltcG9ydCA9IGFzeW5jIChpbXA6IChJbXBvcnRzTWFwIHwgUHJlc2V0TmFtZSlbXSA9IFtdKSA9PlxuICBhdXRvSW1wb3J0KHtcbiAgICBpbmNsdWRlOiBbXG4gICAgICAvXFwuW3RqXXN4PyQvLCAvLyAudHMsIC50c3gsIC5qcywgLmpzeFxuICAgICAgL1xcLnZ1ZSQvLFxuICAgICAgL1xcLnZ1ZVxcP3Z1ZS8sIC8vIC52dWVcbiAgICAgIC9cXC5tZCQvLCAvLyAubWRcbiAgICBdLFxuICAgIGR0czogdHJ1ZSxcbiAgICBpbXBvcnRzOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3BpbmlhJywgJ0B2dWV1c2UvY29yZScsICd2dWUtaTE4bicsIC4uLmltcF0sXG4gIH0pXG5cbi8qKlxuICpcbiAqIEBwYXJhbSByZXNvbHZlcnMgXHU2MzA5XHU5NzAwXHU1MkEwXHU4RjdEXHU0RjlEXHU4RDU2XHU5ODc5XG4gKiBAcGFyYW0gdHlwZXMgXHU2MzA5XHU5NzAwXHU1MkEwXHU4RjdEXHU0RjlEXHU4RDU2XHU3QzdCXHU1NzhCXG4gKlxuICogXHU2MzA5XHU5NzAwXHU1MkEwXHU4RjdEXG4gKi9cbmV4cG9ydCBjb25zdCB1c2VWaXRlQ29tcG9uZW50cyA9IGFzeW5jIChcbiAgcmVzb2x2ZXJzOiAoQ29tcG9uZW50UmVzb2x2ZXIgfCBDb21wb25lbnRSZXNvbHZlcltdKVtdID0gW10sXG4gIHR5cGVzOiBUeXBlSW1wb3J0W10gPSBbXSxcbikgPT5cbiAgdml0ZUNvbXBvbmVudHMoe1xuICAgIGR0czogdHJ1ZSxcbiAgICByZXNvbHZlcnM6IFsuLi5yZXNvbHZlcnNdLFxuICAgIHR5cGVzOiBbXG4gICAgICB7XG4gICAgICAgIGZyb206ICd2dWUtcm91dGVyJyxcbiAgICAgICAgbmFtZXM6IFsnUm91dGVyTGluaycsICdSb3V0ZXJWaWV3J10sXG4gICAgICB9LFxuICAgICAgLi4udHlwZXMsXG4gICAgXSxcbiAgfSlcblxuZXhwb3J0IGNvbnN0IHVzZVZ1ZUkxOG5QbHVnaW4gPSAoKSA9PlxuICB2dWVJMThuUGx1Z2luKHtcbiAgICBydW50aW1lT25seTogdHJ1ZSxcbiAgICBjb21wb3NpdGlvbk9ubHk6IHRydWUsXG4gICAgZm9yY2VTdHJpbmdpZnk6IHRydWUsXG4gICAgZGVmYXVsdFNGQ0xhbmc6ICdqc29uJyxcbiAgICBpbmNsdWRlOiBbcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL2xvY2FsZXMvKionKV0sXG4gIH0pXG5cbi8qKlxuICpcbiAqIEBwYXJhbSB0aXRsZSBcdTZENEZcdTg5QzhcdTU2NjggdGl0bGUgXHU1NDBEXHU3OUYwXG4gKi9cbmV4cG9ydCBjb25zdCBIVE1MVGl0bGVQbHVnaW4gPSAodGl0bGU6IHN0cmluZykgPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdodG1sLXRyYW5zZm9ybScsXG4gICAgdHJhbnNmb3JtSW5kZXhIdG1sOiAoaHRtbDogc3RyaW5nKSA9PiB7XG4gICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKC88dGl0bGU+KC4qPyk8XFwvdGl0bGU+LywgYDx0aXRsZT4ke3RpdGxlfTwvdGl0bGU+YClcbiAgICB9LFxuICB9XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBtb2RlIFx1NjI1M1x1NTMwNVx1NzNBRlx1NTg4M1xuICpcbiAqIEByZW1hcmsgXHU2MjUzXHU1MzA1XHU4RjkzXHU1MUZBXHU2NTg3XHU0RUY2XHU5MTREXHU3RjZFXG4gKi9cbmV4cG9ydCBjb25zdCBidWlsZE9wdGlvbnMgPSAobW9kZTogc3RyaW5nKTogQnVpbGRPcHRpb25zID0+IHtcbiAgY29uc3Qgb3V0RGlyTWFwID0ge1xuICAgIHRlc3Q6ICdkaXN0L3Rlc3QtZGlzdCcsXG4gICAgZGV2ZWxvcG1lbnQ6ICdkaXN0L2RldmVsb3BtZW50LWRpc3QnLFxuICAgIHByb2R1Y3Rpb246ICdkaXN0L3Byb2R1Y3Rpb24tZGlzdCcsXG4gICAgcmVwb3J0OiAnZGlzdC9yZXBvcnQtZGlzdCcsXG4gIH1cbiAgY29uc3QgZGlyUGF0aCA9IG91dERpck1hcFttb2RlXSB8fCAnZGlzdC90ZXN0LWRpc3QnXG5cbiAgaWYgKG1vZGUgPT09ICdwcm9kdWN0aW9uJykge1xuICAgIHJldHVybiB7XG4gICAgICBvdXREaXI6IGRpclBhdGgsXG4gICAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgICBjb21wcmVzczoge1xuICAgICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcbiAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG91dERpcjogZGlyUGF0aCxcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IGZhbHNlLFxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgXHU4MUVBXHU1QjlBXHU0RTQ5XHU2MjUzXHU1MzA1XHU5MTREXHU3RjZFXHU1M0MyXHU2NTcwXG4gKlxuICogQHJlbWFyayBcdTc5RkJcdTk2NjQgY29uc29sZSBkZWJ1Z2dlciBcdTRGMUFcdTY3MDlcdTRFMjVcdTkxQ0RcdTc2ODRcdTUyNkZcdTRGNUNcdTc1MjgsIFx1NTk4Mlx1Njc5QyBjb25zb2xlIFx1OEJFRFx1NTNFNVx1NEUyRFx1NTQyQlx1NjcwOVx1NTNEOFx1OTFDRlx1OEY5M1x1NTFGQSwgXHU1MjE5XHU0RjFBXHU5NjNCXHU2QjYyXHU3OUZCXHU5NjY0XG4gKiBAcmVtYXJrIGNvbnNvbGUgXHU1M0VGXHU4MEZEXHU0RjFBXHU1QkZDXHU4MUY0XHU1MTg1XHU1QjU4XHU2Q0M0XHU2RjBGLCBcdThCRjdcdTZDRThcdTYxMEZcdTRGN0ZcdTc1MjhcbiAqL1xuZXhwb3J0IGNvbnN0IHVzZVZpdGVCdWlsZFBsdWdpbiA9IChvcHRpb25zPzogQnVpbGRPcHRpb25zKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQbHVnaW46IEJ1aWxkT3B0aW9ucyA9IHtcbiAgICBvdXREaXI6ICdkaXN0JywgLy8gXHU2MjUzXHU1MzA1XHU1NDBFXHU2NTg3XHU0RUY2XHU4RjkzXHU1MUZBXHU4REVGXHU1Rjg0XG4gICAgYXNzZXRzRGlyOiAnYXNzZXRzJywgLy8gXHU2MzA3XHU1QjlBXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU1QjU4XHU2NTNFXHU4REVGXHU1Rjg0XG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTYsIC8vIFx1NUMwRlx1NEU4RVx1OEZEOVx1NEUyQVx1NjU3MFx1NUI1NyhcdTVCNTdcdTgyODIpXHU3Njg0XHU5NzU5XHU2MDAxXHU4RDQ0XHU0RUE3XHU2NTg3XHU0RUY2XHU1QzA2XHU4OEFCXHU1MTg1XHU4MDU0XHU0RTNBKGJhc2U2NClcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsIC8vIFx1NjJDNlx1NTIwNmNzc1x1NEVFM1x1NzgwMVxuICAgIG1pbmlmeTogJ2VzYnVpbGQnLCAvLyBcdTYzMDdcdTVCOUFcdTRGN0ZcdTc1MjhcdTZERjdcdTZEQzZcdTU2NjggKHRlcnNlciB8IGVzYnVpbGQpXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICBjb21wcmVzczoge1xuICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsIC8vIFx1NjI1M1x1NTMwNVx1NTQwRVx1NzlGQlx1OTY2NGNvbnNvbGVcbiAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSwgLy8gXHU2MjUzXHU1MzA1XHU1NDBFXHU3OUZCXHU5NjY0ZGVidWdnZXJcbiAgICAgIH0sXG4gICAgfSxcbiAgfVxuXG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0UGx1Z2luLCBvcHRpb25zKVxufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyBcdTk4ODRcdTU5MDRcdTc0MDYgY3NzIFx1NjU4N1x1NEVGNlxuICogQHJldHVybnMgYWRkaXRpb25hbERhdGEgc3RyaW5nXG4gKlxuICogQHJlbWFyayBcdThGODVcdTUyQTlcdTU5MDRcdTc0MDZcdTk3MDBcdTg5ODFcdTUxNjhcdTVDNDBcdTZDRThcdTUxNjVcdTc2ODQgY3NzIFx1NjgzN1x1NUYwRlx1NjU4N1x1NEVGNiwgXHU0RjFBXHU1NzI4XHU2Nzg0XHU1RUZBXHU2NzFGXHU5NUY0XHU1QjhDXHU2MjEwXHU2Q0U4XHU1MTY1XG4gKi9cbmV4cG9ydCBjb25zdCBtaXhpbkNTU1BsdWdpbiA9IChvcHRpb25zPzogc3RyaW5nW10pID0+IHtcbiAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSBbXVxuXG4gIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgZGVmYXVsdE9wdGlvbnMucHVzaCguLi5vcHRpb25zKVxuICB9XG5cbiAgY29uc3QgbWl4aXNTdHJpbmcgPSBkZWZhdWx0T3B0aW9ucy5yZWR1Y2UoKHByZSwgY3VycikgPT4ge1xuICAgIGNvbnN0IHRlbXAgPSBgQGltcG9ydCBcIiR7Y3Vycn1cIjtgXG5cbiAgICByZXR1cm4gKHByZSArPSB0ZW1wKVxuICB9LCAnJylcblxuICByZXR1cm4gbWl4aXNTdHJpbmcgYXMgc3RyaW5nXG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kYWlndWEvRG9jdW1lbnRzL3JheS10ZW1wbGF0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RhaWd1YS9Eb2N1bWVudHMvcmF5LXRlbXBsYXRlL2NmZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZGFpZ3VhL0RvY3VtZW50cy9yYXktdGVtcGxhdGUvY2ZnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xuXG5pbXBvcnQge1xuICBIVE1MVGl0bGVQbHVnaW4sXG4gIGJ1aWxkT3B0aW9ucyxcbiAgbWl4aW5DU1NQbHVnaW4sXG59IGZyb20gJy4vdml0ZS1wbHVnaW4vaW5kZXgnXG5cbmltcG9ydCB0eXBlIHsgQXBwQ29uZmlnRXhwb3J0IH0gZnJvbSAnLi9zcmMvdHlwZXMvY2ZnJ1xuXG5jb25zdCBjb25maWc6IEFwcENvbmZpZ0V4cG9ydCA9IHtcbiAgLyoqIFx1OUVEOFx1OEJBNFx1NEUzQlx1OTg5OFx1ODI3MiAqL1xuICBwcmltYXJ5Q29sb3I6ICcjMmQ4Y2YwJyxcbiAgLyoqXG4gICAqXG4gICAqIFx1OTE0RFx1N0Y2RVx1NjgzOVx1OTg3NVx1OTc2MlxuICAgKiBcdThCRTVcdTk4NzlcdTc2RUVcdTYyNDBcdTY3MDlcdTkxQ0RcdTVCOUFcdTU0MTFcdTgxRjNcdTk5OTZcdTk4NzUsIFx1OTBGRFx1NEY5RFx1OEQ1Nlx1OEJFNVx1OTE0RFx1N0Y2RVx1OTg3OVxuICAgKlxuICAgKiBcdTU5ODJcdTY3OUNcdTRGRUVcdTY1MzlcdTRFODZcdThCRTVcdTk4NzlcdTc2RUVcdTc2ODRcdTk5OTZcdTk4NzVcdThERUZcdTc1MzFcdTkxNERcdTdGNkUsIFx1OTcwMFx1ODk4MVx1NjZGNFx1NjUzOVx1OEJFNVx1OTE0RFx1N0Y2RVx1OTg3OSwgXHU0RUU1XHU1MTREXHU5MUNEXHU1QjlBXHU1NDExXHU5OTk2XHU5ODc1XHU2NENEXHU0RjVDXHU1MUZBXHU3M0IwXHU5NTE5XHU4QkVGXG4gICAqL1xuICByb290Um91dGU6IHtcbiAgICBuYW1lOiAnZGFzaGJvYXJkJyxcbiAgICBwYXRoOiAnL2Rhc2hib2FyZCcsXG4gIH0sXG4gIC8qKlxuICAgKlxuICAgKiBpY29uOiBMT0dPIFx1NTZGRVx1NjgwNywgXHU0RjlEXHU4RDU2IGBSYXlJY29uYCBcdTVCOUVcdTczQjBcbiAgICogdGl0bGU6IExPR08gXHU2ODA3XHU5ODk4XG4gICAqIHVybDogXHU3MEI5XHU1MUZCXHU4REYzXHU4RjZDXHU1NzMwXHU1NzQwLCBcdTU5ODJcdTY3OUNcdTRFMERcdTkxNERcdTdGNkVcdThCRTVcdTVDNUVcdTYwMjcsIFx1NTIxOVx1NEUwRFx1NEYxQVx1ODlFNlx1NTNEMVx1OERGM1x1OEY2Q1xuICAgKiBqdW1wVHlwZTogXHU4REYzXHU4RjZDXHU3QzdCXHU1NzhCXHVGRjA4c3RhdGlvbjogXHU5ODc5XHU3NkVFXHU1MTg1XHU4REYzXHU4RjZDLCBvdXRzaWRlU3RhdGlvbjogXHU2NUIwXHU5ODc1XHU5NzYyXHU2MjUzXHU1RjAwXHVGRjA5XG4gICAqXG4gICAqIFx1NTk4Mlx1Njc5Q1x1NEUwRFx1OEJCRVx1N0Y2RVx1OEJFNVx1NUM1RVx1NjAyN1x1NjIxNlx1ODAwNVx1NEUzQVx1N0E3QSwgXHU1MjE5XHU0RTBEXHU0RjFBXHU2RTMyXHU2N0QzIExPR09cbiAgICovXG4gIHNpZGVCYXJMb2dvOiB7XG4gICAgaWNvbjogJ3JheScsXG4gICAgdGl0bGU6ICdSYXkgVGVtcGxhdGUnLFxuICAgIHVybDogJy9kYXNoYm9hcmQnLFxuICAgIGp1bXBUeXBlOiAnc3RhdGlvbicsXG4gIH0sXG4gIC8qKlxuICAgKlxuICAgKiBcdTk4ODRcdTU5MDRcdTc0MDZcdTUxNjhcdTVDNDBcdTk3MDBcdTg5ODFcdTZDRThcdTUxNjVcdTc2ODQgY3NzIFx1NjU4N1x1NEVGNlxuICAgKlxuICAgKiBcdTk4ODRcdThCQkU6XG4gICAqICAgLSAuL3NyYy9zdHlsZXMvbWl4aW5zLnNjc3NcbiAgICogICAtIC4vc3JjL3N0eWxlcy9zZXR0aW5nLnNjc3NcbiAgICogICAtIC4vc3JjL3N0eWxlcy90aGVtZS5zY3NzXG4gICAqXG4gICAqIFx1NTk4Mlx1Njc5Q1x1OTcwMFx1ODk4MVx1NTIyMFx1OTY2NFx1NjIxNlx1ODAwNVx1NEZFRVx1NjUzOSwgXHU5NzAwXHU4OTgxXHU1NDBDXHU2QjY1XHU0RkVFXHU2NTM5XHU3NkVFXHU1RjU1XHU0RTBCXHU3Njg0IGNzcyBcdTY1ODdcdTRFRjZcbiAgICovXG4gIG1peGluQ1NTOiBtaXhpbkNTU1BsdWdpbihbXG4gICAgJy4vc3JjL3N0eWxlcy9taXhpbnMuc2NzcycsXG4gICAgJy4vc3JjL3N0eWxlcy9zZXR0aW5nLnNjc3MnLFxuICAgICcuL3NyYy9zdHlsZXMvdGhlbWUuc2NzcycsXG4gIF0pLFxuICAvKipcbiAgICpcbiAgICogXHU3MjQ4XHU2NzQzXHU0RkUxXHU2MDZGXG4gICAqXG4gICAqIFx1NEU1Rlx1NTNFRlx1NEVFNVx1NUY1M1x1NEY1Q1x1OTg3NVx1NUU5NVx1OEJCRVx1N0Y2RSwgXHU3NzBCXHU1QjlFXHU5NjQ1XHU0RTFBXHU1MkExXHU5NzAwXHU2QzQyXG4gICAqL1xuICBjb3B5cmlnaHQ6ICdDb3B5cmlnaHQgXHUwMEE5IDIwMjItcHJlc2VudCBSYXknLFxuICAvKipcbiAgICpcbiAgICogXHU2RDRGXHU4OUM4XHU1NjY4XHU2ODA3XHU5ODk4XG4gICAqL1xuICB0aXRsZTogSFRNTFRpdGxlUGx1Z2luKCdyYXkgdGVtcGxhdGUnKSxcbiAgLyoqXG4gICAqXG4gICAqIFx1OTE0RFx1N0Y2RSBITVIgXHU3Mjc5XHU1QjlBXHU5MDA5XHU5ODc5XHVGRjA4XHU3QUVGXHU1M0UzXHUzMDAxXHU0RTNCXHU2NzNBXHUzMDAxXHU4REVGXHU1Rjg0XHU1NDhDXHU1MzRGXHU4QkFFXHVGRjA5XG4gICAqL1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgcG9ydDogOTUyNyxcbiAgICBvcGVuOiBmYWxzZSxcbiAgICBodHRwczogZmFsc2UsXG4gICAgc3RyaWN0UG9ydDogZmFsc2UsXG4gICAgZnM6IHtcbiAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgICBhbGxvdzogW10sXG4gICAgfSxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ3VybCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcbiAgICAgIH0sXG4gICAgICAnL29mZmljZSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9vZmZpY2UueWthLm9uZS8nLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9vZmZpY2UvLCAnJyksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIC8qKlxuICAgKlxuICAgKiBcdTYyNTNcdTUzMDVcdTc2RjhcdTUxNzNcdTkxNERcdTdGNkVcbiAgICovXG4gIGJ1aWxkT3B0aW9uczogYnVpbGRPcHRpb25zLFxuICAvKipcbiAgICpcbiAgICogXHU5ODg0XHU4QkJFXHU1MjJCXHU1NDBEXG4gICAqIC0gYEBgOiBgc3JjYCBcdTY4MzlcdTc2RUVcdTVGNTVcbiAgICogLSBgQHVzZS11dGlsc2A6IGBzcmMvdXRpbHNgIFx1NjgzOVx1NzZFRVx1NUY1NVxuICAgKiAtIGBAdXNlLWFwaWA6IGBzcmMvYXhpb3MvYXBpYCBcdTY4MzlcdTc2RUVcdTVGNTVcbiAgICogLSBgQHVzZS1pbWFnZXNgOiBgc3JjL2Fzc2V0cy9pbWFnZXNgIFx1NjgzOVx1NzZFRVx1NUY1NVxuICAgKi9cbiAgYWxpYXM6IFtcbiAgICB7XG4gICAgICBmaW5kOiAnQCcsXG4gICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgfSxcbiAgICB7XG4gICAgICBmaW5kOiAnQHVzZS11dGlscycsXG4gICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3V0aWxzJyksXG4gICAgfSxcbiAgICB7XG4gICAgICBmaW5kOiAnQHVzZS1hcGknLFxuICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9heGlvcy9hcGknKSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGZpbmQ6ICdAdXNlLWltYWdlcycsXG4gICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2Fzc2V0cy9pbWFnZXMnKSxcbiAgICB9LFxuICBdLFxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25maWdcbiIsICJ7XG4gIFwibmFtZVwiOiBcInJheS10ZW1wbGF0ZVwiLFxuICBcInByaXZhdGVcIjogdHJ1ZSxcbiAgXCJ2ZXJzaW9uXCI6IFwiMy4xLjZcIixcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJkZXZcIjogXCJ2aXRlXCIsXG4gICAgXCJidWlsZFwiOiBcInZ1ZS10c2MgLS1ub0VtaXQgJiYgdml0ZSBidWlsZCAtLW1vZGUgcHJvZHVjdGlvblwiLFxuICAgIFwicHJldmlld1wiOiBcInZpdGUgcHJldmlld1wiLFxuICAgIFwidGVzdFwiOiBcInZ1ZS10c2MgLS1ub0VtaXQgJiYgdml0ZSBidWlsZCAtLW1vZGUgdGVzdFwiLFxuICAgIFwiZGV2LWJ1aWxkXCI6IFwidnVlLXRzYyAtLW5vRW1pdCAmJiB2aXRlIGJ1aWxkIC0tbW9kZSBkZXZlbG9wbWVudFwiLFxuICAgIFwicmVwb3J0XCI6IFwidnVlLXRzYyAtLW5vRW1pdCAmJiB2aXRlIGJ1aWxkIC0tbW9kZSByZXBvcnRcIixcbiAgICBcInByZXBhcmVcIjogXCJodXNreSBpbnN0YWxsXCJcbiAgfSxcbiAgXCJsaW50LXN0YWdlZFwiOiB7XG4gICAgXCJzcmMvKiovKi57dnVlLGpzeCx0cyx0c3gsanNvbn1cIjogW1xuICAgICAgXCJwcmV0dGllciAtLXdyaXRlXCIsXG4gICAgICBcImVzbGludFwiLFxuICAgICAgXCJnaXQgYWRkXCJcbiAgICBdXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkB2dWV1c2UvY29yZVwiOiBcIl45LjEuMFwiLFxuICAgIFwiYW1mZS1mbGV4aWJsZVwiOiBcIl4yLjIuMVwiLFxuICAgIFwiYXhpb3NcIjogXCJeMS4yLjBcIixcbiAgICBcImNyeXB0by1qc1wiOiBcIl40LjEuMVwiLFxuICAgIFwiZGF5anNcIjogXCJeMS4xMS43XCIsXG4gICAgXCJlY2hhcnRzXCI6IFwiXjUuNC4wXCIsXG4gICAgXCJsb2Rhc2gtZXNcIjogXCJeNC4xNy4yMVwiLFxuICAgIFwibmFpdmUtdWlcIjogXCJeMi4zNC4zXCIsXG4gICAgXCJwaW5pYVwiOiBcIl4yLjAuMTdcIixcbiAgICBcInBpbmlhLXBsdWdpbi1wZXJzaXN0ZWRzdGF0ZVwiOiBcIl4yLjQuMFwiLFxuICAgIFwicHJpbnQtanNcIjogXCJeMS42LjBcIixcbiAgICBcInFyY29kZS52dWVcIjogXCJeMy4zLjRcIixcbiAgICBcInNhc3NcIjogXCJeMS41NC4zXCIsXG4gICAgXCJzY3JlZW5mdWxsXCI6IFwiXjYuMC4yXCIsXG4gICAgXCJ2dWVcIjogXCJeMy4yLjM3XCIsXG4gICAgXCJ2dWUtaTE4blwiOiBcIl45LjIuMlwiLFxuICAgIFwidnVlLXJvdXRlclwiOiBcIl40LjEuM1wiLFxuICAgIFwidnVlZHJhZ2dhYmxlXCI6IFwiXjQuMS4wXCIsXG4gICAgXCJ4bHN4XCI6IFwiXjAuMTguNVwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBiYWJlbC9jb3JlXCI6IFwiXjcuMjAuMlwiLFxuICAgIFwiQGJhYmVsL2VzbGludC1wYXJzZXJcIjogXCJeNy4xOS4xXCIsXG4gICAgXCJAY29tbWl0bGludC9jbGlcIjogXCJeMTcuNC4yXCIsXG4gICAgXCJAY29tbWl0bGludC9jb25maWctY29udmVudGlvbmFsXCI6IFwiXjE3LjQuMlwiLFxuICAgIFwiQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG5cIjogXCJeMC41LjBcIixcbiAgICBcIkB0eXBlcy9jcnlwdG8tanNcIjogXCJeNC4xLjFcIixcbiAgICBcIkB0eXBlcy9zY3JvbGxyZXZlYWxcIjogXCJeMC4wLjhcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjUuNDIuMVwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl41LjQyLjFcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiOiBcIl4zLjAuMFwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiOiBcIl4yLjAuMFwiLFxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuOFwiLFxuICAgIFwiZGVwY2hlY2tcIjogXCJeMS40LjNcIixcbiAgICBcImVzbGludFwiOiBcIl44LjAuMVwiLFxuICAgIFwiZXNsaW50LWNvbmZpZy1wcmV0dGllclwiOiBcIl44LjUuMFwiLFxuICAgIFwiZXNsaW50LWNvbmZpZy1zdGFuZGFyZC13aXRoLXR5cGVzY3JpcHRcIjogXCJeMjMuMC4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLWltcG9ydFwiOiBcIl4yLjI1LjJcIixcbiAgICBcImVzbGludC1wbHVnaW4tblwiOiBcIl4xNS4wLjBcIixcbiAgICBcImVzbGludC1wbHVnaW4tcHJldHRpZXJcIjogXCJeNC4yLjFcIixcbiAgICBcImVzbGludC1wbHVnaW4tcHJvbWlzZVwiOiBcIl42LjAuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdFwiOiBcIl43LjMxLjEwXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXZ1ZVwiOiBcIl45LjcuMFwiLFxuICAgIFwiaHVza3lcIjogXCJeOC4wLjNcIixcbiAgICBcImxpbnQtc3RhZ2VkXCI6IFwiXjEzLjEuMFwiLFxuICAgIFwicG9zdGNzc1wiOiBcIl44LjEuMFwiLFxuICAgIFwicG9zdGNzcy1weC10by12aWV3cG9ydFwiOiBcIl4xLjEuMVwiLFxuICAgIFwicHJldHRpZXJcIjogXCJeMi43LjFcIixcbiAgICBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiOiBcIl41LjguM1wiLFxuICAgIFwic3ZnLXNwcml0ZS1sb2FkZXJcIjogXCJeNi4wLjExXCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiKlwiLFxuICAgIFwidW5wbHVnaW4tYXV0by1pbXBvcnRcIjogXCJeMC4xMS4wXCIsXG4gICAgXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50c1wiOiBcIl4wLjIyLjBcIixcbiAgICBcInZpdGVcIjogXCJeNC4xLjRcIixcbiAgICBcInZpdGUtcGx1Z2luLWNvbXByZXNzaW9uXCI6IFwiXjAuNS4xXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1lc2xpbnRcIjogXCJeMS44LjFcIixcbiAgICBcInZpdGUtcGx1Z2luLWltcFwiOiBcIl4yLjMuMVwiLFxuICAgIFwidml0ZS1wbHVnaW4taW5zcGVjdFwiOiBcIl4wLjYuMFwiLFxuICAgIFwidml0ZS1wbHVnaW4tc3ZnLWljb25zXCI6IFwiXjIuMC4xXCIsXG4gICAgXCJ2aXRlLXN2Zy1sb2FkZXJcIjogXCJeMy40LjBcIixcbiAgICBcInZ1ZS10c2NcIjogXCJeMS4wLjlcIlxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThSLFNBQVMsb0JBQW9CO0FBQzNULE9BQU8sU0FB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QUNYLGlCQUFpQjtBQUFBLFFBQ2YsYUFBYTtBQUFBO0FBQUEsUUFDYixlQUFlO0FBQUE7QUFBQSxRQUNmLGFBQWE7QUFBQTtBQUFBLFFBQ2IsT0FBTztBQUFBO0FBQUEsUUFDUCxTQUFTLENBQUMsc0JBQXNCLGVBQWU7QUFBQSxRQUMvQyxTQUFTLENBQUMsZUFBZSxnQkFBZ0IsY0FBYztBQUFBLE1BQ3pELENBQUM7QUFBQSxNQUNELGNBQWM7QUFBQSxRQUNaLFNBQVM7QUFBQSxVQUNQO0FBQUEsWUFDRSxTQUFTO0FBQUEsWUFDVCxjQUFjO0FBQUEsWUFDZCx5QkFBeUI7QUFBQSxVQUMzQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFNBQVM7QUFBQSxZQUNULGNBQWM7QUFBQSxZQUNkLHlCQUF5QjtBQUFBLFVBQzNCO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0Q7QUFBQSxRQUNFLFNBQVM7QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsV0FBVztBQUFBLFFBQ1QsVUFBVTtBQUFBO0FBQUEsUUFDVixZQUFZO0FBQUE7QUFBQSxRQUNaLFVBQVU7QUFBQTtBQUFBLFFBQ1YsVUFBVTtBQUFBLFFBQ1YsTUFBTSxTQUFTLFdBQVcsT0FBTztBQUFBO0FBQUEsTUFDbkMsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVMsQ0FBQyxPQUFPLGNBQWMsU0FBUyxZQUFZLGNBQWM7QUFBQSxJQUNwRTtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsTUFBTSxDQUFDLGFBQWE7QUFBQSxJQUN0QjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsR0FBR0EsY0FBYSxJQUFJO0FBQUEsTUFDcEIsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ04sY0FBYyxDQUFDLE9BQU87QUFDcEIsZ0JBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixxQkFBTyxHQUNKLFNBQVMsRUFDVCxNQUFNLGVBQWUsRUFBRSxDQUFDLEVBQ3hCLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFDWixTQUFTO0FBQUEsWUFDZDtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQSxVQUNKLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1Asa0JBQWtCO0FBQUEsTUFDcEI7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixHQUFHO0FBQUEsSUFDTDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJ0aXRsZSIsICJwYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgInBhdGgiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAiYnVpbGRPcHRpb25zIl0KfQo=
