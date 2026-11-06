import { Inject, Injectable } from '@nestjs/common'
import {
  credentialInputSchema,
  idsSchema,
  statusInputSchema,
  userInputSchema,
  userListQuerySchema,
} from '@ray-template/api-contracts/admin'
import type { AdminUser, UserInput } from '@ray-template/api-contracts/admin'
import type { Prisma, User } from '../../generated/prisma/client'
import { ApiError, parseInput } from '../../http'
import { DatabaseService } from '../../infrastructure/database'
import type { Database } from '../../infrastructure/database'
import { AuthService } from '../auth/auth.service'
import type { AuthContext } from '../auth/auth.service'
import { replaceCredential } from '../auth/credentials'
import { hashPassword } from '../auth/password'

export function userView(user: User): AdminUser {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    phone: user.phone,
    departmentId: user.departmentId,
    role: user.role,
    status: user.status as AdminUser['status'],
    remark: user.remark,
    createdAt: user.createdAt.toISOString(),
  }
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(DatabaseService) private readonly database: DatabaseService,
    @Inject(AuthService) private readonly auth: AuthService,
  ) {}

  async options(session: AuthContext) {
    const [departments, roles] = await Promise.all([
      this.database.prisma.department.findMany({ orderBy: { id: 'asc' } }),
      this.database.prisma.role.findMany({
        include: { permissions: true },
        orderBy: { value: 'asc' },
      }),
    ])

    return {
      departments: departments.map(({ labelKey, ...department }) => ({
        ...department,
        ...(labelKey ? { labelKey } : {}),
      })),
      roles: roles.map(({ value, label, labelKey, permissions }) => ({
        value,
        label,
        ...(labelKey ? { labelKey } : {}),
        disabled:
          session.user.role !== 'admin' &&
          (value === 'admin' ||
            permissions.some(
              ({ permissionCode }) =>
                !session.permissions.includes(permissionCode),
            )),
      })),
    }
  }

  async list(input: unknown) {
    const params = parseInput(userListQuerySchema, input)
    const { page = 1, pageSize = 10 } = params

    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger((page - 1) * pageSize)
    )
      throw new ApiError(400, 'invalid')

    const where: Prisma.UserWhereInput = {}

    for (const field of ['name', 'username', 'email'] as const) {
      if (params[field])
        where[field] = { contains: params[field], mode: 'insensitive' }
    }

    if (params.role) where.role = params.role

    if (params.status) where.status = params.status

    if (params.departmentId) {
      const departments = await this.database.prisma.department.findMany()
      const included = new Set([params.departmentId])
      let changed = true

      while (changed) {
        changed = false

        for (const department of departments) {
          if (
            department.parentId &&
            included.has(department.parentId) &&
            !included.has(department.id)
          ) {
            included.add(department.id)
            changed = true
          }
        }
      }

      where.departmentId = { in: [...included] }
    }

    const [users, total] = await this.database.prisma.$transaction(
      [
        this.database.prisma.user.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        }),
        this.database.prisma.user.count({ where }),
      ],
      { isolationLevel: 'RepeatableRead' },
    )

    return { items: users.map(userView), total }
  }

  async get(id: string) {
    return userView(await this.findUser(this.database.prisma, id))
  }

  private async findUser(database: Database, id: string) {
    const user = await database.user.findUnique({ where: { id } })

    if (!user) throw new ApiError(404, 'notFound')

    return user
  }

  private async assertManageRole(
    database: Database,
    session: AuthContext,
    role: string,
  ) {
    const target = await database.role.findUnique({
      where: { value: role },
      include: { permissions: true },
    })

    if (!target) throw new ApiError(400, 'invalid')

    if (
      session.user.role !== 'admin' &&
      (role === 'admin' ||
        target.permissions.some(
          ({ permissionCode }) => !session.permissions.includes(permissionCode),
        ))
    )
      throw new ApiError(403, 'forbidden')
  }

  private async validateUnique(
    database: Database,
    value: UserInput,
    id?: string,
  ) {
    const duplicate = await database.user.findFirst({
      where: {
        usernameKey: value.username.toLowerCase(),
        ...(id ? { id: { not: id } } : {}),
      },
    })

    if (duplicate) throw new ApiError(409, 'duplicateUsername')

    const duplicateEmail = await database.user.findFirst({
      where: {
        emailKey: value.email.toLowerCase(),
        ...(id ? { id: { not: id } } : {}),
      },
    })

    if (duplicateEmail) throw new ApiError(409, 'duplicateEmail')
  }

  async save(
    input: unknown,
    token: string | null,
    requestId: string | null,
    id?: string,
  ) {
    const value = parseInput(userInputSchema, input)

    return this.database.write(async (transaction) => {
      const session = await this.auth.authenticate(
        token,
        id ? 'users:update' : 'users:create',
        transaction,
      )
      const existing = id ? await this.findUser(transaction, id) : null

      if (existing)
        await this.assertManageRole(transaction, session, existing.role)

      await this.assertManageRole(transaction, session, value.role)

      if (
        !(await transaction.department.findUnique({
          where: { id: value.departmentId },
        }))
      )
        throw new ApiError(400, 'invalid')

      if (
        id === session.user.id &&
        (value.status !== 'enabled' || value.role !== session.user.role)
      )
        throw new ApiError(409, 'selfProtected')

      if (
        existing &&
        existing.status !== value.status &&
        !session.permissions.includes('users:status')
      )
        throw new ApiError(403, 'forbidden')

      await this.validateUnique(transaction, value, id)

      const data = {
        ...value,
        usernameKey: value.username.toLowerCase(),
        emailKey: value.email.toLowerCase(),
      }
      const user = existing
        ? await transaction.user.update({ where: { id }, data })
        : await transaction.user.create({ data })

      if (
        existing &&
        (existing.role !== user.role || user.status === 'disabled')
      ) {
        await transaction.session.deleteMany({ where: { userId: user.id } })
      }

      await transaction.auditLog.create({
        data: {
          actorId: session.user.id,
          action: existing ? 'users.update' : 'users.create',
          resourceId: user.id,
          requestId,
        },
      })

      return userView(user)
    })
  }

  async delete(input: unknown, token: string | null, requestId: string | null) {
    const ids = [...new Set(parseInput(idsSchema, input).ids)]

    return this.database.write(async (transaction) => {
      const session = await this.auth.authenticate(
        token,
        'users:delete',
        transaction,
      )

      for (const id of ids) {
        const user = await this.findUser(transaction, id)

        await this.assertManageRole(transaction, session, user.role)

        if (id === session.user.id) throw new ApiError(409, 'selfProtected')
      }

      const result = await transaction.user.deleteMany({
        where: { id: { in: ids } },
      })

      await transaction.auditLog.createMany({
        data: ids.map((id) => ({
          actorId: session.user.id,
          action: 'users.delete',
          resourceId: id,
          requestId,
        })),
      })

      return { affected: result.count }
    })
  }

  async setCredential(
    id: string,
    input: unknown,
    token: string | null,
    requestId: string | null,
  ) {
    const { newPassword } = parseInput(credentialInputSchema, input)
    const passwordHash = await hashPassword(newPassword)

    await this.database.write(async (transaction) => {
      const session = await this.auth.authenticate(
        token,
        'users:credentials',
        transaction,
      )

      if (id === session.user.id) throw new ApiError(409, 'selfProtected')

      const user = await this.findUser(transaction, id)

      await this.assertManageRole(transaction, session, user.role)
      await replaceCredential(
        transaction,
        user.id,
        passwordHash,
        session.user.id,
        requestId,
      )
    })

    return null
  }

  async changeStatus(
    input: unknown,
    token: string | null,
    requestId: string | null,
  ) {
    const parsed = parseInput(statusInputSchema, input)
    const ids = [...new Set(parsed.ids)]

    return this.database.write(async (transaction) => {
      const session = await this.auth.authenticate(
        token,
        'users:status',
        transaction,
      )

      for (const id of ids) {
        const user = await this.findUser(transaction, id)

        await this.assertManageRole(transaction, session, user.role)

        if (id === session.user.id && parsed.status === 'disabled')
          throw new ApiError(409, 'selfProtected')
      }

      const result = await transaction.user.updateMany({
        where: { id: { in: ids } },
        data: { status: parsed.status },
      })

      if (parsed.status === 'disabled')
        await transaction.session.deleteMany({ where: { userId: { in: ids } } })

      await transaction.auditLog.createMany({
        data: ids.map((id) => ({
          actorId: session.user.id,
          action: `users.${parsed.status}`,
          resourceId: id,
          requestId,
        })),
      })

      return { affected: result.count }
    })
  }
}
