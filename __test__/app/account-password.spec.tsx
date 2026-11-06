import { AdminApiError } from '@/api/admin/client'
import AccountPasswordForm from '@/app-components/app/AccountPasswordForm'
import { flushPromises, mount } from '@vue/test-utils'
import setupMiniApp from '../utils/setupMiniApp'

it('checks password confirmation, renders the API error and permits a retry', async () => {
  const { app } = await setupMiniApp()
  const save = vi
    .fn<(next: string, current: string) => Promise<void>>()
    .mockRejectedValueOnce(
      new AdminApiError(
        400,
        'invalidCurrentPassword',
        'invalidCurrentPassword',
      ),
    )
    .mockResolvedValueOnce(void 0)
  const wrapper = mount(AccountPasswordForm, {
    props: { username: 'fixture-user', requireCurrent: true, save },
  })

  try {
    const current = wrapper.get('input[name="currentPassword"]')
    const next = wrapper.get('input[name="newPassword"]')
    const confirmation = wrapper.get('input[name="confirmPassword"]')

    await current.setValue('fixture-old-password')
    await next.setValue('fixture-new-password')
    await confirmation.setValue('fixture-mismatch')
    await wrapper.get('form').trigger('submit')
    expect(save).not.toHaveBeenCalled()
    expect(wrapper.get('[role="alert"]').text()).toContain('不一致')

    await confirmation.setValue('fixture-new-password')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(save).toHaveBeenCalledWith(
      'fixture-new-password',
      'fixture-old-password',
    )
    expect(wrapper.get('[role="alert"]').text()).toContain('当前密码不正确')

    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(save).toHaveBeenCalledTimes(2)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect((next.element as HTMLInputElement).value).toBe('')
  } finally {
    wrapper.unmount()
    app.unmount()
  }
})
