import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTripDto } from 'apps/trips/src/dto/create-trip.dto';
import { Subject, map } from 'rxjs';
import { Trip } from 'y/common/database/trip/schema/trip.schema';

interface IMessage {
  data: string | object;
}

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);
  private readonly subject = new Subject();

  tripListener() {
    try {
      return this.subject
        .asObservable()
        .pipe(map((trip: Trip) => JSON.stringify(trip)));
    } catch (error) {
      this.logger.error('tripListener : ' + error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTrip(trip: CreateTripDto): Promise<IMessage> {
    try {
      this.subject.next(trip);
      this.logger.log('tracking update trip: ', trip);
      return { data: 'Trip updated successfully' };
    } catch (error) {
      this.logger.error('updateTrip : ' + error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
