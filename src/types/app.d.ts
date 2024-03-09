/* eslint-disable @typescript-eslint/no-explicit-any */

import 'vue-router'

import type { AppRouteMeta } from '@/router/types'

declare module 'vue-router' {
  interface RouteMeta extends AppRouteMeta {}
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const Component: DefineComponent<{}, {}, any>
  export default Component
}

declare module 'virtual:*' {
  const result: any
  export default result
}

declare module '*.json' {
  const jsonContent: Record<string, any>
  export default jsonContent
}
