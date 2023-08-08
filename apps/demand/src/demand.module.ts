import { Module } from '@nestjs/common';
import { DemandController } from './demand.controller';
import { DemandService } from './demand.service';

@Module({
  imports: [],
  controllers: [DemandController],
  providers: [DemandService],
})
export class DemandModule {}
