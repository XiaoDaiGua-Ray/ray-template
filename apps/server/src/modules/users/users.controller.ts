import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import { editRevision } from '@ray-template/api-contracts/admin'
import type { Request, Response } from 'express'
import { queryInput, requestIdFrom, tokenFrom } from '../../http'
import { authFrom, RequirePermission } from '../auth/auth.guard'
import type { AuthenticatedRequest } from '../auth/auth.guard'
import { UsersService } from './users.service'

@Controller('admin/users')
export class UsersController {
  constructor(@Inject(UsersService) private readonly users: UsersService) {}

  @Get('options')
  @RequirePermission('users:read')
  options(@Req() request: AuthenticatedRequest) {
    return this.users.options(authFrom(request))
  }

  @Get()
  @RequirePermission('users:read')
  list(@Query() query: Request['query']) {
    return this.users.list(queryInput(query))
  }

  @Get(':id')
  @RequirePermission('users:read')
  async get(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.users.get(id)

    response.locals.editRevision = await editRevision(user)

    return user
  }

  @Post()
  @RequirePermission('users:create')
  create(@Body() input: unknown, @Req() request: Request) {
    return this.users.save(input, tokenFrom(request), requestIdFrom(request))
  }

  @Put(':id')
  @RequirePermission('users:update')
  update(
    @Param('id') id: string,
    @Body() input: unknown,
    @Req() request: Request,
  ) {
    return this.users.save(
      input,
      tokenFrom(request),
      requestIdFrom(request),
      id,
      request.get('If-Match'),
    )
  }

  @Post('batch-delete')
  @RequirePermission('users:delete')
  delete(@Body() input: unknown, @Req() request: Request) {
    return this.users.delete(input, tokenFrom(request), requestIdFrom(request))
  }

  @Patch('status')
  @RequirePermission('users:status')
  status(@Body() input: unknown, @Req() request: Request) {
    return this.users.changeStatus(
      input,
      tokenFrom(request),
      requestIdFrom(request),
    )
  }

  @Put(':id/credential')
  @RequirePermission('users:credentials')
  setCredential(
    @Param('id') id: string,
    @Body() input: unknown,
    @Req() request: Request,
  ) {
    return this.users.setCredential(
      id,
      input,
      tokenFrom(request),
      requestIdFrom(request),
    )
  }
}
