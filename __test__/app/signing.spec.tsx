import Signing from '@/views/login/components/Signing'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'

const signing = vi.fn()

vi.mock('@/api/admin/client', () => ({ apiMockEnabled: false }))
vi.mock('@/hooks', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))
vi.mock('@/store', () => ({
  useSigningActions: () => ({ signing }),
}))

it('submits the real login form with native credential fields and no demo shortcuts', async () => {
  signing.mockResolvedValue({
    code: 0,
    data: { id: 'test-account', username: 'qa-account' },
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: ['/', '/welcome'].map((path) => ({
      path,
      component: { render: () => null },
    })),
  })

  await router.push('/')
  const wrapper = mount(Signing, { global: { plugins: [router] } })

  try {
    const username = wrapper.get('input[name="username"]')
    const password = wrapper.get('input[name="password"]')

    expect(username.attributes('autocomplete')).toBe('username')
    expect(password.attributes('autocomplete')).toBe('current-password')
    expect(password.attributes('type')).toBe('password')
    expect(wrapper.text()).not.toMatch(/UseDemo|UseMember|UseManager/u)
    await username.setValue('qa-account')
    await password.setValue('qa-fixture-password')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(signing).toHaveBeenCalledExactlyOnceWith({
      name: 'qa-account',
      pwd: 'qa-fixture-password',
    })
    expect(router.currentRoute.value.path).toBe('/welcome')
  } finally {
    wrapper.unmount()
  }
})
