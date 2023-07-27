import { Module } from '@nestjs/common';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';

@Module({
  imports: [],
  controllers: [CallsController],
  providers: [CallsService],
})
export class CallsModule {}
