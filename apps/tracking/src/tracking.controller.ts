import { Controller, Get, Query, Sse } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RmqService } from 'y/common';
import { TrackingService } from './tracking.service';

@Controller()
export class TrackingController {
  constructor(
    private readonly trackingService: TrackingService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('trip_tracking_hotline')
  async handleTripTrackingHotline(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    const dataService = data;
    //Thông báo rằng đã xong
    this.rmqService.ack(context);

    return this.trackingService.trackingTrip(dataService);
  }

  @EventPattern('trip_tracking_location')
  async handleTripTrackingLocation(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    const dataService = data;
    //Thông báo rằng đã xong
    this.rmqService.ack(context);

    return this.trackingService.trackingTrip(dataService);
  }

  @Sse('sse')
  sse(@Query('tripId') tripId: string): Observable<MessageEvent> {
    return this.trackingService.trackingTripForHotline(tripId);
  }
}
