import { splitPaginationOptions } from '../../packages/ui/src/RTablePro/src/pagination'
import type { TableProPagination } from '../../packages/ui/src/RTablePro/src/types'

it('uses only current update handlers and removes them from native view props', () => {
  const page = vi.fn()
  const modelPage = vi.fn()
  const size = vi.fn()
  const modelSize = vi.fn()
  const options: TableProPagination = {
    page: 2,
    pageSize: 20,
    showSizePicker: true,
    onUpdatePage: [page],
    'onUpdate:page': modelPage,
    onUpdatePageSize: size,
    'onUpdate:pageSize': [modelSize],
  }
  const pager = splitPaginationOptions(options)

  pager.notifyPage(3)
  pager.notifyPageSize(50)
  expect(page).toHaveBeenCalledExactlyOnceWith(3)
  expect(modelPage).toHaveBeenCalledExactlyOnceWith(3)
  expect(size).toHaveBeenCalledExactlyOnceWith(50)
  expect(modelSize).toHaveBeenCalledExactlyOnceWith(50)
  expect(pager.view).toEqual({ page: 2, pageSize: 20, showSizePicker: true })
})

it('drops obsolete callback keys from untyped runtime configuration', () => {
  const onChange = vi.fn()
  const onPageSizeChange = vi.fn()
  const legacy = { page: 1, onChange, onPageSizeChange }
  const pager = splitPaginationOptions(legacy)

  pager.notifyPage(2)
  pager.notifyPageSize(20)
  expect(pager.view).toEqual({ page: 1 })
  expect(onChange).not.toHaveBeenCalled()
  expect(onPageSizeChange).not.toHaveBeenCalled()
  expectTypeOf<TableProPagination>().not.toHaveProperty('onChange')
  expectTypeOf<TableProPagination>().not.toHaveProperty('onPageSizeChange')
})
