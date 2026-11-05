import * as v from 'valibot'

const text = (max: number) => v.pipe(v.string(), v.trim(), v.maxLength(max))

export const userInputSchema = v.object({
  username: v.pipe(text(32), v.minLength(2), v.regex(/^\S+$/u)),
  name: v.pipe(text(60), v.minLength(1)),
  email: v.pipe(text(120), v.email()),
  phone: v.pipe(text(24), v.regex(/^[+\d ()-]*$/u)),
  departmentId: v.pipe(text(80), v.minLength(1)),
  role: v.pipe(text(80), v.minLength(1)),
  status: v.picklist(['enabled', 'disabled']),
  remark: text(300),
})
export type UserInput = v.InferOutput<typeof userInputSchema>
export const userSchema = v.object({
  ...userInputSchema.entries,
  id: v.pipe(v.string(), v.minLength(1), v.maxLength(80)),
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
})
export type AdminUser = v.InferOutput<typeof userSchema>
export type UserStatus = AdminUser['status']

export const departmentSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  parentId: v.nullable(v.string()),
  name: v.string(),
  labelKey: v.optional(v.string()),
})
export type Department = v.InferOutput<typeof departmentSchema>
export const roleOptionSchema = v.object({
  value: v.string(),
  label: v.string(),
  labelKey: v.optional(v.string()),
  disabled: v.optional(v.boolean()),
})
export const userOptionsSchema = v.pipe(
  v.object({
    departments: v.array(departmentSchema),
    roles: v.array(roleOptionSchema),
  }),
  v.check(({ departments, roles }) => {
    const byId = new Map(departments.map((item) => [item.id, item]))

    if (
      byId.size !== departments.length ||
      new Set(roles.map((item) => item.value)).size !== roles.length
    )
      return false

    return departments.every((item) => {
      const seen = new Set<string>()
      let current: Department | undefined = item

      while (current) {
        if (seen.has(current.id)) return false

        seen.add(current.id)

        if (current.parentId === null) return true

        current = byId.get(current.parentId)
      }

      return false
    })
  }, 'Departments must form a tree with unique identifiers.'),
)
export type UserOptions = v.InferOutput<typeof userOptionsSchema>

export const profileSchema = v.object({
  id: v.string(),
  username: v.string(),
  name: v.string(),
  role: v.string(),
  avatar: v.optional(v.string()),
})
export const sessionSchema = v.object({
  user: profileSchema,
  permissions: v.array(v.string()),
})
export type SessionInfo = v.InferOutput<typeof sessionSchema>
export const loginInputSchema = v.object({
  username: v.pipe(text(80), v.minLength(1)),
  password: v.pipe(v.string(), v.minLength(1), v.maxLength(128)),
})
export const loginResultSchema = v.object({
  ...sessionSchema.entries,
  accessToken: v.pipe(v.string(), v.minLength(1)),
  expiresAt: v.pipe(v.string(), v.isoTimestamp()),
})
export type LoginResult = v.InferOutput<typeof loginResultSchema>

export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
  error?: { key: string; fields?: Record<string, string> }
}
export const envelopeSchema = v.object({
  code: v.number(),
  msg: v.string(),
  data: v.unknown(),
  error: v.optional(
    v.object({
      key: v.string(),
      fields: v.optional(v.record(v.string(), v.string())),
    }),
  ),
})
export const userListSchema = v.object({
  items: v.array(userSchema),
  total: v.pipe(v.number(), v.integer(), v.minValue(0)),
})
export const userListQuerySchema = v.object({
  page: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
  pageSize: v.optional(
    v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100)),
  ),
  name: v.optional(text(60)),
  username: v.optional(text(32)),
  email: v.optional(text(120)),
  departmentId: v.optional(text(80)),
  status: v.optional(v.picklist(['enabled', 'disabled'])),
  role: v.optional(text(80)),
})
export type UserListParams = v.InferOutput<typeof userListQuerySchema>
export const idsSchema = v.object({
  ids: v.pipe(
    v.array(v.pipe(v.string(), v.minLength(1))),
    v.minLength(1),
    v.maxLength(500),
  ),
})
export const statusInputSchema = v.object({
  ...idsSchema.entries,
  status: v.picklist(['enabled', 'disabled']),
})
export const changedSchema = v.object({
  affected: v.pipe(v.number(), v.integer(), v.minValue(0)),
})

export const permissionCodes = [
  'users:read',
  'users:create',
  'users:update',
  'users:delete',
  'users:status',
  'users:reset',
  'routes:read',
  'routes:write',
] as const
export type PermissionCode = (typeof permissionCodes)[number]
