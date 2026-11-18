import { locks } from 'node:worker_threads'
import {
  changeAccountPassword,
  createUser,
  deleteUsers,
  getAccountProfile,
  getAdminRoutes,
  getAdminSession,
  getUser,
  getUserOptions,
  getUsers,
  loginAdmin,
  logoutAdmin,
  resetDemoUsers,
  setUserCredential,
  updateAccountProfile,
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

  if (!('accessToken' in result))
    throw new Error('Mock login must return a token.')

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

it('preserves simultaneous edits and sessions across independent browser clients', async () => {
  localStorage.clear()
  const first = createAdminDatabase(localStorage, locks)
  const second = createAdminDatabase(localStorage, locks)
  const { accessToken } = await first((db) =>
    db.login({ username: 'admin', password: '123456' }),
  )
  const [one, two] = await Promise.all([
    first((db) => db.saveUser(input, accessToken)),
    second((db) =>
      db.saveUser(
        { ...input, username: 'second', email: 'second@example.com' },
        accessToken,
      ),
    ),
  ])

  await Promise.all([
    first((db) =>
      db.saveUser({ ...one, name: 'First changed' }, accessToken, one.id),
    ),
    second((db) =>
      db.saveUser({ ...two, name: 'Second changed' }, accessToken, two.id),
    ),
  ])
  const reopened = createAdminDatabase(localStorage, locks)

  await expect(
    reopened((db) => [
      db.getUser(one.id, accessToken).name,
      db.getUser(two.id, accessToken).name,
    ]),
  ).resolves.toEqual(['First changed', 'Second changed'])
})

it('keeps writes atomic when persistence fails', async () => {
  const db = createAdminDatabase(localStorage, locks)
  const { accessToken } = await db((snapshot) =>
    snapshot.login({ username: 'admin', password: '123456' }),
  )
  const persist = vi
    .spyOn(localStorage, 'setItem')
    .mockImplementationOnce(() => {
      throw new Error('Quota exceeded')
    })

  try {
    await expect(
      db((snapshot) => snapshot.saveUser(input, accessToken)),
    ).rejects.toThrow('storage')
    expect(
      await db((snapshot) => snapshot.listUsers({}, accessToken).total),
    ).toBe(24)
  } finally {
    persist.mockRestore()
  }
})

it('signs in an explicitly provisioned account whose username matches a demo alias', async () => {
  const candidate = await createUser({ ...input, username: 'member' })

  await setUserCredential(candidate.id, 'new-demo-credential')
  const session = await loginAdmin('member', 'new-demo-credential')

  expect(session.user.id).toBe(candidate.id)
  expect((await loginAdmin('user002', '123456')).user.role).toBe('member')
})

it('rejects stale account and route replacements without losing the committed changes', async () => {
  const user = await createUser(input)
  let userRevision: string | undefined
  const original = await getUser(user.id, void 0, (value) => {
    userRevision = value
  })

  expect(userRevision).toBeTruthy()
  await updateUserStatus([user.id], 'disabled')
  await expect(
    updateUser(user.id, { ...original, name: 'New name' }, userRevision),
  ).rejects.toMatchObject({ code: 412, key: 'editConflict' })
  expect((await getUser(user.id)).status).toBe('disabled')

  let routeRevision: string | undefined
  const config = await getAdminRoutes('editor', void 0, (value) => {
    routeRevision = value
  })

  expect(routeRevision).toBeTruthy()
  const next = {
    ...config,
    routes: [
      ...config.routes,
      { path: '/revision', component: 'dashboard', meta: {} },
    ],
  }

  try {
    await updateAdminRoutes(next, routeRevision)
    await expect(
      updateAdminRoutes(config, routeRevision),
    ).rejects.toMatchObject({ code: 412, key: 'editConflict' })
    expect((await getAdminRoutes('editor')).routes.at(-1)?.path).toBe(
      '/revision',
    )
  } finally {
    await updateAdminRoutes(config)
  }
})

it('provisions a Mock login and updates only the signed-in profile', async () => {
  const user = await createUser(input)
  const original = 'mock-initial-password'
  const changed = 'mock-changed-password'

  await expect(loginAdmin(user.username, '123456')).rejects.toMatchObject({
    code: 401,
  })
  await setUserCredential(user.id, original)
  const session = await loginAdmin(user.username, original)

  if (!('accessToken' in session))
    throw new Error('Mock login must return a token.')

  setStorage(APP_CATCH_KEY.token, session.accessToken, 'localStorage')
  await expect(getAccountProfile()).resolves.toMatchObject({
    id: user.id,
    username: user.username,
  })
  await expect(
    updateAccountProfile({ name: 'Updated profile', phone: '' }),
  ).resolves.toMatchObject({ name: 'Updated profile' })
  await expect(setUserCredential(user.id, changed)).rejects.toMatchObject({
    code: 403,
  })
  await changeAccountPassword({
    currentPassword: original,
    newPassword: changed,
  })
  await expect(getAccountProfile()).rejects.toMatchObject({ code: 401 })
  await expect(loginAdmin(user.username, original)).rejects.toMatchObject({
    code: 401,
  })
  await expect(loginAdmin(user.username, changed)).resolves.toMatchObject({
    user: { name: 'Updated profile' },
  })
})
