import { Body, Controller, Get, Inject, Put, Query, Req } from '@nestjs/common'
import { filterRuntimeRoutes } from '@ray-template/api-contracts/routes'
import { parseApplicationRoutes } from '@ray-template/demo-data'
import type { Request } from 'express'
import { SERVER_CONFIG } from '../../config'
import type { Prisma } from '../../generated/prisma/client'
import { ApiError, requestIdFrom, tokenFrom } from '../../http'
import { DatabaseService } from '../../infrastructure/database'
import type { ServerConfig } from '../../platform/index'
import { authFrom, RequirePermission } from '../auth/auth.guard'
import type { AuthenticatedRequest } from '../auth/auth.guard'
import { AuthService } from '../auth/auth.service'

@Controller('admin/route-config')
export class RoutesController {
  constructor(
    @Inject(DatabaseService) private readonly database: DatabaseService,
    @Inject(AuthService) private readonly auth: AuthService,
    @Inject(SERVER_CONFIG) private readonly config: ServerConfig,
  ) {}

  @Get()
  async get(
    @Req() request: AuthenticatedRequest,
    @Query('view') view: unknown,
  ) {
    if (view !== void 0 && view !== 'editor') throw new ApiError(400, 'invalid')

    const session = authFrom(request)

    if (view === 'editor' && !session.permissions.includes('routes:write'))
      throw new ApiError(403, 'forbidden')

    const record = await this.database.prisma.routeConfig.findUnique({
      where: { id: 'admin' },
    })

    if (!record) throw new ApiError(503, 'notInitialized')

    try {
      const routes = parseApplicationRoutes(JSON.stringify(record.config))

      return view === 'editor'
        ? routes
        : filterRuntimeRoutes(routes, {
            role: session.user.role,
            permissions: session.permissions,
            demoEnabled: this.config.demoEnabled,
          })
    } catch {
      throw new ApiError(503, 'invalidRoutes')
    }
  }

  @Put()
  @RequirePermission('routes:write')
  save(@Body() input: unknown, @Req() request: Request) {
    let config: ReturnType<typeof parseApplicationRoutes>

    try {
      config = parseApplicationRoutes(JSON.stringify(input))
    } catch {
      throw new ApiError(400, 'invalidRoutes')
    }

    return this.database.write(async (transaction) => {
      const session = await this.auth.authenticate(
        tokenFrom(request),
        'routes:write',
        transaction,
      )

      await transaction.routeConfig.upsert({
        where: { id: 'admin' },
        create: { id: 'admin', config: config as Prisma.InputJsonValue },
        update: { config: config as Prisma.InputJsonValue },
      })
      await transaction.auditLog.create({
        data: {
          actorId: session.user.id,
          action: 'routes.update',
          resourceId: 'admin',
          requestId: requestIdFrom(request),
        },
      })

      return config
    })
  }
}
