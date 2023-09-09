import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTripDto } from 'y/common';
import { Subject, map } from 'rxjs';
import { Trip } from 'y/common/database/trip/schema/trip.schema';
import { UpdateTripDto } from 'y/common/dto/update-trip.dto';

interface IMessage {
  data: string | object;
}

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);
  private readonly newTrips = new Subject();
  private readonly updateTrips = new Subject();

  newTripListener() {
    try {
      return this.newTrips
        .asObservable()
        .pipe(map((trip: Trip) => JSON.stringify(trip)));
    } catch (error) {
      this.logger.error('newTripListener : ' + error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async newTrip(trip): Promise<IMessage> {
    try {
      this.newTrips.next(trip);
      this.logger.log('tracking new trip: ', trip);
      return { data: 'Trip created successfully' };
    } catch (error) {
      this.logger.error('tracking new trip: ' + error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  updateTripListener() {
    try {
      return this.updateTrips
        .asObservable()
        .pipe(map((trip: Trip) => JSON.stringify(trip)));
    } catch (error) {
      this.logger.error('updateTripListener : ' + error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTrip(trip): Promise<IMessage> {
    try {
      this.updateTrips.next(trip);
      this.logger.log('tracking update trip: ', trip);
      return { data: 'Trip updated successfully' };
    } catch (error) {
      this.logger.error('tracking update trip: ' + error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
