import { usePagination } from '../../apps/admin/src/hooks/web/usePagination'

describe('usePagination', () => {
  let count = 0
  const defaultOptions = {
    itemCount: 200,
    page: 1,
    pageSize: 10,
  }

  const [
    _,
    {
      getItemCount,
      getCallback,
      getPage,
      getPageSize,
      getPagination,
      setItemCount,
      setPage,
      setPageSize,
    },
  ] = usePagination(() => {
    count++
  }, defaultOptions)

  it('should get current itemCount', () => {
    setItemCount(200)

    expect(getItemCount()).toBe(200)

    setItemCount(100)

    expect(getItemCount()).toBe(100)
  })

  it('should get current page', () => {
    setPage(1)

    expect(getPage()).toBe(1)
  })

  it('should get current pageSize', () => {
    setPageSize(10)

    expect(getPageSize()).toBe(10)
  })

  it('should get current pagination', () => {
    setItemCount(200)

    expect(getPagination()).toMatchObject(defaultOptions)
  })

  it('should update count when page or pageSize changes', () => {
    count = 0

    setPage(2)

    expect(count).toBe(1)

    setPageSize(20)

    expect(count).toBe(2)
  })
})

it('resets to the first object page size and reports new values to the current callbacks', () => {
  const pageChange = vi.fn()
  const pageSizeChange = vi.fn()
  const oldCallback = vi.fn()
  const callback = vi.fn()
  const [pagination, api] = usePagination(oldCallback, {
    page: 5,
    pageSize: 10,
    pageSizes: [{ label: 'Fifteen', value: 15 }],
    pageChange,
    pageSizeChange,
  })

  expect(api.getCallback()).toBe(oldCallback)
  api.setCallback(callback)
  api.resetPagination()

  expect(api.getPagination()).toBe(pagination.value)
  expect(api.getPage()).toBe(1)
  expect(api.getPageSize()).toBe(15)
  expect(pageChange).toHaveBeenCalledExactlyOnceWith(1)
  expect(pageSizeChange).toHaveBeenCalledExactlyOnceWith(15)
  expect(callback).toHaveBeenCalledOnce()
  expect(oldCallback).not.toHaveBeenCalled()
  api.setCallback()
  api.setPage(2)
  expect(api.getCallback()).toBeUndefined()
  expect(callback).toHaveBeenCalledOnce()
})
