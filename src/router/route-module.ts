import type { AppRouteRecordRaw } from '@/router/type'

import dashboard from './modules/dashboard'
import reyl from './modules/rely'
import error from './modules/error'
import echart from './modules/echart'
import scrollReveal from './modules/scroll-reveal'
import axios from './modules/axios'
import table from './modules/table'
import doc from './modules/doc'
import multiMenu from './modules/multi-menu'
import docLocal from './modules/doc-local'
import office from './modules/office'

const routes: AppRouteRecordRaw[] = [
  dashboard,
  office,
  echart,
  table,
  axios,
  scrollReveal,
  error,
  multiMenu,
  doc,
  docLocal,
  reyl,
]

export default routes

/**
 *
 * 弃用自动导入路由模块方式
 *
 * 采用手动引入子路由模块方式
 *
 * 因为自动导入路由方式在实际体验后还是有一些小问题, 综合考虑后, 还是自己手动挡吧
 */
