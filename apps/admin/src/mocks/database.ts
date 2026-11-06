import {
  changePasswordSchema,
  credentialInputSchema,
  idsSchema,
  loginInputSchema,
  loginResultSchema,
  permissionCodes,
  profileInputSchema,
  statusInputSchema,
  userInputSchema,
  userListQuerySchema,
  userSchema,
} from '@/api/admin/contracts'
import type {
  AdminUser,
  SessionInfo,
  UserInput,
  UserListParams,
} from '@/api/admin/contracts'
import { parseRouteConfig } from '@/router/config/contract'
import type { RouteConfig } from '@/router/config/schema'
import { filterRuntimeRoutes } from '@ray-template/api-contracts/routes'
import { initialRoutes } from '@ray-template/demo-data'
import * as v from 'valibot'
import { createInitialUsers, initialUserOptions } from './data/users'

export class MockApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly key: string,
  ) {
    super(key)
  }
}

const permissionsFor = (role: string): string[] =>
  role === 'admin'
    ? [...permissionCodes]
    : role === 'manager'
      ? [
          'users:read',
          'users:create',
          'users:update',
          'users:status',
          'routes:read',
        ]
      : ['users:read', 'routes:read']
const snapshotSchema = v.object({
  version: v.literal(1),
  users: v.array(userSchema),
  routes: v.unknown(),
  sessions: v.array(loginResultSchema),
  credentials: v.optional(
    v.array(
      v.object({
        userId: v.string(),
        salt: v.string(),
        digest: v.string(),
      }),
    ),
    [],
  ),
})

async function demoDigest(password: string, salt: string) {
  const bytes = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}

export function createAdminDatabase(storage?: Storage) {
  const key = 'rayMockAdmin.v1'
  let users = createInitialUsers()
  let routes = parseRouteConfig(JSON.stringify(initialRoutes))
  let sessions: v.InferOutput<typeof loginResultSchema>[] = []
  let credentials: v.InferOutput<typeof snapshotSchema>['credentials'] = []

  try {
    const raw = storage?.getItem(key)

    if (raw) {
      const value = v.parse(snapshotSchema, JSON.parse(raw))
      const parsedRoutes = parseRouteConfig(JSON.stringify(value.routes))

      if (new Set(value.users.map(({ id }) => id)).size !== value.users.length)
        throw new Error('Duplicate user id')

      users = value.users
      routes = parsedRoutes
      credentials = value.credentials
      sessions = value.sessions.filter(
        (session) => Date.parse(session.expiresAt) > Date.now(),
      )
    }
  } catch {
    // 损坏的演示数据库使用初始数据；不会把缓存内容当作可执行路由。
  }

  const commit = (next: {
    users?: AdminUser[]
    routes?: RouteConfig
    sessions?: typeof sessions
    credentials?: typeof credentials
  }) => {
    try {
      storage?.setItem(
        key,
        JSON.stringify({
          version: 1,
          users,
          routes,
          sessions,
          credentials,
          ...next,
        }),
      )
    } catch {
      throw new MockApiError(503, 'storage')
    }

    users = next.users ?? users
    routes = next.routes ?? routes
    sessions = next.sessions ?? sessions
    credentials = next.credentials ?? credentials
  }
  const profile = (user: AdminUser): SessionInfo => ({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    },
    permissions: permissionsFor(user.role),
  })
  const authorize = (
    token: string | null,
    permission?: string,
  ): SessionInfo => {
    const session = sessions.find(
      (item) =>
        item.accessToken === token && Date.parse(item.expiresAt) > Date.now(),
    )
    const user =
      session &&
      users.find(
        (item) => item.id === session.user.id && item.status === 'enabled',
      )

    if (!user || !session) throw new MockApiError(401, 'unauthorized')

    const result = profile(user)

    if (permission && !result.permissions.includes(permission))
      throw new MockApiError(403, 'forbidden')

    return { ...result, expiresAt: session.expiresAt }
  }
  const parseInput = <S extends v.GenericSchema>(
    schema: S,
    input: unknown,
  ): v.InferOutput<S> => {
    const parsed = v.safeParse(schema, input)

    if (!parsed.success) throw new MockApiError(400, 'invalid')

    return parsed.output
  }
  const findUser = (id: string) => {
    const user = users.find((item) => item.id === id)

    if (!user) throw new MockApiError(404, 'notFound')

    return user
  }
  const accountProfile = (user: AdminUser) => ({
    ...profile(user).user,
    email: user.email,
    phone: user.phone,
    department: initialUserOptions.departments.find(
      ({ id }) => id === user.departmentId,
    )!,
  })
  const matchesPassword = async (user: AdminUser, password: string) => {
    const credential = credentials.find(({ userId }) => userId === user.id)

    return credential
      ? (await demoDigest(password, credential.salt)) === credential.digest
      : user.id.startsWith('demo-user-') && password === '123456'
  }
  const replacePassword = async (
    userId: string,
    password: string,
    recheck: () => void,
  ) => {
    const salt = crypto.randomUUID()
    const digest = await demoDigest(password, salt)

    recheck()
    commit({
      credentials: [
        ...credentials.filter((entry) => entry.userId !== userId),
        { userId, salt, digest },
      ],
      sessions: sessions.filter((entry) => entry.user.id !== userId),
    })
  }
  const validateUser = (input: unknown, id?: string): UserInput => {
    const value = parseInput(userInputSchema, input)

    if (
      !initialUserOptions.departments.some(
        (item) => item.id === value.departmentId,
      ) ||
      !initialUserOptions.roles.some((item) => item.value === value.role)
    )
      throw new MockApiError(400, 'invalid')

    if (
      users.some(
        (item) =>
          item.id !== id &&
          item.username.toLowerCase() === value.username.toLowerCase(),
      )
    )
      throw new MockApiError(409, 'duplicateUsername')

    if (
      users.some(
        (item) =>
          item.id !== id &&
          item.email.toLowerCase() === value.email.toLowerCase(),
      )
    )
      throw new MockApiError(409, 'duplicateEmail')

    return value
  }
  const assertEditable = (
    session: SessionInfo,
    user: Pick<AdminUser, 'role'>,
  ) => {
    if (session.user.role !== 'admin' && user.role === 'admin')
      throw new MockApiError(403, 'forbidden')
  }
  const includesDepartment = (parent: string, id: string): boolean => {
    if (parent === id) return true

    const department = initialUserOptions.departments.find(
      (item) => item.id === id,
    )

    return department?.parentId
      ? includesDepartment(parent, department.parentId)
      : false
  }

  return {
    authorize,
    async login(input: unknown) {
      const { username, password } = parseInput(loginInputSchema, input)
      const aliases = new Map(
        Object.entries({
          'ray admin': 'user001',
          admin: 'user001',
          manager: 'user011',
          member: 'user002',
        }),
      )
      const key = username.toLowerCase()
      const user = users.find(
        (item) =>
          item.username.toLowerCase() === (aliases.get(key) ?? key) &&
          item.status === 'enabled',
      )

      const snapshot = credentials

      if (
        !user ||
        !(await matchesPassword(user, password)) ||
        snapshot !== credentials ||
        !users.includes(user)
      )
        throw new MockApiError(401, 'invalidCredentials')

      const session = {
        ...profile(user),
        accessToken: `mock-${crypto.randomUUID()}`,
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      }

      commit({
        sessions: [
          ...sessions.filter((item) => Date.parse(item.expiresAt) > Date.now()),
          session,
        ],
      })

      return session
    },
    logout(token: string | null) {
      authorize(token)
      commit({
        sessions: sessions.filter((item) => item.accessToken !== token),
      })

      return null
    },
    getRoutes(token: string | null, editor = false) {
      const session = authorize(token, editor ? 'routes:write' : void 0)

      return structuredClone(
        editor
          ? routes
          : filterRuntimeRoutes(routes, {
              role: session.user.role,
              permissions: session.permissions,
              demoEnabled: true,
            }),
      )
    },
    getProfile(token: string | null) {
      return accountProfile(findUser(authorize(token).user.id))
    },
    updateProfile(input: unknown, token: string | null) {
      const user = findUser(authorize(token).user.id)
      const updated = { ...user, ...parseInput(profileInputSchema, input) }

      commit({
        users: users.map((item) => (item.id === user.id ? updated : item)),
      })

      return accountProfile(updated)
    },
    async changePassword(input: unknown, token: string | null) {
      const user = findUser(authorize(token).user.id)
      const { currentPassword, newPassword } = parseInput(
        changePasswordSchema,
        input,
      )

      if (!(await matchesPassword(user, currentPassword)))
        throw new MockApiError(400, 'invalidCurrentPassword')

      if (currentPassword === newPassword)
        throw new MockApiError(400, 'passwordUnchanged')

      await replacePassword(user.id, newPassword, () => authorize(token))

      return null
    },
    async setCredential(id: string, input: unknown, token: string | null) {
      const { newPassword } = parseInput(credentialInputSchema, input)
      const recheck = () => {
        const session = authorize(token, 'users:credentials')

        if (session.user.id === id) throw new MockApiError(409, 'selfProtected')

        assertEditable(session, findUser(id))
      }

      recheck()
      await replacePassword(id, newPassword, recheck)

      return null
    },
    saveRoutes(input: unknown, token: string | null) {
      authorize(token, 'routes:write')
      let config: RouteConfig

      try {
        config = parseRouteConfig(JSON.stringify(input))
      } catch {
        throw new MockApiError(400, 'invalidRoutes')
      }

      commit({ routes: config })

      return structuredClone(config)
    },
    getOptions(token: string | null) {
      const session = authorize(token, 'users:read')

      return {
        ...initialUserOptions,
        roles: initialUserOptions.roles.map((role) => ({
          ...role,
          disabled: session.user.role !== 'admin' && role.value === 'admin',
        })),
      }
    },
    listUsers(params: UserListParams, token: string | null) {
      authorize(token, 'users:read')
      params = parseInput(userListQuerySchema, params)
      const { page = 1, pageSize = 10 } = params

      if (
        !Number.isSafeInteger(page) ||
        page < 1 ||
        !Number.isSafeInteger(pageSize) ||
        pageSize < 1 ||
        pageSize > 100
      )
        throw new MockApiError(400, 'invalid')

      const matches = users.filter(
        (user) =>
          (['name', 'username', 'email'] as const).every(
            (key) =>
              !params[key] ||
              user[key]
                .toLowerCase()
                .includes(params[key]!.trim().toLowerCase()),
          ) &&
          (!params.departmentId ||
            includesDepartment(params.departmentId, user.departmentId)) &&
          (!params.status || user.status === params.status) &&
          (!params.role || user.role === params.role),
      )

      return {
        items: structuredClone(
          matches.slice((page - 1) * pageSize, page * pageSize),
        ),
        total: matches.length,
      }
    },
    getUser(id: string, token: string | null) {
      authorize(token, 'users:read')

      return structuredClone(findUser(id))
    },
    saveUser(input: unknown, token: string | null, id?: string) {
      const session = authorize(token, id ? 'users:update' : 'users:create')
      const existing = id ? findUser(id) : void 0

      if (existing) assertEditable(session, existing)

      const value = validateUser(input, id)

      assertEditable(session, value)

      if (
        id === session.user.id &&
        (value.status !== 'enabled' || value.role !== session.user.role)
      )
        throw new MockApiError(409, 'selfProtected')

      if (
        existing &&
        existing.status !== value.status &&
        !session.permissions.includes('users:status')
      )
        throw new MockApiError(403, 'forbidden')

      const user = {
        ...value,
        id: existing?.id ?? crypto.randomUUID(),
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      }

      commit({
        users: existing
          ? users.map((item) => (item.id === id ? user : item))
          : [user, ...users],
        ...(existing &&
        (existing.role !== user.role || user.status === 'disabled')
          ? { sessions: sessions.filter((entry) => entry.user.id !== user.id) }
          : {}),
      })

      return structuredClone(user)
    },
    deleteUsers(input: unknown, token: string | null) {
      const session = authorize(token, 'users:delete')
      const { ids } = parseInput(idsSchema, input)

      for (const id of ids) {
        const user = findUser(id)

        assertEditable(session, user)

        if (id === session.user.id) throw new MockApiError(409, 'selfProtected')
      }

      const remaining = users.filter((item) => !ids.includes(item.id))
      const affected = users.length - remaining.length

      commit({
        users: remaining,
        sessions: sessions.filter((entry) => !ids.includes(entry.user.id)),
        credentials: credentials.filter((entry) => !ids.includes(entry.userId)),
      })

      return { affected }
    },
    changeStatus(input: unknown, token: string | null) {
      const session = authorize(token, 'users:status')
      const { ids, status } = parseInput(statusInputSchema, input)

      for (const id of ids) {
        assertEditable(session, findUser(id))

        if (id === session.user.id && status === 'disabled')
          throw new MockApiError(409, 'selfProtected')
      }

      commit({
        users: users.map((user) =>
          ids.includes(user.id) ? { ...user, status } : user,
        ),
        ...(status === 'disabled'
          ? {
              sessions: sessions.filter(
                (entry) => !ids.includes(entry.user.id),
              ),
            }
          : {}),
      })

      return { affected: new Set(ids).size }
    },
    resetUsers(token: string | null) {
      authorize(token, 'users:reset')
      const next = createInitialUsers()

      commit({
        users: next,
        credentials: credentials.filter(
          (entry) => entry.userId === authorize(token).user.id,
        ),
        sessions: sessions.filter((entry) => entry.accessToken === token),
      })

      return { affected: next.length }
    },
  }
}

export type AdminDatabase = ReturnType<typeof createAdminDatabase>
