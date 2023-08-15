import { Injectable, Logger } from '@nestjs/common';
import { TripService } from 'apps/trips/src/trip.service';
import { Observable } from 'rxjs';
import { TrackingTripDto } from './dto/tracking-trip.dto';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(private readonly tripService: TripService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async trackingTrip(data: TrackingTripDto) {
    this.logger.log('Tracking ...', data);
    return data;
  }

  trackingTripForHotline(tripId: string): Observable<MessageEvent> {
    return new Observable((observer) => {
      const intervalId = setInterval(() => {
        const trip = this.tripService.findTripForTracking(tripId);
        const temp = 'Completed';
        if (temp === 'Completed') {
          const eventData = JSON.stringify({ event: 'completed' });
          const messageEvent = new MessageEvent('message', { data: eventData });
          observer.next(messageEvent);
          observer.complete();
          clearInterval(intervalId);
        } else {
          const eventData = JSON.stringify({
            event: 'in-progress',
            timestamp: new Date(),
          });
          const messageEvent = new MessageEvent('message', { data: eventData });
          observer.next(messageEvent);
        }
      }, 1000);
    });
  }
}
