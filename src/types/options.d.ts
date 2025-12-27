import type {
  NavigationGuardNext,
  RouteLocationNormalizedGeneric,
} from 'vue-router'

export {}

// 为 defineComponent 添加自定义选项
// https://cn.vuejs.org/guide/typescript/options-api.html#augmenting-custom-options
declare module 'vue' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
  interface ComponentCustomOptions {}
}
