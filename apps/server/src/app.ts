import 'reflect-metadata'
import { Module } from '@nestjs/common'
import type { DynamicModule } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { ApiExceptionFilter, EnvelopeInterceptor } from './http'
import { DatabaseModule, DatabaseService } from './infrastructure/database'
import { AuthModule } from './modules/auth/auth.module'
import { DemoController } from './modules/demo/demo.controller'
import { RoutesModule } from './modules/routes/routes.module'
import { UsersModule } from './modules/users/users.module'
import { loadServerConfig, PlatformRuntime } from './platform/index'
import type { LogSink, ServerConfig } from './platform/index'
import { PlatformLifecycle } from './platform/lifecycle'

@Module({})
export class AppModule {
  static register(config: ServerConfig): DynamicModule {
    return {
      module: AppModule,
      imports: [
        DatabaseModule.register(config),
        AuthModule,
        UsersModule,
        RoutesModule,
      ],
      controllers: config.demoEnabled ? [DemoController] : [],
      providers: [PlatformLifecycle],
    }
  }
}

export async function createApp(
  config: ServerConfig = loadServerConfig(),
  options: { logSink?: LogSink } = {},
) {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.register(config),
    {
      logger: false,
      bodyParser: false,
      abortOnError: false,
    },
  )

  try {
    const database = app.get(DatabaseService)
    const runtime = await PlatformRuntime.create(config, {
      checkDatabase: () => database.ping(),
      logSink: options.logSink,
    })

    app.get(PlatformLifecycle).runtime = runtime
    runtime.install(app)
    app.setGlobalPrefix('api')
    app.useGlobalInterceptors(new EnvelopeInterceptor())
    app.useGlobalFilters(new ApiExceptionFilter())
    await app.init()

    return app
  } catch (error) {
    await app.close()
    throw error
  }
}
