import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateDriverRequest } from '../dto/create-driver.request';
import { DriversService } from './drivers.service';

@Controller('/drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) { }

  @Post()
  async createDriver(@Body() request: CreateDriverRequest) {
    return this.driversService.createDriver(request);
  }

  @Get()
  async getDrivers() {
    return this.driversService.getDrivers();
  }
}
