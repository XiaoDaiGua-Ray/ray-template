/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />
/// <reference types="vite-svg-loader" />

import 'vue-router'
import { AppRouteMeta } from '@/router/type'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-router' {
  interface RouteMeta extends AppRouteMeta {}
}

declare module 'virtual:*' {
  const result: any
  export default result
}

declare module '*.json' {
  const jsonContent: any
  export default jsonContent
}
