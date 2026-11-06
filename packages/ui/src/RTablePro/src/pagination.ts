import { call } from '@ray-template/composables/vue/call'
import { omit } from 'lodash-es'
import type { TableProPagination } from './types'

/**
 *
 * @param options 调用方分页配置
 *
 * @description
 * 分离展示配置与当前更新事件；移除旧版 change 字段，避免传入原生组件后重复触发或产生弃用警告。
 *
 * @returns 展示参数及页码、页容量通知方法
 */
export const splitPaginationOptions = (options: TableProPagination = {}) => {
  const {
    onUpdatePage,
    'onUpdate:page': updatePage,
    onUpdatePageSize,
    'onUpdate:pageSize': updatePageSize,
    ...view
  } = options

  return {
    view: omit(view, ['onChange', 'onPageSizeChange']),
    notifyPage: (page: number) => {
      for (const handler of [onUpdatePage, updatePage])
        if (handler) call(handler, page)
    },
    notifyPageSize: (size: number) => {
      for (const handler of [onUpdatePageSize, updatePageSize])
        if (handler) call(handler, size)
    },
  }
}
