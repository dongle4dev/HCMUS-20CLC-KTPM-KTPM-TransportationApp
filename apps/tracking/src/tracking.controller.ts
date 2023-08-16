import { Body, Controller, Delete, Get, Post, UseGuards, Inject, Sse } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateTripDto } from 'apps/trips/src/dto/create-trip.dto';


interface IMessage {
  data: string | object;
}

@Controller('tracking-trip')
export class TrackingController {
  constructor(
    private readonly trackingService: TrackingService,
  ) {}

   @Sse('listener')
   notificationListener() {
     return this.trackingService.tripListener();
   }
 
   @Post()
   async updateTrip(@Body() createNotificationsDto: CreateTripDto): Promise<IMessage> {
     return await this.trackingService.updateTrip(createNotificationsDto);
   }


}
