import * as adminApi from '@/api/admin'
import { router } from '@/router'
import { piniaSigningStore } from '@/store/modules/signing'
import UserManagement from '@/views/user-management'
import { flushPromises, mount } from '@vue/test-utils'
import setupMiniApp from '../utils/setupMiniApp'

it('keeps the current list and selection context when opening and closing an editor', async () => {
  localStorage.clear()
  const { app } = await setupMiniApp()

  await piniaSigningStore().signing({ name: 'admin', pwd: '123456' })
  const fetchUsers = vi.spyOn(adminApi, 'getUsers')
  const message = window.$message

  window.$message = {
    error: vi.fn(),
    success: vi.fn(),
  } as unknown as Window['$message']
  const wrapper = mount(UserManagement, {
    attachTo: document.body,
    global: {
      plugins: [router],
      stubs: {
        Modal: { inheritAttrs: false, template: '<div><slot /></div>' },
        RIcon: { inheritAttrs: false, template: '<span />' },
      },
    },
  })

  try {
    await vi.waitFor(() => expect(wrapper.text()).toContain('Alex Chen'), {
      timeout: 3000,
    })
    expect(fetchUsers).toHaveBeenCalledTimes(1)
    await wrapper
      .findAll('button')
      .find((button) => button.text().trim() === '新增用户')!
      .trigger('click')
    await flushPromises()
    expect(wrapper.find('input[name="username"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Alex Chen')
    expect(fetchUsers).toHaveBeenCalledTimes(1)
    await wrapper
      .findAll('button')
      .find((button) => button.text().trim() === '取消')!
      .trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Alex Chen')
    expect(fetchUsers).toHaveBeenCalledTimes(1)
  } finally {
    wrapper.unmount()
    app.unmount()
    window.$message = message
    localStorage.clear()
    vi.restoreAllMocks()
  }
})
