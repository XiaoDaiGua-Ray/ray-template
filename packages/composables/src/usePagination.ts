import { omit } from 'lodash-es'
import type { PaginationProps } from 'naive-ui'
import { computed, ref, shallowRef } from 'vue'
import type { Ref } from 'vue'
import { effectDispose } from './vue/effect-dispose'

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
  /** 页码更新后接收新页码。 */
  pageChange?: (page: number) => void
  /** 每页条数更新后接收新条数。 */
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
 * @param callback 页码或每页条数变化后的回调
 * @param options 初始分页配置和事件回调
 *
 * @description
 * 切换每页条数时先将页码复位，再通知回调。
 *
 * @returns 分页组件配置的引用以及读写和重置方法。
 */
export const usePagination = (
  callback?: () => void,
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

  const getItemCount = () => paginationRef.value.itemCount ?? 0

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

  const getPage = () => paginationRef.value.page as number

  /**
   *
   * @param page 新页码
   *
   * @description
   * 通过同一个更新路径通知组件和手动设置的回调。
   */
  const setPage = (page: number) => {
    paginationMethods.onUpdatePage(page)
  }

  const getPageSize = () => paginationRef.value.pageSize as number

  /**
   *
   * @param pageSize 新每页条数
   *
   * @description
   * 同步将页码重置为 1，再通知回调。
   */
  const setPageSize = (pageSize: number) => {
    paginationMethods.onUpdatePageSize(pageSize)
  }

  const getPagination = () => paginationRef.value as UsePaginationOptions

  /**
   *
   * @returns 当前回调；未设置或作用域已清理时返回 undefined。
   */
  const getCallback = () => callbackRef.value

  /**
   *
   * @param callback 新的分页更新回调；省略时移除回调
   */
  const setCallback = (callback?: () => void) => {
    callbackRef.value = callback
  }

  /**
   *
   * @description
   * 页码恢复为 1，每页条数取第一个选项的值；选项为空时使用 10。
   */
  const resetPagination = () => {
    const { pageSizes, pageChange, pageSizeChange } = mergedOptions.value

    paginationRef.value.page = DEFAULT_OPTIONS.page
    const firstSize = pageSizes?.[0]

    paginationRef.value.pageSize =
      typeof firstSize === 'number'
        ? firstSize
        : (firstSize?.value ?? DEFAULT_OPTIONS.pageSize)

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
