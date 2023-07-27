import { Module } from '@nestjs/common';
import { SupplyRepository } from './supply.repository';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Supply, SupplySchema } from './schemas/supply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Supply.name, schema: SupplySchema }]),
  ],
  controllers: [SupplyController],
  providers: [SupplyService, SupplyRepository],
  exports: [SupplyService],
})
export class SupplyModule {}
