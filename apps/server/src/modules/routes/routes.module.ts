import { Module } from '@nestjs/common'
import { RoutesController } from './routes.controller'

@Module({ controllers: [RoutesController] })
export class RoutesModule {}
