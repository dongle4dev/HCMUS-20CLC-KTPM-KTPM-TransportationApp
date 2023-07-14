import { Module } from '@nestjs/common';
import { HotlineController } from './hotline.controller';
import { HotlineService } from './hotline.service';

@Module({
  imports: [],
  controllers: [HotlineController],
  providers: [HotlineService],
})
export class HotlineModule {}
