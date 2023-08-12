import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripService } from './trip.service';
import { EventPattern, RmqContext } from '@nestjs/microservices';

@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) { }

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
}
