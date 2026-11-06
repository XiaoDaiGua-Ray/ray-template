import { Inject, Injectable } from '@nestjs/common'
import {
  changePasswordSchema,
  loginInputSchema,
  profileInputSchema,
} from '@ray-template/api-contracts/admin'
import type { SessionInfo } from '@ray-template/api-contracts/admin'
import { SERVER_CONFIG } from '../../config'
import { ApiError, parseInput } from '../../http'
import { DatabaseService } from '../../infrastructure/database'
import type { Database } from '../../infrastructure/database'
import type { ServerConfig } from '../../platform/index'
import { signSession, verifySession } from './jwt'
import { hashPassword, tokenHash, verifyPassword } from './password'

export interface AuthContext extends SessionInfo {
  tokenHash: string
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DatabaseService) private readonly database: DatabaseService,
    @Inject(SERVER_CONFIG) private readonly config: ServerConfig,
  ) {}

  async authenticate(
    token: string | null,
    permission?: string,
    database: Database = this.database.prisma,
  ): Promise<AuthContext> {
    if (!token) throw new ApiError(401, 'unauthorized')

    const subject = await verifySession(this.config.jwtSecret, token)

    if (!subject) throw new ApiError(401, 'unauthorized')

    const hash = tokenHash(token)
    const session = await database.session.findUnique({
      where: { tokenHash: hash },
      include: {
        user: { include: { roleRecord: { include: { permissions: true } } } },
      },
    })

    if (
      !session ||
      session.userId !== subject ||
      session.expiresAt.getTime() <= Date.now() ||
      session.user.status !== 'enabled'
    )
      throw new ApiError(401, 'unauthorized')

    const { id, username, name, role, roleRecord } = session.user
    const permissions = roleRecord.permissions.map(
      ({ permissionCode }) => permissionCode,
    )

    if (permission && !permissions.includes(permission))
      throw new ApiError(403, 'forbidden')

    return {
      user: { id, username, name, role },
      permissions,
      expiresAt: session.expiresAt.toISOString(),
      tokenHash: hash,
    }
  }

  async login(input: unknown, requestId: string | null) {
    const { username, password } = parseInput(loginInputSchema, input)
    const user = await this.database.prisma.user.findUnique({
      where: { usernameKey: username.toLowerCase() },
      include: { credential: true },
    })
    const valid = await verifyPassword(
      password,
      user?.credential?.passwordHash ?? null,
    )

    if (!valid || !user || user.status !== 'enabled') {
      await this.database.prisma.auditLog.create({
        data: { action: 'auth.login.failed', requestId },
      })
      throw new ApiError(401, 'invalidCredentials')
    }

    const { token: accessToken, expiresAt } = await signSession(
      this.config.jwtSecret,
      user.id,
      this.config.sessionTtlSeconds,
    )
    const hash = tokenHash(accessToken)

    return this.database.write(async (transaction) => {
      const current = await transaction.user.findUnique({
        where: { id: user.id },
        include: {
          credential: true,
          roleRecord: { include: { permissions: true } },
        },
      })

      // 派生密码期间可能发生停用或重置；新会话必须以事务内的凭据状态为准。
      if (
        !current ||
        current.status !== 'enabled' ||
        current.credential?.passwordHash !== user.credential?.passwordHash
      )
        throw new ApiError(401, 'invalidCredentials')

      await transaction.session.deleteMany({
        where: { userId: user.id, expiresAt: { lte: new Date() } },
      })
      await transaction.session.create({
        data: { tokenHash: hash, userId: user.id, expiresAt },
      })
      await transaction.auditLog.create({
        data: { actorId: user.id, action: 'auth.login', requestId },
      })

      return {
        accessToken,
        expiresAt: expiresAt.toISOString(),
        user: {
          id: current.id,
          username: current.username,
          name: current.name,
          role: current.role,
        },
        permissions: current.roleRecord.permissions.map(
          ({ permissionCode }) => permissionCode,
        ),
      }
    })
  }

  async profile(id: string, database: Database = this.database.prisma) {
    const user = await database.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        email: true,
        phone: true,
        department: {
          select: { id: true, parentId: true, name: true, labelKey: true },
        },
      },
    })

    if (!user) throw new ApiError(401, 'unauthorized')

    const { labelKey, ...department } = user.department

    return {
      ...user,
      department: { ...department, ...(labelKey ? { labelKey } : {}) },
    }
  }

  async updateProfile(
    input: unknown,
    token: string | null,
    requestId: string | null,
  ) {
    const profile = parseInput(profileInputSchema, input)

    return this.database.write(async (transaction) => {
      const { user } = await this.authenticate(token, void 0, transaction)

      await transaction.user.update({ where: { id: user.id }, data: profile })
      await transaction.auditLog.create({
        data: { actorId: user.id, action: 'auth.profile.update', requestId },
      })

      return this.profile(user.id, transaction)
    })
  }

  async changePassword(
    input: unknown,
    token: string | null,
    actorId: string,
    requestId: string | null,
  ) {
    const { currentPassword, newPassword } = parseInput(
      changePasswordSchema,
      input,
    )
    const credential = await this.database.prisma.credential.findUnique({
      where: { userId: actorId },
    })

    if (
      !(await verifyPassword(
        currentPassword,
        credential?.passwordHash ?? null,
      )) ||
      !credential
    )
      throw new ApiError(400, 'invalidCurrentPassword')

    if (currentPassword === newPassword)
      throw new ApiError(400, 'passwordUnchanged')

    const passwordHash = await hashPassword(newPassword)

    await this.database.write(async (transaction) => {
      const { user } = await this.authenticate(token, void 0, transaction)
      const changed = await transaction.credential.updateMany({
        where: { userId: user.id, passwordHash: credential.passwordHash },
        data: { passwordHash },
      })

      if (!changed.count) throw new ApiError(409, 'credentialChanged')

      await transaction.session.deleteMany({ where: { userId: user.id } })
      await transaction.auditLog.create({
        data: { actorId: user.id, action: 'auth.password.change', requestId },
      })
    })

    return null
  }

  async logout(token: string | null, requestId: string | null) {
    await this.database.write(async (transaction) => {
      const session = await this.authenticate(token, void 0, transaction)

      await transaction.session.delete({
        where: { tokenHash: session.tokenHash },
      })
      await transaction.auditLog.create({
        data: { actorId: session.user.id, action: 'auth.logout', requestId },
      })
    })

    return null
  }
}
