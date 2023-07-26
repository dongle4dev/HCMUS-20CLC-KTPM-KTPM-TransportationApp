import { Controller, Get } from '@nestjs/common';
import { HotlinesService } from './hotlines.service';

@Controller()
export class HotlinesController {
  constructor(private readonly hotlinesService: HotlinesService) {}

  @Get()
  getHello(): string {
    return this.hotlinesService.getHello();
  }
}
