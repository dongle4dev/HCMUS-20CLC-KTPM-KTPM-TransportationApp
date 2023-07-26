import { Module } from '@nestjs/common';
import { HotlinesController } from './hotlines.controller';
import { HotlinesService } from './hotlines.service';

@Module({
  imports: [],
  controllers: [HotlinesController],
  providers: [HotlinesService],
})
export class HotlinesModule {}
