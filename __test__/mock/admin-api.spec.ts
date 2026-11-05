import {
  createUser,
  deleteUsers,
  getAdminRoutes,
  getAdminSession,
  getUser,
  getUserOptions,
  getUsers,
  loginAdmin,
  logoutAdmin,
  resetDemoUsers,
  updateAdminRoutes,
  updateUser,
  updateUserStatus,
} from '@/api/admin'
import { AdminApiError } from '@/api/admin/client'
import type { UserInput } from '@/api/admin/contracts'
import { APP_CATCH_KEY } from '@/app-config'
import { createAdminDatabase } from '@/mocks/database'
import { getStorage, setStorage } from '@/utils/cache'

const input: UserInput = {
  username: 'integration-user',
  name: 'Integration User',
  email: 'integration@example.com',
  phone: '',
  departmentId: 'platform',
  role: 'member',
  status: 'enabled',
  remark: 'Test account',
}
const signIn = async (username = 'admin') => {
  const result = await loginAdmin(username, '123456')

  setStorage(APP_CATCH_KEY.token, result.accessToken, 'localStorage')

  return result
}

beforeEach(async () => {
  localStorage.clear()
  await signIn()
  await resetDemoUsers()
})
afterEach(() => localStorage.clear())

it('runs create, query, detail, update, status and delete through the HTTP contract', async () => {
  const options = await getUserOptions()

  expect(options.departments.some((item) => item.id === 'platform')).toBe(true)
  const created = await createUser(input)

  expect(await getUser(created.id)).toMatchObject(input)
  expect(
    await getUsers({
      name: 'Integration',
      departmentId: 'engineering',
      page: 1,
      pageSize: 1,
    }),
  ).toMatchObject({ total: 1, data: [{ id: created.id }] })
  const edited = await updateUser(created.id, {
    ...input,
    name: 'Updated User',
  })

  expect(edited.id).toBe(created.id)
  expect(edited.createdAt).toBe(created.createdAt)
  await updateUserStatus([created.id], 'disabled')
  expect((await getUser(created.id)).status).toBe('disabled')
  await deleteUsers([created.id])
  expect(await getUsers({ username: input.username })).toEqual({
    data: [],
    total: 0,
  })
})

it('rejects duplicate or malformed writes and preserves the existing record', async () => {
  const user = await createUser(input)

  await expect(
    createUser({
      ...input,
      username: input.username.toUpperCase(),
      email: 'other@example.com',
    }),
  ).rejects.toMatchObject({ code: 409, key: 'duplicateUsername' })
  await expect(
    updateUser(user.id, { ...input, departmentId: 'missing' }),
  ).rejects.toMatchObject({ code: 400, key: 'invalid' })
  expect(await getUser(user.id)).toMatchObject(input)
  await expect(getUsers({ page: 0 })).rejects.toMatchObject({ code: 400 })
})

it('enforces read-only permissions at the Mock API boundary', async () => {
  await signIn('member')
  expect((await getAdminSession()).permissions).toContain('users:read')
  expect((await getUsers({ page: 1, pageSize: 10 })).data).toHaveLength(10)
  await expect(createUser(input)).rejects.toMatchObject({
    code: 403,
    key: 'forbidden',
  })
  await expect(deleteUsers(['demo-user-3'])).rejects.toMatchObject({
    code: 403,
  })
  await expect(updateAdminRoutes(await getAdminRoutes())).rejects.toMatchObject(
    { code: 403 },
  )
})

it('prevents manager privilege escalation and protects the current account', async () => {
  const session = await signIn('manager')

  await expect(createUser({ ...input, role: 'admin' })).rejects.toMatchObject({
    code: 403,
  })
  await expect(
    updateUserStatus([session.user.id], 'disabled'),
  ).rejects.toMatchObject({ code: 409, key: 'selfProtected' })
  const admin = await signIn()

  await expect(
    deleteUsers(['demo-user-3', admin.user.id]),
  ).rejects.toMatchObject({ code: 409, key: 'selfProtected' })
  expect((await getUser('demo-user-3')).id).toBe('demo-user-3')
})

it('saves route configuration through PUT and rejects unknown executable components', async () => {
  const original = await getAdminRoutes()
  const next = {
    ...original,
    routes: [
      ...original.routes,
      {
        path: '/api-contract-page',
        component: 'dashboard',
        meta: { noLocalTitle: 'API contract page' },
      },
    ],
  }

  try {
    await updateAdminRoutes(next)
    expect((await getAdminRoutes()).routes.at(-1)?.path).toBe(
      '/api-contract-page',
    )
    await expect(
      updateAdminRoutes({
        version: 1,
        routes: [
          {
            path: '/unsafe',
            component: 'https://example.com/code.js',
            meta: {},
          },
        ],
      }),
    ).rejects.toMatchObject({ code: 400, key: 'invalidRoutes' })
    expect((await getAdminRoutes()).routes.at(-1)?.path).toBe(
      '/api-contract-page',
    )
  } finally {
    await updateAdminRoutes(original)
  }
})

it('invalidates the server-side Mock session on logout', async () => {
  expect(getStorage(APP_CATCH_KEY.token, 'localStorage')).toEqual(
    expect.any(String),
  )
  await logoutAdmin()
  await expect(getAdminSession()).rejects.toBeInstanceOf(AdminApiError)
  await expect(getUsers({})).rejects.toMatchObject({ code: 401 })
})

it('restores Mock writes and active sessions after recreating the database', () => {
  localStorage.clear()
  const first = createAdminDatabase(localStorage)
  const session = first.login({ username: 'admin', password: '123456' })
  const user = first.saveUser(input, session.accessToken)
  const second = createAdminDatabase(localStorage)

  expect(second.getUser(user.id, session.accessToken)).toMatchObject(input)
  expect(second.authorize(session.accessToken).user.id).toBe(session.user.id)
})

it('keeps writes atomic when persistence fails', () => {
  const storage: Storage = {
    length: 0,
    key: () => null,
    clear() {},
    removeItem() {},
    getItem: () => null,
    setItem: vi.fn(),
  }
  const database = createAdminDatabase(storage)
  const session = database.login({ username: 'admin', password: '123456' })

  vi.mocked(storage.setItem).mockImplementation(() => {
    throw new Error('Quota exceeded')
  })
  expect(() => database.saveUser(input, session.accessToken)).toThrow('storage')
  expect(database.listUsers({}, session.accessToken).total).toBe(24)
})
