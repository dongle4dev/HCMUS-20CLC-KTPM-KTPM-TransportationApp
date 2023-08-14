import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TRACKING_SERVICE } from 'y/common/constants/services';
import { LocationsRepository } from 'y/common/database/location/repository/locations.repository';
import { Location } from 'y/common/database/location/schema/location.schema';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationsService {
  tripService: any;
  private readonly logger = new Logger(LocationsService.name);
  constructor(
    private readonly locationRepository: LocationsRepository,
    @Inject(TRACKING_SERVICE) private readonly trackingClient: ClientProxy,
  ) {}

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

  async locate(data: any) {
    this.logger.log('Locate...', data);

    await lastValueFrom(
      this.trackingClient.emit('trip_tracking_location', {
        data,
      }),
    );
  }
}
