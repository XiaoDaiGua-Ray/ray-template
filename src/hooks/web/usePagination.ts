import { omit } from 'lodash-es'
import { effectDispose } from '@/utils'

import type { AnyFC } from '@/types'
import type { PaginationProps } from 'naive-ui'
import type { Ref } from 'vue'

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
 */
export const usePagination = <T extends AnyFC>(
  callback?: T,
  options?: UsePaginationOptions,
) => {
  const callbackRef = ref(callback)
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
      paginationRef.value.page = page

      callbackRef.value?.()
    },
    onUpdatePageSize: (pageSize: number) => {
      paginationRef.value.pageSize = pageSize
      paginationRef.value.page = 1

      callbackRef.value?.()
    },
  }
  const paginationRef = ref<PaginationProps>(
    Object.assign({}, defaultOptions, omitOptions, methodsOptions),
  )

  const updatePage = paginationRef.value.onUpdatePage as (page: number) => void
  const updatePageSize = paginationRef.value.onUpdatePageSize as (
    pageSize: number,
  ) => void

  /**
   *
   * @description
   * 获取总条数。
   */
  const getItemCount = () => paginationRef.value.itemCount as number

  /**
   *
   * @param itemCount 总条数
   *
   * @description
   * 设置总条数。
   */
  const setItemCount = (itemCount: number) => {
    paginationRef.value.itemCount = itemCount
  }

  /**
   *
   * @description
   * 获取当前页页码。
   */
  const getPage = () => paginationRef.value.page as number

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
  const getPageSize = () => paginationRef.value.pageSize as number

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
  const getPagination = () => paginationRef.value as UsePaginationOptions

  /**
   *
   * @description
   * 获取回调函数。
   */
  const getCallback = callback

  /**
   *
   * @param callback 页码、页条数更新时的回调函数
   *
   * @description
   * 手动设置回调函数。
   *
   * @example
   * setCallback(() => {})
   */
  const setCallback = (callback: T) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callbackRef.value = callback as any
  }

  effectDispose(() => {
    callbackRef.value = void 0
  })

  return [
    paginationRef as Ref<UsePaginationOptions>,
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
      setCallback,
    },
  ] as const
}

export type UsePaginationReturn = ReturnType<typeof usePagination>
