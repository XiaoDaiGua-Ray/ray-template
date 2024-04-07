import { omit } from '@/utils'

import type { AnyFC } from '@/types'
import type { PaginationProps } from 'naive-ui'

type OmitKeys =
  | 'themeOverrides'
  | 'theme'
  | 'on-update:page'
  | 'on-update:page-size'
  | 'onUpdatePage'
  | 'onUpdatePageSize'
  | 'onUpdate:page'
  | 'onUpdate:page-size'

export interface UsePaginationOptions extends Omit<PaginationProps, OmitKeys> {}

const defaultOptions: UsePaginationOptions = {
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
}

/**
 *
 * @param callback 页码、页条数更新时的回调函数
 * @param options 配置项
 *
 * @description
 * 便捷分页 hook。
 *
 * @warning
 * callback 暂不支持异步函数。
 */
export const usePagination = <T extends AnyFC>(
  callback: T,
  options?: UsePaginationOptions,
) => {
  if (typeof callback !== 'function') {
    throw new Error(
      '[usePagination]: callback expected a function, but got ' +
        typeof callback,
    )
  }

  const omitOptions = omit(options, [
    'on-update:page',
    'on-update:page-size',
    'onUpdatePage',
    'onUpdatePageSize',
    'onUpdate:page',
    'onUpdate:page-size',
  ])
  const methodsOptions = {
    onUpdatePage: (page: number) => {
      paginationRef.page = page

      callback()
    },
    onUpdatePageSize: (pageSize: number) => {
      paginationRef.pageSize = pageSize
      paginationRef.page = 1

      callback()
    },
  }
  const paginationRef = reactive<PaginationProps>(
    Object.assign({}, defaultOptions, omitOptions, methodsOptions),
  )

  const updatePage = paginationRef.onUpdatePage as (page: number) => void
  const updatePageSize = paginationRef.onUpdatePageSize as (
    pageSize: number,
  ) => void

  /**
   *
   * @description
   * 获取总条数。
   */
  const getItemCount = () => paginationRef.itemCount

  /**
   *
   * @param itemCount 总条数
   *
   * @description
   * 设置总条数。
   */
  const setItemCount = (itemCount: number) => {
    paginationRef.itemCount = itemCount
  }

  /**
   *
   * @description
   * 获取当前页页码。
   */
  const getPage = () => paginationRef.page

  /**
   *
   * @param page 当前页页码
   *
   * @description
   * 设置当前页页码。
   *
   * 为了避免响应式丢失，手动调用 updatePage 方法。
   */
  const setPage = (page: number) => {
    updatePage(page)
  }

  /**
   *
   * @description
   * 获取每页条数。
   */
  const getPageSize = () => paginationRef.pageSize

  /**
   *
   * @param pageSize 每页条数
   *
   * @description
   * 设置每页条数。
   *
   * 为了避免响应式丢失，手动调用 updatePageSize 方法。
   */
  const setPageSize = (pageSize: number) => {
    updatePageSize(pageSize)
  }

  /**
   *
   * @description
   * 获取分页配置，通常可以用来传递给 RTable 组件。
   */
  const getPagination = () => paginationRef as UsePaginationOptions

  /**
   *
   * @description
   * 获取回调函数。
   */
  const getCallback = callback

  return [
    paginationRef as PaginationProps,
    {
      updatePage,
      updatePageSize,
      getItemCount,
      setItemCount,
      getPage,
      setPage,
      getPageSize,
      setPageSize,
      getPagination,
      getCallback,
    },
  ] as const
}

export type UsePaginationReturn = ReturnType<typeof usePagination>
