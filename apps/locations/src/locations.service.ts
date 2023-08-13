import { Injectable, Logger } from '@nestjs/common';
import { LocationsRepository } from 'y/common/database/location/repository/locations.repository';
import { Location } from 'y/common/database/location/schema/location.schema';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationsService {
  tripService: any;
  private readonly logger = new Logger(LocationsService.name);
  constructor(private readonly locationRepository: LocationsRepository) {}

  private async updateCustomerLocationTimes(location): Promise<Location> {
    const timesCustomer = location.times + 1;
    const locationUpdated = await this.locationRepository.findOneAndUpdate(
      {
        phone: location.phone,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      {
        times: timesCustomer,
      },
    );
    return locationUpdated;
  }

  async createLocationForCustomer(
    createLocationDto: CreateLocationDto,
  ): Promise<Location> {
    const previousLocationCustomer = await this.locationRepository.findOne(
      createLocationDto,
    );
    if (previousLocationCustomer) {
      return this.updateCustomerLocationTimes(previousLocationCustomer);
    } else {
      return this.locationRepository.create(createLocationDto);
    }
  }

  async getAllLocations(): Promise<Location[]> {
    return this.locationRepository.find({});
  }

  async deleteAllLocations(): Promise<{ msg: string }> {
    await this.locationRepository.deleteMany({});
    return { msg: 'Delete All the Locations in hotline ' };
  } 

  locate(data: any) {
    this.logger.log('Locate...', data);
    
  }
}


