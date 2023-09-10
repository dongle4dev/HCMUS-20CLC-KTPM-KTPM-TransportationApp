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
    lat, long, broadcastRadius, vehicle
  ): Promise<DriverPositionDto[]> {
    let driversWithinRadius = [];
    const driversCache = JSON.parse(
      await this.cacheManager.get<string>('drivers'),
    );
    
    driversWithinRadius = await findDriversWithinRadius(
      lat, long, broadcastRadius, vehicle, driversCache,
    );

    return driversWithinRadius;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async broadcastToDrivers(tripRequest: any) {
    try {
      let broadcastRadius = 3;
      let isAccepted = false;
      let rejectedDriver = new Set();

      while (broadcastRadius <= 12 && isAccepted === false) {
        const driversWithinRadius = await this.findDriversWithinLocation(
          tripRequest.lat_pickup, 
          tripRequest.long_pickup,
          broadcastRadius,
          tripRequest.vehicleType === 1 ? 'bike' : 'car'
        );
          
        
        for (const driver of driversWithinRadius) {
          const foundTrip = await lastValueFrom(this.tripClient.send({cmd: 'get_trip'}, tripRequest._id));
          
          if (foundTrip.driver) {
            isAccepted = true;
            break;
          }  

          if (!rejectedDriver.has(driver.id.toString())) {
            rejectedDriver.add(driver.id.toString());
            console.log('Rejected driver', rejectedDriver);
            console.log(`Sending broadcast to driver: ${driver.id}`);
            this.demandGateway.sendRequestTripMessage(tripRequest, driver.id);   
            await this.sleep(15000);   
          } 
        }
        
        await this.sleep(10000);
        broadcastRadius *= 2;
      }

      let count = 1;

      while (count <= 5 && isAccepted === false) {
        const driversWithinRadius = await this.findDriversWithinLocation(
          tripRequest.lat_pickup, 
          tripRequest.long_pickup,
          broadcastRadius,
          tripRequest.vehicleType === 1 ? 'bike' : 'car'
        );

        
        for (const driver of driversWithinRadius) {
          const foundTrip = await lastValueFrom(this.tripClient.send({cmd: 'get_trip'}, tripRequest._id));
          
          if (foundTrip.driver) {
            isAccepted = true;
            break;
          }  
          if (!rejectedDriver.has(driver.id.toString())) {
            rejectedDriver.add(driver.id.toString());
            console.log('Rejected driver', rejectedDriver);
            console.log(`Sending broadcast to driver: ${driver.id}`);
            this.demandGateway.sendRequestTripMessage(tripRequest, driver.id);   
            await this.sleep(15000);   
          } 
        }
        await this.sleep(10000);
          
        count += 1;
      }

      return [];
    } catch (err) {
      console.error(err);
    }
  }
}
