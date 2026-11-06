import { Injectable } from '@nestjs/common'
import type { OnApplicationShutdown } from '@nestjs/common'
import type { PlatformRuntime } from './runtime'

@Injectable()
export class PlatformLifecycle implements OnApplicationShutdown {
  runtime: PlatformRuntime | null = null

  get cache() {
    if (!this.runtime) throw new Error('Platform has not started.')

    return this.runtime.cache
  }

  async onApplicationShutdown() {
    await this.runtime?.close()
  }
}
