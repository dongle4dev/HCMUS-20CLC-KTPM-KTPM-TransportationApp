import { Module } from '@nestjs/common';
import { DemandController } from './demand.controller';
import { DemandService } from './demand.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Demand,
  DemandSchema,
} from 'y/common/database/discovery/demand/schema/demand.schema';
import { DemandRepository } from 'y/common/database/discovery/demand/repository/demand.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Demand.name, schema: DemandSchema }]),
  ],
  controllers: [DemandController],
  providers: [DemandService, DemandRepository],
  exports: [DemandService],
})
export class DemandModule {}
