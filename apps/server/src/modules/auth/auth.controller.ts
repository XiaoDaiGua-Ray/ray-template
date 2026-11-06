import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common'
import type { Request } from 'express'
import { requestIdFrom, tokenFrom } from '../../http'
import { Public } from './auth.guard'
import { AuthService } from './auth.service'

@Controller('admin/auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() input: unknown, @Req() request: Request) {
    return this.auth.login(input, requestIdFrom(request))
  }

  @Get('session')
  session(@Req() request: Request) {
    return this.auth.session(tokenFrom(request))
  }

  @Post('logout')
  logout(@Req() request: Request) {
    return this.auth.logout(tokenFrom(request), requestIdFrom(request))
  }
}
