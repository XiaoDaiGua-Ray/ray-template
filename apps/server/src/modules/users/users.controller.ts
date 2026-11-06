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
} from '@nestjs/common'
import type { Request } from 'express'
import { queryInput, requestIdFrom, tokenFrom } from '../../http'
import { RequirePermission } from '../auth/auth.guard'
import { UsersService } from './users.service'

@Controller('admin/users')
export class UsersController {
  constructor(@Inject(UsersService) private readonly users: UsersService) {}

  @Get('options')
  @RequirePermission('users:read')
  options(@Req() request: Request) {
    return this.users.options(tokenFrom(request))
  }

  @Get()
  @RequirePermission('users:read')
  list(@Query() query: Request['query']) {
    return this.users.list(queryInput(query))
  }

  @Get(':id')
  @RequirePermission('users:read')
  get(@Param('id') id: string) {
    return this.users.get(id)
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
}
