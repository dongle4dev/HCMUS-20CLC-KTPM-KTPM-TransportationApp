import { Controller, Get } from '@nestjs/common';
import { DriversService } from './drivers.service';

@Controller('/driver')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  getHello(): string {
    return this.driversService.getHello();
  }
}