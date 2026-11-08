import { avatarDropdownClick } from '../../apps/admin/src/layout/components/SiderBar/shared'

const { logout, createDialog, showError, push } = vi.hoisted(() => ({
  logout: vi.fn(),
  createDialog: vi.fn(),
  showError: vi.fn(),
  push: vi.fn(),
}))

vi.mock('@/store', () => ({
  useSigningActions: () => ({ logout }),
  useSettingActions: () => ({ updateSettingState: vi.fn() }),
}))
vi.mock('@/hooks', () => ({ useI18n: () => ({ t: (key: string) => key }) }))
vi.mock('@/router', () => ({ router: { push } }))

beforeEach(() => {
  vi.clearAllMocks()
  window.$dialog = { create: createDialog } as unknown as typeof window.$dialog
  window.$message = { error: showError } as unknown as typeof window.$message
})

it('confirms sign-out with the active primary color before ending the session', async () => {
  logout.mockResolvedValue(void 0)
  await avatarDropdownClick('logout')

  expect(logout).not.toHaveBeenCalled()
  const dialog = createDialog.mock.calls[0]![0]

  expect(dialog).toMatchObject({
    title: 'signOut',
    showIcon: false,
    positiveButtonProps: { type: 'primary' },
  })
  expect(await dialog.onPositiveClick()).toBe(true)
  expect(logout).toHaveBeenCalledOnce()
})

it('keeps the confirmation open and reports a failed sign-out', async () => {
  logout.mockRejectedValue(new Error('offline'))
  await avatarDropdownClick('logout')

  expect(await createDialog.mock.calls[0]![0].onPositiveClick()).toBe(false)
  expect(showError).toHaveBeenCalledWith('signOutFailed')
})
