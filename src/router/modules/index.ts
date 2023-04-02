import dashboard from './dashboard'
import reyl from './rely'
import error from './error'
import echart from './echart'
import scrollReveal from './scroll-reveal'
import axios from './axios'
import table from './table'
import doc from './doc'
import multiMenu from './multi-menu'
import docLocal from './doc-local'
import office from './office'

const routes = [
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
