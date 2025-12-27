import type { AnyFn } from '@/types'
import { effectDispose } from '@/utils'
import { omit } from 'lodash-es'
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
  | 'onUpdate:pageSize'

export interface UsePaginationOptions extends Omit<PaginationProps, OmitKeys> {
  /**
   *
   * @param page 当前分页页码
   *
   * @description
   * 分页页码更新的回调函数。
   */
  pageChange?: (page: number) => void
  /**
   *
   * @param pageSize 当前分页条数
   *
   * @description
   * 分页页数更新回调函数。
   */
  pageSizeChange?: (pageSize: number) => void
}

const DEFAULT_OPTIONS: UsePaginationOptions = {
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
 * Naive UI Pagination 便捷分页 hook。
 *
 * @example
 * const [paginationRef, { getItemCount, setItemCount, getPage, setPage, getPageSize, setPageSize, getPagination, getCallback, setCallback, resetPagination }] = usePagination(() => {
 *   // do something...
 * }, {
 *   // ...options
 * })
 */
export const usePagination = <T extends AnyFn>(
  callback?: T,
  options?: UsePaginationOptions,
) => {
  // 回调函数
  const callbackRef = shallowRef(callback)
  // 分页方法
  const paginationMethods = {
    onUpdatePage: (page: number) => {
      const { pageChange } = mergedOptions.value

      paginationRef.value.page = page

      callbackRef.value?.()
      pageChange?.(page)
    },
    onUpdatePageSize: (pageSize: number) => {
      const { pageSizeChange } = mergedOptions.value

      paginationRef.value.pageSize = pageSize
      paginationRef.value.page = DEFAULT_OPTIONS.page

      callbackRef.value?.()
      pageSizeChange?.(pageSize)
    },
  }
  // 配置合并
  const mergedOptions = computed(() => ({
    ...DEFAULT_OPTIONS,
    ...omit(options, [
      'on-update:page',
      'on-update:page-size',
      'onUpdatePage',
      'onUpdatePageSize',
      'onUpdate:page',
      'onUpdate:page-size',
      'onUpdate:pageSize',
    ]),
    ...paginationMethods,
  }))
  // 分页配置
  const paginationRef = ref<PaginationProps>(mergedOptions.value)

  // 更新分页页数
  const updatePage = paginationRef.value.onUpdatePage as (page: number) => void

  // 更新分页每页条数
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
  const getCallback = <Fn extends AnyFn = T>(): Fn extends
    | undefined
    | null
    | unknown
    ? T
    : Fn => callbackRef.value

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
  const setCallback = <Fn extends AnyFn = AnyFn>(callback: Fn) => {
    callbackRef.value = callback
  }

  /**
   *
   * @description
   * 初始化分页。
   *
   * 重置页码为 1，每页条数为 pageSizes 的第一个值。
   * 如果，pageSizes 为空，则设置每页条数为 10。
   */
  const resetPagination = () => {
    const { pageSizes, pageChange, pageSizeChange } = mergedOptions.value

    paginationRef.value.page = DEFAULT_OPTIONS.page
    paginationRef.value.pageSize =
      (pageSizes?.[0] as number) || DEFAULT_OPTIONS.pageSize

    callbackRef.value?.()

    pageChange?.(paginationRef.value.page!)
    pageSizeChange?.(paginationRef.value.pageSize!)
  }

  effectDispose(() => {
    callbackRef.value = void 0
  })

  return [
    paginationRef as Ref<UsePaginationOptions>,
    {
      getItemCount,
      setItemCount,
      getPage,
      setPage,
      getPageSize,
      setPageSize,
      getPagination,
      getCallback,
      setCallback,
      resetPagination,
    },
  ] as const
}

export type UsePaginationReturn = ReturnType<typeof usePagination>
