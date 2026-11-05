import { call } from '@ray-template/composables/vue/call'
import type { PaginationProps } from 'naive-ui'

export const splitPaginationOptions = (options: PaginationProps = {}) => {
  const {
    onUpdatePage,
    'onUpdate:page': updatePage,
    onChange,
    onUpdatePageSize,
    'onUpdate:pageSize': updatePageSize,
    onPageSizeChange,
    ...view
  } = options

  return {
    view,
    notifyPage: (page: number) => {
      for (const handler of [onChange, onUpdatePage, updatePage])
        if (handler) call(handler, page)
    },
    notifyPageSize: (size: number) => {
      for (const handler of [
        onPageSizeChange,
        onUpdatePageSize,
        updatePageSize,
      ])
        if (handler) call(handler, size)
    },
  }
}
