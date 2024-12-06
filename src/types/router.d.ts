export {}

import 'vue-router'

import type { AppRouteMeta } from '@/router/types'

declare module 'vue-router' {
  interface RouteMeta extends AppRouteMeta {}
}
