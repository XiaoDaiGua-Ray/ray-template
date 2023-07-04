/// <reference types="./types/global.d.ts" />
/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />
/// <reference types="vite-svg-loader" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
