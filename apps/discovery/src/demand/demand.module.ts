import { Module } from '@nestjs/common';
import { DemandRepository } from './demand.repository';
import { DemandController } from './demand.controller';
import { DemandService } from './demand.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Demand, DemandSchema } from './schemas/demand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Demand.name, schema: DemandSchema }]),
  ],
  controllers: [DemandController],
  providers: [DemandService, DemandRepository],
  exports: [DemandService],
})
export class DemandModule {}
