import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripService } from './trip.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from 'y/common';

@Controller('trips')
export class TripController {
  constructor(
    private readonly tripService: TripService,
    private readonly rmqService: RmqService,
  ) {}

  // @UseGuards(new UserAuthGuard())
  // @Post('create')
  // createLocation(@Body() createTripDto: CreateTripDto) {
  //   return this.tripService.createLocationForCustomer(createTripDto);
  // }
  @Get('get-all')
  getAlltrip() {
    return this.tripService.getAllTrip();
  }

  @Delete('delete-all')
  deleteAllLocaitons() {
    return this.tripService.deleteAllTrip();
  }

  @EventPattern('find_trip_tracking')
  findTripForTracking(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(data);
    this.tripService.findTripForTracking(data);
    this.rmqService.ack(context);
  }

  @EventPattern('update_trip_tracking')
  updateTripStatus(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(data);
    this.tripService.updateTripStatus(data);
    this.rmqService.ack(context);
  }
}
