import {
  permissionCodes,
  userInputSchema,
} from '@ray-template/api-contracts/admin'
import { initialRoutes, initialUserOptions } from '@ray-template/demo-data'
import type { Prisma, PrismaClient } from './generated/prisma/client'
import { parseInput } from './http'
import { writeTransaction } from './infrastructure/database'
import { replaceCredential } from './modules/auth/credentials'
import { hashPassword } from './modules/auth/password'

const permissionsFor = (role: string) =>
  role === 'admin'
    ? permissionCodes.filter((code) => code !== 'users:reset')
    : role === 'manager'
      ? [
          'users:read',
          'users:create',
          'users:update',
          'users:status',
          'routes:read',
        ]
      : ['users:read', 'routes:read']

export async function seedDatabase(
  database: PrismaClient,
  options: { username?: string; email?: string; password?: string },
) {
  return writeTransaction(database, async (transaction) => {
    for (const department of initialUserOptions.departments) {
      await transaction.department.upsert({
        where: { id: department.id },
        create: department,
        update: {},
      })
    }

    for (const code of permissionCodes.filter(
      (code) => code !== 'users:reset',
    )) {
      await transaction.permission.upsert({
        where: { code },
        create: { code },
        update: {},
      })
    }

    for (const role of initialUserOptions.roles) {
      await transaction.role.upsert({
        where: { value: role.value },
        create: {
          value: role.value,
          label: role.label,
          labelKey: role.labelKey,
          permissions: {
            create: permissionsFor(role.value).map((permissionCode) => ({
              permissionCode,
            })),
          },
        },
        update: {},
      })
    }

    await transaction.routeConfig.upsert({
      where: { id: 'admin' },
      create: { id: 'admin', config: initialRoutes as Prisma.InputJsonValue },
      update: {},
    })
    // 初始化身份以审计记录为准，管理员改名或修改配置后不会创建旧账号。
    const bootstrap = await transaction.auditLog.findFirst({
      where: { action: 'system.bootstrap' },
      orderBy: { createdAt: 'asc' },
    })

    if (bootstrap?.resourceId)
      return { userId: bootstrap.resourceId, created: false }

    const existing = await transaction.user.findFirst({
      where: { role: 'admin' },
    })

    if (existing) {
      await transaction.auditLog.create({
        data: { action: 'system.bootstrap', resourceId: existing.id },
      })

      return { userId: existing.id, created: false }
    }

    if (await transaction.user.count())
      throw new Error(
        'Existing users found without an administrator. Restore administrator access explicitly.',
      )

    if (!options.password)
      throw new Error(
        'ADMIN_PASSWORD is required to initialize the first administrator.',
      )

    const username = options.username ?? 'admin'
    const value = parseInput(userInputSchema, {
      username,
      email: options.email ?? `${username}@example.com`,
      name: username,
      phone: '',
      role: 'admin',
      status: 'enabled',
      departmentId: 'engineering',
      remark: '',
    })
    const passwordHash = await hashPassword(options.password)
    const user = await transaction.user.create({
      data: {
        ...value,
        usernameKey: value.username.toLowerCase(),
        emailKey: value.email.toLowerCase(),
        credential: { create: { passwordHash } },
      },
    })

    await transaction.auditLog.create({
      data: { action: 'system.bootstrap', resourceId: user.id },
    })

    return { userId: user.id, created: true }
  })
}

export async function setPassword(
  database: PrismaClient,
  username: string,
  password: string,
) {
  const passwordHash = await hashPassword(password)

  await writeTransaction(database, async (transaction) => {
    const user = await transaction.user.findUnique({
      where: { usernameKey: username.trim().toLowerCase() },
    })

    if (!user) throw new Error('The requested account does not exist.')

    await replaceCredential(transaction, user.id, passwordHash)
  })
}
