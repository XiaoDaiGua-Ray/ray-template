import { Body, Controller, Get, Inject, Put, Query, Req } from '@nestjs/common'
import { parseApplicationRoutes } from '@ray-template/demo-data'
import type { Request } from 'express'
import { SERVER_CONFIG } from '../../config'
import type { Prisma } from '../../generated/prisma/client'
import { ApiError, requestIdFrom, tokenFrom } from '../../http'
import { DatabaseService } from '../../infrastructure/database'
import type { ServerConfig } from '../../platform/index'
import { Public, RequirePermission } from '../auth/auth.guard'
import { AuthService } from '../auth/auth.service'
import { withoutDemoRoutes } from './runtime-routes'

@Controller('admin/route-config')
export class RoutesController {
  constructor(
    @Inject(DatabaseService) private readonly database: DatabaseService,
    @Inject(AuthService) private readonly auth: AuthService,
    @Inject(SERVER_CONFIG) private readonly config: ServerConfig,
  ) {}

  @Public()
  @Get()
  async get(@Req() request: Request, @Query('view') view: unknown) {
    if (view !== void 0 && view !== 'editor') throw new ApiError(400, 'invalid')

    if (view === 'editor')
      await this.auth.authenticate(tokenFrom(request), 'routes:write')

    const record = await this.database.prisma.routeConfig.findUnique({
      where: { id: 'admin' },
    })

    if (!record) throw new ApiError(503, 'notInitialized')

    try {
      const routes = parseApplicationRoutes(JSON.stringify(record.config))

      return this.config.demoEnabled || view === 'editor'
        ? routes
        : withoutDemoRoutes(routes)
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
