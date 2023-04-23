/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const Component: DefineComponent<{}, {}, any>
  export default Component
}

declare module 'virtual:*' {
  const result: any
  export default result
}
