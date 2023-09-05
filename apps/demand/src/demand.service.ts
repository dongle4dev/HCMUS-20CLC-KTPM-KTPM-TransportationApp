import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { lastValueFrom, map } from 'rxjs';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { DriverPositionDto } from 'y/common/dto/driver-location';
import { findDriversWithinRadius } from 'y/common/utils/findDrivers';
import {
  ClientProxy,
} from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { DRIVER_SERVICE, TRIP_SERVICE } from 'y/common/constants/services';
import { DemandGateway } from './gateway/gateway';
import { HttpService } from '@nestjs/axios';
import { UpdateTripDto } from 'y/common/dto/update-trip.dto';

@Injectable()
export class DemandService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(DRIVER_SERVICE) private driverClient: ClientProxy,
    @Inject(TRIP_SERVICE) private tripClient: ClientProxy,
    private readonly demandGateway: DemandGateway,
    private readonly httpService: HttpService,
  ) {}

  async requestRideFromCustomer(tripRequest: any) {
    this.broadcastToDrivers(tripRequest);
  }

  async requestRideFromHotline(tripRequest: any) {
    this.broadcastToDrivers(tripRequest);
  }

  async acceptTrip(tripRequest: UpdateTripDto) {
    await this.demandGateway.acceptTrip(tripRequest, tripRequest.driver);
  }

  async updateTrip(tripRequest: UpdateTripDto) {
    await this.demandGateway.updateTrip(tripRequest);
  }

  private async findDriversWithinLocation(
    customerPositionDto: CustomerPositionDto,
  ): Promise<DriverPositionDto[]> {
    let driversWithinRadius = [];
    const driversCache = JSON.parse(
      await this.cacheManager.get<string>('drivers'),
    );
    if (customerPositionDto) {
      driversWithinRadius = findDriversWithinRadius(
        customerPositionDto,
        driversCache,
      );
    } else {
    }
    return driversWithinRadius;
  }

 
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async broadcastToDrivers(tripRequest: any) {
    try {
      // const driversWithinRadius = await this.findDriversWithinLocation(
      //   tripRequest,
      // );

      let driversWithinRadius = [
        '64d0e842395500c957ed77f3',
        '64d354b63989da1720a474d0',
        '64e625e7d47d2c0909405e58'
      ];

      console.log('Driver in Cache: ', driversWithinRadius);

      if (driversWithinRadius) {
        for (const driver of driversWithinRadius) {
          const foundTrip = await lastValueFrom(this.tripClient.send({cmd: 'get_trip'}, tripRequest._id));
          
          if (foundTrip.driver) {
            break;
          }  
          console.log(`Sending broadcast to driver: ${driver}`);
          this.demandGateway.sendRequestTripMessage(tripRequest, driver);   
          await this.sleep(20000);     
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
}
