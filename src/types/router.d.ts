import 'vue-router'
import type { AppRouteMeta } from '@/router/types'

export {}

declare module 'vue-router' {
  interface RouteMeta extends AppRouteMeta {}
}
