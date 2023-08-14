import { Controller, Get } from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Controller()
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get()
  getHello(): string {
    return this.trackingService.getHello();
  }
}
