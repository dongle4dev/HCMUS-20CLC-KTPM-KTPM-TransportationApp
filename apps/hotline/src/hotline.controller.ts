import { Controller, Get } from '@nestjs/common';
import { HotlineService } from './hotline.service';

@Controller()
export class HotlineController {
  constructor(private readonly hotlineService: HotlineService) {}

  @Get()
  getHello(): string {
    return this.hotlineService.getHello();
  }
}
