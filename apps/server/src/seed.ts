import {
  permissionCodes,
  userInputSchema,
} from '@ray-template/api-contracts/admin'
import { initialRoutes, initialUserOptions } from '@ray-template/demo-data'
import type { Prisma, PrismaClient } from './generated/prisma/client'
import { parseInput } from './http'
import { writeTransaction } from './infrastructure/database'
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
  const existing = await database.user.findUnique({
    where: { usernameKey: username.toLowerCase() },
  })

  if (!existing && !options.password)
    throw new Error(
      'ADMIN_PASSWORD is required to initialize the first administrator.',
    )

  const passwordHash = !existing ? await hashPassword(options.password!) : null

  return database.$transaction(
    async (transaction) => {
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
      const current = await transaction.user.findUnique({
        where: { usernameKey: username.toLowerCase() },
      })

      if (current) return { userId: current.id, created: false }

      if (!passwordHash)
        throw new Error(
          'ADMIN_PASSWORD is required to initialize the first administrator.',
        )

      const user = await transaction.user.create({
        data: {
          ...value,
          usernameKey: value.username.toLowerCase(),
          emailKey: value.email.toLowerCase(),
          credential: { create: { passwordHash } },
        },
      })

      if (!existing)
        await transaction.auditLog.create({
          data: { action: 'system.bootstrap', resourceId: user.id },
        })

      return { userId: user.id, created: !existing }
    },
    { timeout: 15000 },
  )
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

    await transaction.credential.upsert({
      where: { userId: user.id },
      create: { userId: user.id, passwordHash },
      update: { passwordHash },
    })
    await transaction.session.deleteMany({ where: { userId: user.id } })
    await transaction.auditLog.create({
      data: { action: 'credentials.reset', resourceId: user.id },
    })
  })
}
