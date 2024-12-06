export {}

import type { useRoute, useRouter } from 'vue-router'

// 为 vue 添加一些自定义属性
// https://cn.vuejs.org/guide/typescript/options-api#augmenting-global-properties
declare module 'vue' {
  interface ComponentCustomProperties {
    $router: ReturnType<typeof useRouter>
    $route: ReturnType<typeof useRoute>
  }
}
