import { usePagination } from '../../src/hooks/web/usePagination'

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

  it('should get callback', () => {
    count = 0

    getCallback()

    expect(count).toBe(1)
  })
})
