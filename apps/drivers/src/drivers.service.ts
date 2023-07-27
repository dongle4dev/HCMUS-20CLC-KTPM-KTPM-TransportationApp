import { Injectable } from '@nestjs/common';
import { CreateDriverRequest } from '../dto/create-driver.request';
import { DriversRepository } from './drivers.repository';

@Injectable()
export class DriversService {
  constructor(private readonly driversRepository: DriversRepository) { }

  async createDriver(request: CreateDriverRequest) {
    return this.driversRepository.create(request);
  }

  async getDrivers() {
    return this.driversRepository.find({});
  }
}
