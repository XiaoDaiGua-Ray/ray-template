import { Inject, Injectable, SetMetadata } from '@nestjs/common'
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'
import { tokenFrom } from '../../http'
import { AuthService } from './auth.service'
import type { AuthContext } from './auth.service'

const PUBLIC = Symbol('public')
const PERMISSION = Symbol('permission')
const AUTH = Symbol('auth')

export type AuthenticatedRequest = Request & { [AUTH]: AuthContext }
export const authFrom = (request: AuthenticatedRequest) => request[AUTH]

export const Public = () => SetMetadata(PUBLIC, true)
export const RequirePermission = (permission: string) =>
  SetMetadata(PERMISSION, permission)

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(AuthService) private readonly auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const targets = [context.getHandler(), context.getClass()]

    if (this.reflector.getAllAndOverride<boolean>(PUBLIC, targets)) return true

    const permission = this.reflector.getAllAndOverride<string>(
      PERMISSION,
      targets,
    )
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()

    request[AUTH] = await this.auth.authenticate(tokenFrom(request), permission)

    return true
  }
}
