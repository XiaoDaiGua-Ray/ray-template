import { Global, Inject, Injectable, Module } from '@nestjs/common'
import type {
  DynamicModule,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { SERVER_CONFIG } from '../config'
import { PrismaClient } from '../generated/prisma/client'
import type { Prisma } from '../generated/prisma/client'
import type { ServerConfig } from '../platform/index'

export function createDatabase(databaseUrl: string) {
  const schema = new URL(databaseUrl).searchParams.get('schema') ?? 'public'
  const adapter = new PrismaPg(
    { connectionString: databaseUrl, connectionTimeoutMillis: 5000, max: 10 },
    { schema },
  )

  return new PrismaClient({ adapter })
}

export type Database = PrismaClient | Prisma.TransactionClient

export async function writeTransaction<T>(
  database: PrismaClient,
  action: (transaction: Prisma.TransactionClient) => Promise<T>,
) {
  // 权限复核和目标变更放在同一事务内，避免并发降权后仍写入数据。
  for (let attempt = 0; ; attempt++) {
    try {
      return await database.$transaction(action, {
        isolationLevel: 'Serializable',
        maxWait: 5000,
        timeout: 10000,
      })
    } catch (error) {
      if (
        attempt < 2 &&
        error instanceof Error &&
        'code' in error &&
        error.code === 'P2034'
      )
        continue

      throw error
    }
  }
}

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  readonly prisma: PrismaClient

  constructor(@Inject(SERVER_CONFIG) config: ServerConfig) {
    this.prisma = createDatabase(config.databaseUrl)
  }

  async onModuleInit() {
    await this.prisma.$connect()
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect()
  }

  async ping() {
    await this.prisma.$queryRaw`SELECT 1`
  }

  async write<T>(
    action: (transaction: Prisma.TransactionClient) => Promise<T>,
  ) {
    return writeTransaction(this.prisma, action)
  }
}

@Global()
@Module({})
export class DatabaseModule {
  static register(config: ServerConfig): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        { provide: SERVER_CONFIG, useValue: config },
        DatabaseService,
      ],
      exports: [SERVER_CONFIG, DatabaseService],
    }
  }
}
