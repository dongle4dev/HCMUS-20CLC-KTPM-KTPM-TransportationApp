import { Body, Controller, Delete, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripService } from './trip.service';
import { RmqService } from 'y/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class TripController {
  constructor(
    private readonly tripService: TripService,
    private readonly rmqService: RmqService,
  ) { }


  @EventPattern('create_trip')
  async createTrip(@Payload() createTripDto: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.createTrip(createTripDto);
  }
  
  @MessagePattern({ cmd: 'get_trips'})
  getAllTrip() {
    return this.tripService.getAllTrip();
  }

  @Get('')
  getAll() {
    return this.tripService.getAllTrip();
  }

  @Delete('delete-all')
  deleteAllTrip() {
    return this.tripService.deleteAllTrip();
  }
}
