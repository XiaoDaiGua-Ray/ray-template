import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import {
  chartsQuerySchema,
  chartsSchema,
  orderSearchInputSchema,
  ownerSearchInputSchema,
  personListQuerySchema,
  requestFixtureSchema,
  routePeopleQuerySchema,
  searchOptionsQuerySchema,
  searchOptionsSchema,
} from '@ray-template/api-contracts/demo'
import {
  getDemoCharts,
  getOrderOptions,
  listPeople,
  listRouteDemoPeople,
  requestFixture,
  routeDemoPeople,
  searchDemoOrders,
  searchDemoOwners,
} from '@ray-template/demo-data'
import type { Request } from 'express'
import * as v from 'valibot'
import { ApiError, parseInput, queryInput } from '../../http'
import { PlatformLifecycle } from '../../platform/lifecycle'
import { Public } from '../auth/auth.guard'

@Public()
@Controller('admin/demo')
export class DemoController {
  constructor(
    @Inject(PlatformLifecycle) private readonly platform: PlatformLifecycle,
  ) {}

  @Get('request')
  requestFixture() {
    return this.cached('request', () => requestFixture, requestFixtureSchema)
  }

  @Get('charts')
  charts(@Query() query: Request['query']) {
    const { refresh } = parseInput(
      chartsQuerySchema,
      queryInput(query, ['refresh']),
    )

    return refresh
      ? getDemoCharts(true)
      : this.cached('charts', getDemoCharts, chartsSchema)
  }

  @Get('search-options')
  options(@Query() query: Request['query']) {
    const { locale = 'zh-CN' } = parseInput(searchOptionsQuerySchema, query)
    const language = locale === 'zh-CN' ? 'zh-CN' : 'en-US'

    return this.cached(
      `options:${language}`,
      () => getOrderOptions(language),
      searchOptionsSchema,
    )
  }

  @Get('people')
  people(@Query() query: Request['query']) {
    const input = parseInput(personListQuerySchema, queryInput(query, ['fail']))

    if (input.fail) throw new ApiError(503, 'requestFailed')

    return listPeople({
      ...input,
      page: input.page ?? 1,
      pageSize: input.pageSize ?? 10,
    })
  }

  @Get('route-people')
  routePeople(@Query() query: Request['query']) {
    return listRouteDemoPeople(
      parseInput(routePeopleQuerySchema, queryInput(query)),
    )
  }

  @Get('route-people/:id')
  routePerson(@Param('id') id: string) {
    const key = Number(id)

    if (!/^\d+$/u.test(id) || !Number.isSafeInteger(key))
      throw new ApiError(400, 'invalid')

    const person = routeDemoPeople.find((row) => row.key === key)

    if (!person) throw new ApiError(404, 'notFound')

    return person
  }

  @Post('owners/search')
  owners(@Body() body: unknown) {
    const { orgId, keyword, locale, fail } = parseInput(
      ownerSearchInputSchema,
      body,
    )

    if (fail) throw new ApiError(503, 'requestFailed')

    return searchDemoOwners(orgId, keyword, locale)
  }

  @Post('orders/search')
  orders(@Body() body: unknown) {
    const { query, locale, fail } = parseInput(orderSearchInputSchema, body)

    if (fail) throw new ApiError(503, 'requestFailed')

    return searchDemoOrders(query, locale)
  }

  private cached<T>(
    key: string,
    load: () => T,
    schema: v.GenericSchema<unknown, T>,
  ) {
    return this.platform.cache.getOrLoad(
      `demo:v1:${key}`,
      300,
      async () => load(),
      (value): value is T => v.is(schema, value),
    )
  }
}
