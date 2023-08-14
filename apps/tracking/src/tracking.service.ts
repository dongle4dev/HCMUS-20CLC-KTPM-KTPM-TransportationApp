import { Injectable, Logger } from '@nestjs/common';
import { TrackingTripDto } from './dto/tracking-trip.dto';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  // constructor() {}
  getHello(): string {
    return 'Hello World!';
  }

  async trackingTrip(data: TrackingTripDto) {
    this.logger.log('Tracking ...', data);
    return data;
  }
}
