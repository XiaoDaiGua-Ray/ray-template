import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { SERVER_CONFIG } from '../../config'
import { requestIdFrom, tokenFrom } from '../../http'
import type { ServerConfig } from '../../platform/config'
import {
  browserSessionRequested,
  writeSessionCookie,
} from '../../platform/session'
import { authFrom, Public } from './auth.guard'
import type { AuthenticatedRequest } from './auth.guard'
import { AuthService } from './auth.service'

@Controller('admin/auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly auth: AuthService,
    @Inject(SERVER_CONFIG) private readonly config: ServerConfig,
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body() input: unknown,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.auth.login(input, requestIdFrom(request))

    if (!browserSessionRequested(request)) return session

    writeSessionCookie(response, this.config.sessionCookieSecure, session)
    const { user, permissions, expiresAt } = session

    return { user, permissions, expiresAt }
  }

  @Get('session')
  session(@Req() request: AuthenticatedRequest) {
    const { user, permissions, expiresAt } = authFrom(request)

    return { user, permissions, expiresAt }
  }

  @Get('profile')
  profile(@Req() request: AuthenticatedRequest) {
    return this.auth.profile(authFrom(request).user.id)
  }

  @Patch('profile')
  updateProfile(@Body() input: unknown, @Req() request: Request) {
    return this.auth.updateProfile(
      input,
      tokenFrom(request),
      requestIdFrom(request),
    )
  }

  @Patch('password')
  async changePassword(
    @Body() input: unknown,
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.auth.changePassword(
      input,
      tokenFrom(request),
      authFrom(request).user.id,
      requestIdFrom(request),
    )
    this.clearBrowserSession(request, response)

    return null
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.auth.logout(tokenFrom(request), requestIdFrom(request))
    this.clearBrowserSession(request, response)

    return null
  }

  private clearBrowserSession(request: Request, response: Response) {
    if (browserSessionRequested(request))
      writeSessionCookie(response, this.config.sessionCookieSecure)
  }
}
