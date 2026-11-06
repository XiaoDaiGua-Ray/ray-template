import { ref } from 'vue'
import { useAccess } from '../../apps/admin/src/hooks/template/useAccess'

const { state } = vi.hoisted(() => ({
  state: { permissions: void 0 as unknown },
}))

vi.mock('../../apps/admin/src/store', () => ({
  useSigningGetters: () => ({ getPermissions: state.permissions }),
}))

it('preserves all/any semantics and invalidates permission lookups after session changes', () => {
  const permissions = ref(['users:read', 'users:write'])

  state.permissions = permissions
  const access = useAccess()

  expect(access.permissions).toBe(permissions)
  expect(access.hasPermission('users:read')).toBe(true)
  expect(access.hasPermission(['users:read', 'users:write'])).toBe(true)
  expect(access.hasPermission(['users:read', 'admin:write'])).toBe(false)
  expect(access.hasPermission(['users:read', 'admin:write'], 'any')).toBe(true)
  expect(access.hasPermission([])).toBe(true)
  expect(access.hasPermission([], 'any')).toBe(false)

  permissions.value.splice(1, 1)
  expect(access.hasPermission('users:write')).toBe(false)
  permissions.value = ['admin:write']
  expect(access.hasPermission('users:read')).toBe(false)
  expect(access.hasPermission('admin:write')).toBe(true)
})
