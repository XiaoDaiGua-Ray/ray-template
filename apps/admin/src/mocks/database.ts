import {
  idsSchema,
  loginInputSchema,
  loginResultSchema,
  permissionCodes,
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
})

export function createAdminDatabase(storage?: Storage) {
  const key = 'rayMockAdmin.v1'
  let users = createInitialUsers()
  let routes = parseRouteConfig(JSON.stringify(initialRoutes))
  let sessions: v.InferOutput<typeof loginResultSchema>[] = []

  try {
    const raw = storage?.getItem(key)

    if (raw) {
      const value = v.parse(snapshotSchema, JSON.parse(raw))
      const parsedRoutes = parseRouteConfig(JSON.stringify(value.routes))

      if (new Set(value.users.map(({ id }) => id)).size !== value.users.length)
        throw new Error('Duplicate user id')

      users = value.users
      routes = parsedRoutes
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
  }) => {
    try {
      storage?.setItem(
        key,
        JSON.stringify({ version: 1, users, routes, sessions, ...next }),
      )
    } catch {
      throw new MockApiError(503, 'storage')
    }

    users = next.users ?? users
    routes = next.routes ?? routes
    sessions = next.sessions ?? sessions
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

    if (!user) throw new MockApiError(401, 'unauthorized')

    const result = profile(user)

    if (permission && !result.permissions.includes(permission))
      throw new MockApiError(403, 'forbidden')

    return result
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
    login(input: unknown) {
      const { username, password } = parseInput(loginInputSchema, input)
      const aliases: Record<string, string> = {
        'Ray Admin': 'user001',
        admin: 'user001',
        manager: 'user011',
        member: 'user002',
      }
      const user = users.find(
        (item) =>
          item.username === (aliases[username] ?? username) &&
          item.status === 'enabled',
      )

      if (!user || password !== '123456')
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
      commit({
        sessions: sessions.filter((item) => item.accessToken !== token),
      })

      return null
    },
    getRoutes() {
      return structuredClone(routes)
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

      const user = {
        ...value,
        id: existing?.id ?? crypto.randomUUID(),
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      }

      commit({
        users: existing
          ? users.map((item) => (item.id === id ? user : item))
          : [user, ...users],
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

      commit({ users: remaining })

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
      })

      return { affected: new Set(ids).size }
    },
    resetUsers(token: string | null) {
      authorize(token, 'users:reset')
      const next = createInitialUsers()

      commit({ users: next })

      return { affected: next.length }
    },
  }
}

export type AdminDatabase = ReturnType<typeof createAdminDatabase>
